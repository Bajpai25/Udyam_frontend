"use client"
import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="text-center py-16 pt-24">
      <div className="max-w-md mx-auto">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="font-heading font-bold text-2xl text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors focus-ring"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus-ring"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
