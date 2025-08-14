import { chromium, type Browser, type Page } from "playwright"
import * as fs from "fs-extra"
import * as path from "path"
import type { ScrapedFormData, ScrapedField } from "./types"

class UdyamScraper {
  private browser: Browser | null = null
  private page: Page | null = null
  private baseUrl = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
  private outputDir = path.join(__dirname, "../output")
  private screenshotsDir = path.join(__dirname, "../screenshots")

  async initialize(): Promise<void> {
    console.log("🚀 Initializing Playwright browser...")

    // Ensure output directories exist
    await fs.ensureDir(this.outputDir)
    await fs.ensureDir(this.screenshotsDir)

    // Launch browser with specific options for better scraping
    this.browser = await chromium.launch({
      headless: false, // Set to true for production
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    })

    this.page = await this.browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    })

    // Set viewport
    await this.page.setViewportSize({ width: 1366, height: 768 })
  }

  async scrapeUdyamForm(): Promise<ScrapedFormData> {
    if (!this.page) throw new Error("Browser not initialized")

    console.log("📄 Navigating to Udyam registration page...")

    try {
      // Navigate to the main page
      await this.page.goto(this.baseUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      })

      // Take initial screenshot
      await this.page.screenshot({
        path: path.join(this.screenshotsDir, "udyam-main-page.png"),
        fullPage: true,
      })

      console.log("🔍 Scraping form structure...")

      // Initialize scraped data structure
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

      // Scrape Step 1: Aadhaar Details
      const step1Fields = await this.scrapeStep1()
      scrapedData.steps.push({
        stepNumber: 1,
        title: "Aadhaar Verification",
        fields: step1Fields,
      })

      // Navigate to Step 2 (if possible) and scrape PAN details
      const step2Fields = await this.scrapeStep2()
      scrapedData.steps.push({
        stepNumber: 2,
        title: "PAN Verification",
        fields: step2Fields,
      })

      // Extract validation rules
      scrapedData.validationRules = await this.extractValidationRules()

      return scrapedData
    } catch (error) {
      console.error("❌ Error during scraping:", error)
      throw error
    }
  }

  private async getPageTitle(): Promise<string> {
    if (!this.page) throw new Error("Page not initialized")

    const title = await this.page.title()
    return title || "Udyam Registration"
  }

  private async scrapeStep1(): Promise<ScrapedField[]> {
    if (!this.page) throw new Error("Page not initialized")

    console.log("📋 Scraping Step 1: Aadhaar verification fields...")

    const fields: ScrapedField[] = []

    try {
      // Wait for the main form to load
      await this.page.waitForSelector("form", { timeout: 10000 })

      // Look for Aadhaar number input field
      const aadhaarField = await this.page.$('input[type="text"]')
      if (aadhaarField) {
        const fieldInfo = await this.extractFieldInfo(aadhaarField, "aadhaarNumber")
        if (fieldInfo) {
          fields.push({
            ...fieldInfo,
            step: 1,
            validation: {
              pattern: "^[0-9]{12}$",
              minLength: 12,
              maxLength: 12,
              message: "Aadhaar number must be 12 digits",
            },
          })
        }
      }

      // Look for mobile number field (often present in step 1)
      const mobileFields = await this.page.$$('input[type="text"], input[type="tel"]')
      for (const field of mobileFields) {
        const placeholder = await field.getAttribute("placeholder")
        const name = await field.getAttribute("name")

        if (placeholder?.toLowerCase().includes("mobile") || name?.toLowerCase().includes("mobile")) {
          const fieldInfo = await this.extractFieldInfo(field, "mobileNumber")
          if (fieldInfo) {
            fields.push({
              ...fieldInfo,
              step: 1,
              validation: {
                pattern: "^[6-9][0-9]{9}$",
                minLength: 10,
                maxLength: 10,
                message: "Mobile number must be 10 digits starting with 6-9",
              },
            })
          }
        }
      }

      // Look for OTP field (might appear after Aadhaar submission)
      const otpField = await this.page.$('input[maxlength="6"], input[placeholder*="OTP"], input[name*="otp"]')
      if (otpField) {
        const fieldInfo = await this.extractFieldInfo(otpField, "aadhaarOtp")
        if (fieldInfo) {
          fields.push({
            ...fieldInfo,
            step: 1,
            validation: {
              pattern: "^[0-9]{6}$",
              minLength: 6,
              maxLength: 6,
              message: "OTP must be 6 digits",
            },
          })
        }
      }

      // Look for dropdown fields (state, district, etc.)
      const selectFields = await this.page.$$("select")
      for (const select of selectFields) {
        const fieldInfo = await this.extractSelectFieldInfo(select, 1)
        if (fieldInfo) {
          fields.push(fieldInfo)
        }
      }

      // Take screenshot of step 1
      await this.page.screenshot({
        path: path.join(this.screenshotsDir, "step1-aadhaar.png"),
        fullPage: true,
      })
    } catch (error) {
      console.warn("⚠️ Warning: Could not fully scrape Step 1:", error)
    }

    return fields
  }

  private async scrapeStep2(): Promise<ScrapedField[]> {
    if (!this.page) throw new Error("Page not initialized")

    console.log("📋 Scraping Step 2: PAN verification fields...")

    const fields: ScrapedField[] = []

    try {
      // Try to navigate to step 2 or look for PAN fields on the same page
      const panField = await this.page.$('input[placeholder*="PAN"], input[name*="pan"], input[maxlength="10"]')

      if (panField) {
        const fieldInfo = await this.extractFieldInfo(panField, "panNumber")
        if (fieldInfo) {
          fields.push({
            ...fieldInfo,
            step: 2,
            validation: {
              pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
              minLength: 10,
              maxLength: 10,
              message: "PAN must be in format: ABCDE1234F",
            },
          })
        }
      }

      // Look for name fields that typically appear with PAN
      const nameFields = await this.page.$$('input[type="text"]')
      for (const field of nameFields) {
        const placeholder = await field.getAttribute("placeholder")
        const name = await field.getAttribute("name")

        if (placeholder?.toLowerCase().includes("name") || name?.toLowerCase().includes("name")) {
          const fieldName = name?.toLowerCase().includes("father") ? "fatherName" : "applicantName"
          const fieldInfo = await this.extractFieldInfo(field, fieldName)
          if (fieldInfo) {
            fields.push({
              ...fieldInfo,
              step: 2,
              validation: {
                minLength: 2,
                maxLength: 100,
                message: "Name must be between 2 and 100 characters",
              },
            })
          }
        }
      }

      // Look for date fields (DOB)
      const dateFields = await this.page.$$('input[type="date"], input[placeholder*="date"]')
      for (const field of dateFields) {
        const fieldInfo = await this.extractFieldInfo(field, "dateOfBirth")
        if (fieldInfo) {
          fields.push({
            ...fieldInfo,
            step: 2,
            validation: {
              message: "Please enter a valid date of birth",
            },
          })
        }
      }

      // Look for gender radio buttons
      const genderRadios = await this.page.$$('input[type="radio"][name*="gender"]')
      if (genderRadios.length > 0) {
        const options = []
        for (const radio of genderRadios) {
          const value = await radio.getAttribute("value")
          const label = await this.getFieldLabel(radio)
          if (value && label) {
            options.push({ value, text: label })
          }
        }

        if (options.length > 0) {
          fields.push({
            name: "gender",
            type: "radio",
            label: "Gender",
            required: true,
            options,
            step: 2,
          })
        }
      }

      // Take screenshot of step 2
      await this.page.screenshot({
        path: path.join(this.screenshotsDir, "step2-pan.png"),
        fullPage: true,
      })
    } catch (error) {
      console.warn("⚠️ Warning: Could not fully scrape Step 2:", error)
    }

    return fields
  }

  private async extractFieldInfo(element: any, suggestedName: string): Promise<ScrapedField | null> {
    try {
      const name = (await element.getAttribute("name")) || suggestedName
      const type = (await element.getAttribute("type")) || "text"
      const placeholder = (await element.getAttribute("placeholder")) || ""
      const required = (await element.getAttribute("required")) !== null
      const maxLength = await element.getAttribute("maxlength")
      const minLength = await element.getAttribute("minlength")

      // Get associated label
      const label = (await this.getFieldLabel(element)) || placeholder || name

      return {
        name,
        type,
        label,
        placeholder,
        required,
        step: 1, // Will be overridden by caller
        validation: {
          ...(maxLength && { maxLength: Number.parseInt(maxLength) }),
          ...(minLength && { minLength: Number.parseInt(minLength) }),
        },
      }
    } catch (error) {
      console.warn("Could not extract field info:", error)
      return null
    }
  }

  private async extractSelectFieldInfo(element: any, step: number): Promise<ScrapedField | null> {
    try {
      const name = (await element.getAttribute("name")) || "unknown"
      const required = (await element.getAttribute("required")) !== null
      const label = (await this.getFieldLabel(element)) || name

      // Extract options
      const options = []
      const optionElements = await element.$$("option")

      for (const option of optionElements) {
        const value = await option.getAttribute("value")
        const text = await option.textContent()

        if (value && text && value !== "" && text.trim() !== "") {
          options.push({ value, text: text.trim() })
        }
      }

      return {
        name,
        type: "select",
        label,
        required,
        options,
        step,
      }
    } catch (error) {
      console.warn("Could not extract select field info:", error)
      return null
    }
  }

  private async getFieldLabel(element: any): Promise<string> {
    try {
      // Try to find associated label
      const id = await element.getAttribute("id")
      if (id) {
        const label = await this.page!.$(`label[for="${id}"]`)
        if (label) {
          const labelText = await label.textContent()
          return labelText?.trim() || ""
        }
      }

      // Try to find parent label
      const parentLabel = await element.$("xpath=ancestor::label[1]")
      if (parentLabel) {
        const labelText = await parentLabel.textContent()
        return labelText?.trim() || ""
      }

      // Try to find preceding label
      const precedingLabel = await element.$("xpath=preceding-sibling::label[1]")
      if (precedingLabel) {
        const labelText = await precedingLabel.textContent()
        return labelText?.trim() || ""
      }

      return ""
    } catch (error) {
      return ""
    }
  }

  private async extractValidationRules(): Promise<Array<{ field: string; rule: string; message: string }>> {
    const rules = [
      {
        field: "aadhaarNumber",
        rule: "^[0-9]{12}$",
        message: "Aadhaar number must be exactly 12 digits",
      },
      {
        field: "panNumber",
        rule: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        message: "PAN must be in format: ABCDE1234F (5 letters, 4 numbers, 1 letter)",
      },
      {
        field: "mobileNumber",
        rule: "^[6-9][0-9]{9}$",
        message: "Mobile number must be 10 digits starting with 6, 7, 8, or 9",
      },
      {
        field: "aadhaarOtp",
        rule: "^[0-9]{6}$",
        message: "OTP must be exactly 6 digits",
      },
      {
        field: "pinCode",
        rule: "^[0-9]{6}$",
        message: "PIN code must be exactly 6 digits",
      },
    ]

    return rules
  }

  async saveScrapedData(data: ScrapedFormData): Promise<void> {
    const outputPath = path.join(this.outputDir, "udyam-form-schema.json")

    console.log("💾 Saving scraped data to:", outputPath)

    await fs.writeJSON(outputPath, data, { spaces: 2 })

    // Also save a minified version
    const minifiedPath = path.join(this.outputDir, "udyam-form-schema.min.json")
    await fs.writeJSON(minifiedPath, data)

    console.log("✅ Scraped data saved successfully!")
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      console.log("🧹 Browser closed successfully")
    }
  }
}

// Main execution function
async function main() {
  const scraper = new UdyamScraper()

  try {
    await scraper.initialize()

    console.log("🎯 Starting Udyam form scraping...")
    const scrapedData = await scraper.scrapeUdyamForm()

    await scraper.saveScrapedData(scrapedData)

    console.log("📊 Scraping Summary:")
    console.log(`- Total steps: ${scrapedData.steps.length}`)
    console.log(`- Total fields: ${scrapedData.steps.reduce((acc, step) => acc + step.fields.length, 0)}`)
    console.log(`- Validation rules: ${scrapedData.validationRules.length}`)
  } catch (error) {
    console.error("❌ Scraping failed:", error)
    process.exit(1)
  } finally {
    await scraper.cleanup()
  }
}

// Run the scraper if this file is executed directly
if (require.main === module) {
  main()
}

export { UdyamScraper }
