export const validateAadhaar = (aadhaar: string): boolean => {
  if (!aadhaar || aadhaar.trim() === "") return false
  const cleanAadhaar = aadhaar.replace(/\s/g, "")
  return cleanAadhaar.length === 12 && /^\d+$/.test(cleanAadhaar)
}

export const validatePAN = (pan: string): boolean => {
  if (!pan || pan.trim() === "") return false
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan.trim())
}

export const validateMobile = (mobile: string): boolean => {
  if (!mobile || mobile.trim() === "") return false
  const cleanMobile = mobile.replace(/\D/g, "")
  return cleanMobile.length === 10 && /^[6-9]/.test(cleanMobile)
}

export const validateEmail = (email: string): boolean => {
  if (!email || email.trim() === "") return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export const validateOTP = (otp: string): boolean => {
  if (!otp || otp.trim() === "") return false
  const cleanOTP = otp.replace(/\D/g, "")
  return cleanOTP.length === 6
}

export const formatAadhaar = (aadhaar: string): string => {
  const clean = aadhaar.replace(/\D/g, "")
  const match = clean.match(/^(\d{4})(\d{4})(\d{4})$/)
  return match ? `${match[1]} ${match[2]} ${match[3]}` : clean
}

export const formatMobile = (mobile: string): string => {
  const clean = mobile.replace(/\D/g, "")
  const match = clean.match(/^(\d{5})(\d{5})$/)
  return match ? `${match[1]} ${match[2]}` : clean
}

export const formatPAN = (pan: string): string => {
  return pan.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

export const getValidationMessage = (field: string, value: string): string => {
  switch (field) {
    case "aadhaar":
      if (!value) return "Aadhaar number is required"
      if (!validateAadhaar(value)) return "Aadhaar must be 12 digits"
      return ""
    case "pan":
      if (!value) return "PAN number is required"
      if (!validatePAN(value)) return "PAN must be in format: ABCDE1234F"
      return ""
    case "mobile":
      if (!value) return "Mobile number is required"
      if (!validateMobile(value)) return "Mobile number must be 10 digits starting with 6-9"
      return ""
    case "email":
      if (!value) return "Email address is required"
      if (!validateEmail(value)) return "Please enter a valid email address"
      return ""
    case "otp":
      if (!value) return "OTP is required"
      if (!validateOTP(value)) return "OTP must be 6 digits"
      return ""
    default:
      return ""
  }
}
