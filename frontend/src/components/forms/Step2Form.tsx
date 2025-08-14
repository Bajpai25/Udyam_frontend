"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "react-query"
import { FormField } from "../ui/FormField"
import { Button } from "../ui/Button"
import { Alert } from "../ui/Alert"
import { useRegistrationStore } from "../../store/registrationStore"
import { registrationApi, validationApi } from "../../services/api"
import { User, CreditCard, ArrowLeft, CheckCircle } from "lucide-react"

const step2Schema = z.object({
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be in format: ABCDE1234F")
    .min(10, "PAN must be 10 characters")
    .max(10, "PAN must be 10 characters"),
  applicantName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  fatherName: z
    .string()
    .min(2, "Father's name must be at least 2 characters")
    .max(100, "Father's name must be less than 100 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select gender" }),
  category: z.enum(["general", "obc", "sc", "st"]).optional(),
  pinCode: z
    .string()
    .regex(/^[0-9]{6}$/, "PIN code must be 6 digits")
    .optional(),
  emailId: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
})

type Step2FormData = z.infer<typeof step2Schema>

export function Step2Form() {
  const { formData, updateFormData, previousStep, completeRegistration } = useRegistrationStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      panNumber: formData.panNumber || "",
      applicantName: formData.applicantName || "",
      fatherName: formData.fatherName || "",
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender || undefined,
      category: formData.category || undefined,
      pinCode: formData.pinCode || "",
      emailId: formData.emailId || "",
    },
  })

  const submitStep2Mutation = useMutation(registrationApi.submitStep2, {
    onSuccess: (data) => {
      completeRegistration(data)
    },
  })

  const pinCode = watch("pinCode")

  // Auto-fill city/state based on PIN code
  const { data: pinCodeInfo } = useQuery(["pincode", pinCode], () => validationApi.getPinCodeInfo(pinCode!), {
    enabled: !!pinCode && pinCode.length === 6,
    retry: false,
  })

  useEffect(() => {
    if (pinCodeInfo?.data) {
      setValue("city", pinCodeInfo.data.city)
      setValue("state", pinCodeInfo.data.state)
      setValue("district", pinCodeInfo.data.district)
    }
  }, [pinCodeInfo, setValue])

  const onSubmit = (data: Step2FormData) => {
    const completeData = {
      ...formData,
      ...data,
      city: pinCodeInfo?.data?.city || "",
      state: pinCodeInfo?.data?.state || "",
      district: pinCodeInfo?.data?.district || "",
    }

    submitStep2Mutation.mutate(completeData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-gray-800 mb-2">PAN & Personal Details</h2>
        <p className="text-gray-600">Complete your profile with PAN and personal information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField label="PAN Number" error={errors.panNumber?.message} required>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("panNumber")}
                  type="text"
                  placeholder="ABCDE1234F"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors uppercase"
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
            </FormField>
          </div>

          <FormField label="Applicant Name" error={errors.applicantName?.message} required>
            <input
              {...register("applicantName")}
              type="text"
              placeholder="Enter full name as per PAN"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </FormField>

          <FormField label="Father's Name" error={errors.fatherName?.message} required>
            <input
              {...register("fatherName")}
              type="text"
              placeholder="Enter father's name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </FormField>

          <FormField label="Date of Birth" error={errors.dateOfBirth?.message} required>
            <input
              {...register("dateOfBirth")}
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </FormField>

          <FormField label="Gender" error={errors.gender?.message} required>
            <div className="flex space-x-4">
              {[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    {...register("gender")}
                    type="radio"
                    value={option.value}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Category" error={errors.category?.message}>
            <select
              {...register("category")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              <option value="">Select category (optional)</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
            </select>
          </FormField>

          <FormField label="PIN Code" error={errors.pinCode?.message}>
            <input
              {...register("pinCode")}
              type="text"
              placeholder="Enter 6-digit PIN code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              maxLength={6}
            />
            {pinCodeInfo?.data && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Location detected:</span>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {pinCodeInfo.data.city}, {pinCodeInfo.data.district}, {pinCodeInfo.data.state}
                </div>
              </div>
            )}
          </FormField>

          <FormField label="Email ID" error={errors.emailId?.message}>
            <input
              {...register("emailId")}
              type="email"
              placeholder="Enter email address (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </FormField>
        </div>

        {submitStep2Mutation.error && (
          <Alert variant="error">
            {submitStep2Mutation.error instanceof Error
              ? submitStep2Mutation.error.message
              : "Failed to complete registration"}
          </Alert>
        )}

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={previousStep} className="flex-1 bg-transparent">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isValid || submitStep2Mutation.isLoading}
            loading={submitStep2Mutation.isLoading}
            className="flex-1"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  )
}
