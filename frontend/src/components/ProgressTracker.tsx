import React from "react"
import { CheckCircle, Circle } from "lucide-react"

interface ProgressTrackerProps {
  currentStep: number
  totalSteps: number
}

export function ProgressTracker({ currentStep, totalSteps }: ProgressTrackerProps) {
  const steps = [
    { number: 1, title: "Aadhaar Verification", description: "Verify your identity" },
    { number: 2, title: "PAN & Personal Details", description: "Complete your profile" },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center mb-2">
                {step.number < currentStep ? (
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                ) : step.number === currentStep ? (
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{step.number}</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Circle className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <div
                  className={`font-medium text-sm ${step.number <= currentStep ? "text-gray-800" : "text-gray-400"}`}
                >
                  {step.title}
                </div>
                <div className={`text-xs ${step.number <= currentStep ? "text-gray-600" : "text-gray-400"}`}>
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${step.number < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}
