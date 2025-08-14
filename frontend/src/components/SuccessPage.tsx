"use client"

import Link from "next/link"
import { CheckCircle, Download, Home, Search } from "lucide-react"
import { useRegistrationStore } from "../store/registrationStore"

export function SuccessPage() {
  const { registrationData } = useRegistrationStore()

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 slide-in mt-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="font-heading font-bold text-3xl text-gray-800 mb-4">Registration Completed Successfully!</h1>

        <p className="text-gray-600 text-lg mb-8">
          Your Udyam registration has been submitted successfully. You will receive a confirmation email shortly.
        </p>

        {registrationData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Registration ID:</span>
                <div className="font-medium text-gray-800">{registrationData.id}</div>
              </div>
              <div>
                <span className="text-gray-600">Applicant Name:</span>
                <div className="font-medium text-gray-800">{registrationData.applicantName}</div>
              </div>
              <div>
                <span className="text-gray-600">PAN Number:</span>
                <div className="font-medium text-gray-800">{registrationData.panNumber}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium text-green-600">Completed</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors focus-ring">
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </button>
          <Link
            href="/status"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus-ring"
          >
            <Search className="w-5 h-5 mr-2" />
            Check Status
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus-ring"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
