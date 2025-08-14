import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.error || error.message || "An error occurred"
    return Promise.reject(new Error(message))
  },
)

export const registrationApi = {
  submitStep1: (data: { aadhaarNumber: string; mobileNumber: string }) => apiClient.post("/registration/step1", data),

  verifyAadhaarOtp: (data: { aadhaarNumber: string; aadhaarOtp: string }) =>
    apiClient.post("/registration/step1/verify-otp", data),

  submitStep2: (data: any) => apiClient.post("/registration/step2", data),

  getRegistrationStatus: (aadhaarNumber: string) => apiClient.get(`/registration/status/${aadhaarNumber}`),

  getAllRegistrations: (page = 1, limit = 10) => apiClient.get(`/registration?page=${page}&limit=${limit}`),
}

export const validationApi = {
  validateAadhaar: (aadhaarNumber: string) => apiClient.post("/validation/aadhaar", { aadhaarNumber }),

  validatePan: (panNumber: string) => apiClient.post("/validation/pan", { panNumber }),

  validateMobile: (mobileNumber: string) => apiClient.post("/validation/mobile", { mobileNumber }),

  getPinCodeInfo: (pinCode: string) => apiClient.get(`/validation/pincode/${pinCode}`),

  getValidationRules: () => apiClient.get("/validation/rules"),
}

export const formApi = {
  getFormFields: () => apiClient.get("/form/fields"),

  getFormFieldsByStep: (step: number) => apiClient.get(`/form/fields/step/${step}`),

  getFormSchema: () => apiClient.get("/form/schema"),

  refreshFormSchema: () => apiClient.post("/form/schema/refresh"),
}
