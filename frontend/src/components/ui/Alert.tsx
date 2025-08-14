import type React from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { clsx } from "clsx"

interface AlertProps {
  variant: "success" | "error" | "warning" | "info"
  children: React.ReactNode
  className?: string
}

export function Alert({ variant, children, className }: AlertProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const variantClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const iconClasses = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }

  const Icon = icons[variant]

  return (
    <div
      className={clsx("flex items-start space-x-3 p-4 border rounded-lg fade-in", variantClasses[variant], className)}
    >
      <Icon className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", iconClasses[variant])} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
