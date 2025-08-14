"use client"
import { ProgressTracker } from "../components/ProgressTracker"
import { Step1Form } from "../components/forms/Step1Form"
import { Step2Form } from "../components/forms/Step2Form"
import { SuccessPage } from "../components/SuccessPage"
import { useRegistrationStore } from "../store/registrationStore"

export function RegistrationPage() {
  const { currentStep, isCompleted } = useRegistrationStore()

  if (isCompleted) {
    return <SuccessPage />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 pt-8">
        <h1 className="font-heading font-bold text-3xl text-gray-800 mb-4">Udyam Registration</h1>
        <p className="text-gray-600 text-lg">Let's get your business registered step-by-step!</p>
      </div>

      <ProgressTracker currentStep={currentStep} totalSteps={2} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 slide-in">
        {currentStep === 1 && <Step1Form />}
        {currentStep === 2 && <Step2Form />}
      </div>
    </div>
  )
}
