export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Udyam Registration</h3>
            <p className="text-gray-300 text-sm">
              Official portal for Udyam Registration under the Ministry of Micro, Small and Medium Enterprises,
              Government of India.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-base mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-base mb-4">Help & Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Helpline: 1800-180-6763</li>
              <li>Email: support@udyamregistration.gov.in</li>
              <li>Hours: 9:00 AM - 6:00 PM (Mon-Fri)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 Government of India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
