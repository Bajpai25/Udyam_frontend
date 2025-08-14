export interface ScrapedField {
  name: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    message?: string
  }
  options?: Array<{ value: string; text: string }>
  step: number
}

export interface ScrapedFormData {
  title: string
  steps: Array<{
    stepNumber: number
    title: string
    fields: ScrapedField[]
  }>
  validationRules: Array<{
    field: string
    rule: string
    message: string
  }>
  metadata: {
    scrapedAt: string
    url: string
    version: string
  }
}
