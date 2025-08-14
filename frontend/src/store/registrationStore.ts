import { create } from "zustand"

interface RegistrationState {
  currentStep: number
  isCompleted: boolean
  formData: any
  registrationData: any
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: any) => void
  completeRegistration: (data: any) => void
  resetRegistration: () => void
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  currentStep: 1,
  isCompleted: false,
  formData: {},
  registrationData: null,

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 2),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  completeRegistration: (data) =>
    set(() => ({
      isCompleted: true,
      registrationData: data,
    })),

  resetRegistration: () =>
    set(() => ({
      currentStep: 1,
      isCompleted: false,
      formData: {},
      registrationData: null,
    })),
}))
