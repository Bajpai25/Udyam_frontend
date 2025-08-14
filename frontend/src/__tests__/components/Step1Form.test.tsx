import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Step1Form } from "../../components/forms/Step1Form"

// Mock the API service
vi.mock("../../services/api", () => ({
  submitStep1: vi.fn(),
  validateField: vi.fn(),
}))

describe("Step1Form", () => {
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders all required fields", () => {
    render(<Step1Form onSuccess={mockOnSuccess} />)

    expect(screen.getByLabelText(/aadhaar number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send otp/i })).toBeInTheDocument()
  })

  it("validates Aadhaar number format", async () => {
    render(<Step1Form onSuccess={mockOnSuccess} />)

    const aadhaarInput = screen.getByLabelText(/aadhaar number/i)
    fireEvent.change(aadhaarInput, { target: { value: "12345" } })
    fireEvent.blur(aadhaarInput)

    await waitFor(() => {
      expect(screen.getByText(/aadhaar must be exactly 12 digits/i)).toBeInTheDocument()
    })
  })

  it("validates mobile number format", async () => {
    render(<Step1Form onSuccess={mockOnSuccess} />)

    const mobileInput = screen.getByLabelText(/mobile number/i)
    fireEvent.change(mobileInput, { target: { value: "123" } })
    fireEvent.blur(mobileInput)

    await waitFor(() => {
      expect(screen.getByText(/mobile number must be 10 digits/i)).toBeInTheDocument()
    })
  })

  it("accepts valid input", async () => {
    render(<Step1Form onSuccess={mockOnSuccess} />)

    const aadhaarInput = screen.getByLabelText(/aadhaar number/i)
    const mobileInput = screen.getByLabelText(/mobile number/i)

    fireEvent.change(aadhaarInput, { target: { value: "123456789012" } })
    fireEvent.change(mobileInput, { target: { value: "9876543210" } })

    await waitFor(() => {
      expect(screen.queryByText(/aadhaar must be exactly 12 digits/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/mobile number must be 10 digits/i)).not.toBeInTheDocument()
    })
  })

  it("disables submit button when form is invalid", () => {
    render(<Step1Form onSuccess={mockOnSuccess} />)

    const submitButton = screen.getByRole("button", { name: /send otp/i })
    expect(submitButton).toBeDisabled()
  })

  it("enables submit button when form is valid", async () => {
    render(<Step1Form onSuccess={mockOnSuccess} />)

    const aadhaarInput = screen.getByLabelText(/aadhaar number/i)
    const mobileInput = screen.getByLabelText(/mobile number/i)

    fireEvent.change(aadhaarInput, { target: { value: "123456789012" } })
    fireEvent.change(mobileInput, { target: { value: "9876543210" } })

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /send otp/i })
      expect(submitButton).not.toBeDisabled()
    })
  })
})
