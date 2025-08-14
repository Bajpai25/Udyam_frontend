import { chromium, type Browser, type Page } from "playwright"
import * as fs from "fs-extra"
import * as path from "path"
import type { ScrapedFormData, ScrapedField } from "./types"
import { ScraperUtils } from "./utils"

/**
 * Enhanced scraper with better error handling and fallback mechanisms
 */
export class EnhancedUdyamScraper {
  private browser: Browser | null = null
  private page: Page | null = null
  private baseUrl = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
  private outputDir = path.join(__dirname, "../output")
  private screenshotsDir = path.join(__dirname, "../screenshots")
  private fallbackSchemaPath = path.join(__dirname, "fallback-schema.json")

  async initialize(): Promise<void> {
    console.log("🚀 Initializing Enhanced Udyam Scraper...")

    await fs.ensureDir(this.outputDir)
    await fs.ensureDir(this.screenshotsDir)

    this.browser = await chromium.launch({
      headless: process.env.NODE_ENV === "production",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    })

    this.page = await this.browser.newPage()

    // Set realistic browser context
    await this.page.setViewportSize({ width: 1366, height: 768 })
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    )

    // Set extra headers
    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    })
  }

  async scrapeWithFallback(): Promise<ScrapedFormData> {
    try {
      console.log("🎯 Attempting to scrape live Udyam form...")
      return await this.scrapeLiveForm()
    } catch (error) {
      console.warn("⚠️ Live scraping failed, using fallback schema:", error)
      return await this.loadFallbackSchema()
    }
  }

  private async scrapeLiveForm(): Promise<ScrapedFormData> {
    if (!this.page) throw new Error("Browser not initialized")

    console.log("📄 Navigating to Udyam registration page...")

    // Navigate with retry mechanism
    let retries = 3
    while (retries > 0) {
      try {
        await this.page.goto(this.baseUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        })
        break
      } catch (error) {
        retries--
        if (retries === 0) throw error
        console.log(`Retrying navigation... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Wait for page to stabilize
    await this.page.waitForTimeout(3000)

    // Take initial screenshot
    await ScraperUtils.saveScreenshot(this.page, "udyam-main-page", this.screenshotsDir)

    const scrapedData: ScrapedFormData = {
      title: await this.getPageTitle(),
      steps: [],
      validationRules: [],
      metadata: {
        scrapedAt: new Date().toISOString(),
        url: this.baseUrl,
        version: "1.0.0",
      },
    }

    // Scrape available form elements
    const allFields = await this.scrapeAllFormElements()

    // Organize fields by steps
    const step1Fields = allFields.filter((field) => this.isStep1Field(field))
    const step2Fields = allFields.filter((field) => this.isStep2Field(field))

    if (step1Fields.length > 0) {
      scrapedData.steps.push({
        stepNumber: 1,
        title: "Aadhaar Verification",
        fields: step1Fields,
      })
    }

    if (step2Fields.length > 0) {
      scrapedData.steps.push({
        stepNumber: 2,
        title: "PAN Verification",
        fields: step2Fields,
      })
    }

    // Add validation rules
    scrapedData.validationRules = this.generateValidationRules(allFields)

    return scrapedData
  }

  private async scrapeAllFormElements(): Promise<ScrapedField[]> {
    if (!this.page) throw new Error("Page not initialized")

    const fields: ScrapedField[] = []

    try {
      // Wait for any form elements to load
      await this.page.waitForSelector("input, select, textarea", { timeout: 10000 })

      // Get all form elements
      const formElements = await this.page.$$("input, select, textarea")

      for (const element of formElements) {
        try {
          const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
          let fieldInfo: ScrapedField | null = null

          if (tagName === "select") {
            fieldInfo = await this.extractSelectField(element)
          } else {
            fieldInfo = await this.extractInputField(element)
          }

          if (fieldInfo && ScraperUtils.validateField(fieldInfo)) {
            fields.push(fieldInfo)
          }
        } catch (error) {
          console.warn("Could not extract field:", error)
        }
      }

      console.log(`✅ Extracted ${fields.length} form fields`)
    } catch (error) {
      console.warn("Could not find form elements:", error)
    }

    return fields
  }

  private async extractInputField(element: any): Promise<ScrapedField | null> {
    try {
      const type = (await element.getAttribute("type")) || "text"
      const name = (await element.getAttribute("name")) || (await element.getAttribute("id")) || "unknown"
      const placeholder = (await element.getAttribute("placeholder")) || ""
      const required = await element.hasAttribute("required")
      const maxLength = await element.getAttribute("maxlength")
      const minLength = await element.getAttribute("minlength")

      // Get label
      const label = (await this.findFieldLabel(element)) || placeholder || ScraperUtils.cleanText(name)

      // Determine field name and step
      const fieldName = this.determineFieldName(name, placeholder, label)
      const step = this.determineFieldStep(fieldName, label)

      return {
        name: fieldName,
        type: ScraperUtils.detectFieldType(element),
        label: ScraperUtils.cleanText(label),
        placeholder: ScraperUtils.cleanText(placeholder),
        required,
        step,
        validation: {
          ...(maxLength && { maxLength: Number.parseInt(maxLength) }),
          ...(minLength && { minLength: Number.parseInt(minLength) }),
          pattern: ScraperUtils.extractValidationPattern(element, fieldName),
        },
      }
    } catch (error) {
      console.warn("Error extracting input field:", error)
      return null
    }
  }

  private async extractSelectField(element: any): Promise<ScrapedField | null> {
    try {
      const name = (await element.getAttribute("name")) || (await element.getAttribute("id")) || "unknown"
      const required = await element.hasAttribute("required")
      const label = (await this.findFieldLabel(element)) || ScraperUtils.cleanText(name)

      // Extract options
      const options = []
      const optionElements = await element.$$("option")

      for (const option of optionElements) {
        const value = await option.getAttribute("value")
        const text = await option.textContent()

        if (value && text && value.trim() !== "" && text.trim() !== "") {
          options.push({
            value: value.trim(),
            text: ScraperUtils.cleanText(text),
          })
        }
      }

      const fieldName = this.determineFieldName(name, "", label)
      const step = this.determineFieldStep(fieldName, label)

      return {
        name: fieldName,
        type: "select",
        label: ScraperUtils.cleanText(label),
        required,
        options,
        step,
      }
    } catch (error) {
      console.warn("Error extracting select field:", error)
      return null
    }
  }

  private async findFieldLabel(element: any): Promise<string> {
    try {
      // Try multiple strategies to find the label
      const strategies = [
        // Associated label by 'for' attribute
        async () => {
          const id = await element.getAttribute("id")
          if (id) {
            const label = await this.page!.$(`label[for="${id}"]`)
            if (label) return await label.textContent()
          }
          return null
        },
        // Parent label
        async () => {
          const parentLabel = await element.$("xpath=ancestor::label[1]")
          if (parentLabel) return await parentLabel.textContent()
          return null
        },
        // Preceding label
        async () => {
          const precedingLabel = await element.$("xpath=preceding-sibling::label[1]")
          if (precedingLabel) return await precedingLabel.textContent()
          return null
        },
        // Nearby text content
        async () => {
          const parent = await element.$("xpath=..")
          if (parent) {
            const text = await parent.textContent()
            return text?.split("\n")[0] // Get first line
          }
          return null
        },
      ]

      for (const strategy of strategies) {
        const result = await strategy()
        if (result && result.trim()) {
          return result.trim()
        }
      }

      return ""
    } catch (error) {
      return ""
    }
  }

  private determineFieldName(name: string, placeholder: string, label: string): string {
    const combined = `${name} ${placeholder} ${label}`.toLowerCase()

    if (combined.includes("aadhaar") || combined.includes("aadhar")) return "aadhaarNumber"
    if (combined.includes("pan")) return "panNumber"
    if (combined.includes("mobile") || combined.includes("phone")) return "mobileNumber"
    if (combined.includes("otp")) return "aadhaarOtp"
    if (combined.includes("father")) return "fatherName"
    if (combined.includes("applicant") || combined.includes("name")) return "applicantName"
    if (combined.includes("birth") || combined.includes("dob")) return "dateOfBirth"
    if (combined.includes("gender")) return "gender"
    if (combined.includes("category")) return "category"
    if (combined.includes("email")) return "emailId"
    if (combined.includes("pin") || combined.includes("postal")) return "pinCode"
    if (combined.includes("address")) return "address"
    if (combined.includes("city")) return "city"
    if (combined.includes("state")) return "state"
    if (combined.includes("district")) return "district"

    return ScraperUtils.generateFieldName(name || label || placeholder)
  }

  private determineFieldStep(fieldName: string, label: string): number {
    const step1Fields = ["aadhaarNumber", "mobileNumber", "aadhaarOtp"]
    const step2Fields = ["panNumber", "applicantName", "fatherName", "dateOfBirth", "gender", "category"]

    if (step1Fields.includes(fieldName)) return 1
    if (step2Fields.includes(fieldName)) return 2

    // Fallback based on label content
    const labelLower = label.toLowerCase()
    if (labelLower.includes("aadhaar") || labelLower.includes("otp")) return 1
    if (labelLower.includes("pan") || labelLower.includes("name") || labelLower.includes("birth")) return 2

    return 1 // Default to step 1
  }

  private isStep1Field(field: ScrapedField): boolean {
    return field.step === 1 || ["aadhaarNumber", "mobileNumber", "aadhaarOtp"].includes(field.name)
  }

  private isStep2Field(field: ScrapedField): boolean {
    return (
      field.step === 2 ||
      ["panNumber", "applicantName", "fatherName", "dateOfBirth", "gender", "category"].includes(field.name)
    )
  }

  private generateValidationRules(fields: ScrapedField[]): Array<{ field: string; rule: string; message: string }> {
    const rules = []

    for (const field of fields) {
      if (field.validation?.pattern) {
        rules.push({
          field: field.name,
          rule: field.validation.pattern,
          message: field.validation.message || `Invalid ${field.label}`,
        })
      }
    }

    return rules
  }

  private async loadFallbackSchema(): Promise<ScrapedFormData> {
    console.log("📋 Loading fallback schema...")

    try {
      const fallbackData = await fs.readJSON(this.fallbackSchemaPath)

      // Update metadata
      fallbackData.metadata = {
        ...fallbackData.metadata,
        scrapedAt: new Date().toISOString(),
        fallbackUsed: true,
        note: "Using fallback schema due to scraping failure",
      }

      return fallbackData
    } catch (error) {
      throw new Error("Could not load fallback schema: " + error)
    }
  }

  private async getPageTitle(): Promise<string> {
    if (!this.page) return "Udyam Registration"

    try {
      const title = await this.page.title()
      return title || "Udyam Registration"
    } catch (error) {
      return "Udyam Registration"
    }
  }

  async saveScrapedData(data: ScrapedFormData): Promise<void> {
    const outputPath = path.join(this.outputDir, "udyam-form-schema.json")

    console.log("💾 Saving scraped data to:", outputPath)

    // Load existing data and merge if available
    const existingData = await ScraperUtils.loadExistingData(this.outputDir)
    const mergedData = ScraperUtils.mergeScrapedData(existingData, data)

    await fs.writeJSON(outputPath, mergedData, { spaces: 2 })

    // Also save a minified version
    const minifiedPath = path.join(this.outputDir, "udyam-form-schema.min.json")
    await fs.writeJSON(minifiedPath, mergedData)

    console.log("✅ Scraped data saved successfully!")
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      console.log("🧹 Browser closed successfully")
    }
  }
}

// Main execution
async function main() {
  const scraper = new EnhancedUdyamScraper()

  try {
    await scraper.initialize()

    console.log("🎯 Starting enhanced Udyam form scraping...")
    const scrapedData = await scraper.scrapeWithFallback()

    await scraper.saveScrapedData(scrapedData)

    console.log("📊 Scraping Summary:")
    console.log(`- Total steps: ${scrapedData.steps.length}`)
    console.log(`- Total fields: ${scrapedData.steps.reduce((acc, step) => acc + step.fields.length, 0)}`)
    console.log(`- Validation rules: ${scrapedData.validationRules.length}`)
    console.log(`- Fallback used: ${scrapedData.metadata.fallbackUsed || false}`)
  } catch (error) {
    console.error("❌ Enhanced scraping failed:", error)
    process.exit(1)
  } finally {
    await scraper.cleanup()
  }
}

if (require.main === module) {
  main()
}
