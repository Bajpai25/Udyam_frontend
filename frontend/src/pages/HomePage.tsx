import Link from "next/link"
import { FileText, Search, CheckCircle, Clock, Users, TrendingUp } from "lucide-react"

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-800 mb-6">Udyam Registration Portal</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Register your micro, small, or medium enterprise with the Government of India. Get official recognition and
            access to various government schemes and benefits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors focus-ring"
            >
              <FileText className="w-5 h-5 mr-2" />
              Start Registration
            </Link>
            <Link
              href="/status"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus-ring"
            >
              <Search className="w-5 h-5 mr-2" />
              Check Status
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="font-heading font-bold text-3xl text-center text-gray-800 mb-12">
          Why Choose Udyam Registration?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">Official Recognition</h3>
            <p className="text-gray-600">
              Get official government recognition for your enterprise and establish credibility in the market.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">Access to Schemes</h3>
            <p className="text-gray-600">
              Unlock access to various government schemes, subsidies, and financial assistance programs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">Quick Process</h3>
            <p className="text-gray-600">
              Complete your registration in just 2 simple steps with real-time validation and instant feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white rounded-2xl p-8 md:p-12">
        <h2 className="font-heading font-bold text-3xl text-center text-gray-800 mb-12">Registration Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xl text-gray-800 mb-3">Aadhaar Verification</h3>
              <p className="text-gray-600 mb-4">
                Enter your Aadhaar number and mobile number. We'll send an OTP for verification to ensure security.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 12-digit Aadhaar number required</li>
                <li>• Mobile number for OTP verification</li>
                <li>• Instant validation and feedback</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xl text-gray-800 mb-3">PAN & Personal Details</h3>
              <p className="text-gray-600 mb-4">
                Provide your PAN number and personal information. All details are validated in real-time.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Valid PAN number (ABCDE1234F format)</li>
                <li>• Personal details as per official documents</li>
                <li>• Automatic city/state detection from PIN code</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-800 text-white rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl mb-4">Trusted by Millions</h2>
          <p className="text-gray-300 text-lg">Join the growing community of registered enterprises</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold mb-2">2.5M+</div>
            <div className="text-gray-300">Registered Enterprises</div>
          </div>
          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-gray-300">Success Rate</div>
          </div>
          <div>
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-3xl font-bold mb-2">5 Min</div>
            <div className="text-gray-300">Average Time</div>
          </div>
        </div>
      </section>
    </div>
  )
}
