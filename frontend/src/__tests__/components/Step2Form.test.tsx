import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Step2Form } from "../../components/forms/Step2Form"

// Mock the API service
vi.mock("../../services/api", () => ({
  submitStep2: vi.fn(),
  validateField: vi.fn(),
}))

describe("Step2Form", () => {
  const mockOnSuccess = vi.fn()
  const mockSessionId = "test-session-id"

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders all required fields", () => {
    render(<Step2Form sessionId={mockSessionId} onSuccess={mockOnSuccess} />)

    expect(screen.getByLabelText(/pan number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
  })

  it("validates PAN number format", async () => {
    render(<Step2Form sessionId={mockSessionId} onSuccess={mockOnSuccess} />)

    const panInput = screen.getByLabelText(/pan number/i)
    fireEvent.change(panInput, { target: { value: "INVALID" } })
    fireEvent.blur(panInput)

    await waitFor(() => {
      expect(screen.getByText(/pan must be in format: ABCDE1234F/i)).toBeInTheDocument()
    })
  })

  it("validates email format", async () => {
    render(<Step2Form sessionId={mockSessionId} onSuccess={mockOnSuccess} />)

    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: "invalid-email" } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it("accepts valid input", async () => {
    render(<Step2Form sessionId={mockSessionId} onSuccess={mockOnSuccess} />)

    const panInput = screen.getByLabelText(/pan number/i)
    const emailInput = screen.getByLabelText(/email address/i)

    fireEvent.change(panInput, { target: { value: "ABCDE1234F" } })
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })

    await waitFor(() => {
      expect(screen.queryByText(/pan must be in format/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/invalid email format/i)).not.toBeInTheDocument()
    })
  })

  it("converts PAN to uppercase", async () => {
    render(<Step2Form sessionId={mockSessionId} onSuccess={mockOnSuccess} />)

    const panInput = screen.getByLabelText(/pan number/i) as HTMLInputElement
    fireEvent.change(panInput, { target: { value: "abcde1234f" } })

    await waitFor(() => {
      expect(panInput.value).toBe("ABCDE1234F")
    })
  })
})
