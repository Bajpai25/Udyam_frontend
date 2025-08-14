import { describe, it, expect } from "vitest"
import { validateAadhaar, validatePAN, validateMobile, validateEmail } from "../../utils/validation"

describe("Validation Utils", () => {
  describe("validateAadhaar", () => {
    it("should validate correct Aadhaar", () => {
      expect(validateAadhaar("123456789012")).toBe(true)
    })

    it("should reject invalid Aadhaar", () => {
      expect(validateAadhaar("12345")).toBe(false)
      expect(validateAadhaar("12345678901a")).toBe(false)
      expect(validateAadhaar("")).toBe(false)
    })
  })

  describe("validatePAN", () => {
    it("should validate correct PAN", () => {
      expect(validatePAN("ABCDE1234F")).toBe(true)
    })

    it("should reject invalid PAN", () => {
      expect(validatePAN("INVALID")).toBe(false)
      expect(validatePAN("abcde1234f")).toBe(false)
      expect(validatePAN("")).toBe(false)
    })
  })

  describe("validateMobile", () => {
    it("should validate correct mobile", () => {
      expect(validateMobile("9876543210")).toBe(true)
    })

    it("should reject invalid mobile", () => {
      expect(validateMobile("123")).toBe(false)
      expect(validateMobile("98765432101")).toBe(false)
      expect(validateMobile("")).toBe(false)
    })
  })

  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true)
    })

    it("should reject invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false)
      expect(validateEmail("")).toBe(false)
    })
  })
})
