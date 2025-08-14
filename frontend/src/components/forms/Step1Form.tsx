"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "react-query"
import { FormField } from "../ui/FormField"
import { Button } from "../ui/Button"
import { Alert } from "../ui/Alert"
import { useRegistrationStore } from "../../store/registrationStore"
import { registrationApi } from "../../services/api"
import { Smartphone, Shield, ArrowRight } from "lucide-react"

const step1Schema = z.object({
  aadhaarNumber: z
    .string()
    .regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits")
    .min(12, "Aadhaar number must be 12 digits")
    .max(12, "Aadhaar number must be 12 digits"),
  mobileNumber: z
    .string()
    .regex(/^[6-9][0-9]{9}$/, "Mobile number must be 10 digits starting with 6-9")
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits"),
})

type Step1FormData = z.infer<typeof step1Schema>

export function Step1Form() {
  const [showOtpField, setShowOtpField] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const { updateFormData, nextStep } = useRegistrationStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
  })

  const submitStep1Mutation = useMutation(registrationApi.submitStep1, {
    onSuccess: () => {
      setShowOtpField(true)
    },
  })

  const verifyOtpMutation = useMutation(registrationApi.verifyAadhaarOtp, {
    onSuccess: (data) => {
      updateFormData(getValues())
      nextStep()
    },
  })

  const onSubmitStep1 = (data: Step1FormData) => {
    submitStep1Mutation.mutate(data)
  }

  const onVerifyOtp = () => {
    if (otpValue.length === 6) {
      verifyOtpMutation.mutate({
        aadhaarNumber: getValues("aadhaarNumber"),
        aadhaarOtp: otpValue,
      })
    }
  }

  const aadhaarNumber = watch("aadhaarNumber")
  const mobileNumber = watch("mobileNumber")

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-gray-800 mb-2">Aadhaar Verification</h2>
        <p className="text-gray-600">We'll verify your identity using your Aadhaar number and mobile number</p>
      </div>

      {!showOtpField ? (
        <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-6">
          <FormField label="Aadhaar Number" error={errors.aadhaarNumber?.message} required>
            <input
              {...register("aadhaarNumber")}
              type="text"
              placeholder="Enter 12-digit Aadhaar number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              maxLength={12}
            />
          </FormField>

          <FormField label="Mobile Number" error={errors.mobileNumber?.message} required>
            <input
              {...register("mobileNumber")}
              type="tel"
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              maxLength={10}
            />
          </FormField>

          {submitStep1Mutation.error && (
            <Alert variant="error">
              {submitStep1Mutation.error instanceof Error
                ? submitStep1Mutation.error.message
                : "Failed to submit step 1"}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={!isValid || submitStep1Mutation.isLoading}
            loading={submitStep1Mutation.isLoading}
            className="w-full"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Send OTP
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <Alert variant="success">OTP sent to mobile number ending with ****{mobileNumber?.slice(-4)}</Alert>

          <FormField label="Enter OTP" required>
            <input
              type="text"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </FormField>

          {verifyOtpMutation.error && (
            <Alert variant="error">
              {verifyOtpMutation.error instanceof Error ? verifyOtpMutation.error.message : "Failed to verify OTP"}
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setShowOtpField(false)} className="flex-1">
              Back
            </Button>
            <Button
              onClick={onVerifyOtp}
              disabled={otpValue.length !== 6 || verifyOtpMutation.isLoading}
              loading={verifyOtpMutation.isLoading}
              className="flex-1"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Verify & Continue
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => submitStep1Mutation.mutate(getValues())}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
