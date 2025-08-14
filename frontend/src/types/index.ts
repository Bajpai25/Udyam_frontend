export interface UdyamFormData {
  // Step 1
  aadhaarNumber: string
  mobileNumber: string
  aadhaarOtp?: string

  // Step 2
  panNumber: string
  applicantName: string
  fatherName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  category?: "general" | "obc" | "sc" | "st"

  // Address
  address?: string
  pinCode?: string
  city?: string
  state?: string
  district?: string

  // Contact
  emailId?: string
}

export interface RegistrationResponse {
  id: string
  aadhaarNumber: string
  panNumber?: string
  applicantName?: string
  mobileNumber: string
  emailId?: string
  currentStep: number
  isCompleted: boolean
  isAadhaarVerified: boolean
  isPanVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface PinCodeInfo {
  pinCode: string
  isValid: boolean
  city: string
  district: string
  state: string
  country: string
  message: string
}
