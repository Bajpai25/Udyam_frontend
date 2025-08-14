import * as fs from "fs-extra"
import * as path from "path"

/**
 * Utility functions for the scraper
 */

export class ScraperUtils {
  /**
   * Clean and normalize text content
   */
  static cleanText(text: string): string {
    return text.replace(/\s+/g, " ").replace(/\n+/g, " ").trim()
  }

  /**
   * Generate field name from label
   */
  static generateFieldName(label: string): string {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/^_+|_+$/g, "")
  }

  /**
   * Detect field type from input attributes
   */
  static detectFieldType(element: any): string {
    const type = element.getAttribute("type")
    const tagName = element.tagName?.toLowerCase()

    if (tagName === "select") return "select"
    if (tagName === "textarea") return "textarea"
    if (type === "radio") return "radio"
    if (type === "checkbox") return "checkbox"
    if (type === "email") return "email"
    if (type === "tel") return "tel"
    if (type === "date") return "date"
    if (type === "number") return "number"

    return "text"
  }

  /**
   * Extract validation pattern from various sources
   */
  static extractValidationPattern(element: any, fieldName: string): string | undefined {
    // Check for pattern attribute
    const pattern = element.getAttribute("pattern")
    if (pattern) return pattern

    // Infer pattern from field name
    const name = fieldName.toLowerCase()

    if (name.includes("aadhaar")) {
      return "^[0-9]{12}$"
    }

    if (name.includes("pan")) {
      return "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
    }

    if (name.includes("mobile") || name.includes("phone")) {
      return "^[6-9][0-9]{9}$"
    }

    if (name.includes("pin") || name.includes("postal")) {
      return "^[0-9]{6}$"
    }

    if (name.includes("email")) {
      return "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    }

    return undefined
  }

  /**
   * Save screenshot with timestamp
   */
  static async saveScreenshot(page: any, name: string, outputDir: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${name}-${timestamp}.png`
    const filepath = path.join(outputDir, filename)

    await page.screenshot({
      path: filepath,
      fullPage: true,
    })

    return filepath
  }

  /**
   * Load existing scraped data if available
   */
  static async loadExistingData(outputDir: string): Promise<any | null> {
    const filepath = path.join(outputDir, "udyam-form-schema.json")

    try {
      if (await fs.pathExists(filepath)) {
        return await fs.readJSON(filepath)
      }
    } catch (error) {
      console.warn("Could not load existing data:", error)
    }

    return null
  }

  /**
   * Validate scraped field data
   */
  static validateField(field: any): boolean {
    return !!(field.name && field.type && field.label && typeof field.step === "number")
  }

  /**
   * Merge scraped data with existing data
   */
  static mergeScrapedData(existing: any, newData: any): any {
    if (!existing) return newData

    // Merge steps, avoiding duplicates
    const mergedSteps = [...existing.steps]

    for (const newStep of newData.steps) {
      const existingStepIndex = mergedSteps.findIndex((s) => s.stepNumber === newStep.stepNumber)

      if (existingStepIndex >= 0) {
        // Merge fields within the step
        const existingStep = mergedSteps[existingStepIndex]
        const mergedFields = [...existingStep.fields]

        for (const newField of newStep.fields) {
          const existingFieldIndex = mergedFields.findIndex((f) => f.name === newField.name)

          if (existingFieldIndex >= 0) {
            mergedFields[existingFieldIndex] = { ...mergedFields[existingFieldIndex], ...newField }
          } else {
            mergedFields.push(newField)
          }
        }

        mergedSteps[existingStepIndex] = { ...existingStep, fields: mergedFields }
      } else {
        mergedSteps.push(newStep)
      }
    }

    return {
      ...existing,
      ...newData,
      steps: mergedSteps,
      metadata: {
        ...existing.metadata,
        ...newData.metadata,
        lastUpdated: new Date().toISOString(),
      },
    }
  }
}
