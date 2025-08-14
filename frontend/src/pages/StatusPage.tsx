"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { Search, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { FormField } from "../components/ui/FormField"
import { Button } from "../components/ui/Button"
import { Alert } from "../components/ui/Alert"
import { registrationApi } from "../services/api"

export function StatusPage() {
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [searchTriggered, setSearchTriggered] = useState(false)

  const {
    data: registrationStatus,
    isLoading,
    error,
  } = useQuery(["registration-status", aadhaarNumber], () => registrationApi.getRegistrationStatus(aadhaarNumber), {
    enabled: searchTriggered && aadhaarNumber.length === 12,
    retry: false,
  })

  const handleSearch = () => {
    if (aadhaarNumber.length === 12) {
      setSearchTriggered(true)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "in-progress":
        return <Clock className="w-6 h-6 text-yellow-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusText = (currentStep: number, isCompleted: boolean) => {
    if (isCompleted) return "Completed"
    if (currentStep === 1) return "Aadhaar Verification Pending"
    if (currentStep === 2) return "PAN Verification In Progress"
    return "Not Started"
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 pt-8">
        <h1 className="font-heading font-bold text-3xl text-gray-800 mb-4">Check Registration Status</h1>
        <p className="text-gray-600 text-lg">Enter your Aadhaar number to check your registration status</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <FormField label="Aadhaar Number" required>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                  setAadhaarNumber(value)
                  setSearchTriggered(false)
                }}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                maxLength={12}
              />
            </div>
          </FormField>

          <Button
            onClick={handleSearch}
            disabled={aadhaarNumber.length !== 12 || isLoading}
            loading={isLoading}
            className="w-full"
          >
            <Search className="w-5 h-5 mr-2" />
            Check Status
          </Button>

          {error && (
            <Alert variant="error">
              Registration not found. Please check your Aadhaar number or start a new registration.
            </Alert>
          )}

          {registrationStatus?.data && (
            <div className="space-y-6 slide-in">
              <div className="border-t pt-6">
                <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">Registration Details</h3>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(registrationStatus.data.isCompleted ? "completed" : "in-progress")}
                      <div>
                        <div className="font-medium text-gray-800">
                          {getStatusText(registrationStatus.data.currentStep, registrationStatus.data.isCompleted)}
                        </div>
                        <div className="text-sm text-gray-600">Registration ID: {registrationStatus.data.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {registrationStatus.data.applicantName && (
                      <div>
                        <span className="text-gray-600">Applicant Name:</span>
                        <div className="font-medium text-gray-800">{registrationStatus.data.applicantName}</div>
                      </div>
                    )}
                    {registrationStatus.data.panNumber && (
                      <div>
                        <span className="text-gray-600">PAN Number:</span>
                        <div className="font-medium text-gray-800">{registrationStatus.data.panNumber}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Mobile Number:</span>
                      <div className="font-medium text-gray-800">
                        ****{registrationStatus.data.mobileNumber?.slice(-4)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <div className="font-medium text-gray-800">
                        {new Date(registrationStatus.data.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {registrationStatus.data.isCompleted && (
                  <div className="mt-6">
                    <Button className="w-full">
                      <FileText className="w-5 h-5 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
