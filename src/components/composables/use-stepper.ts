import { ref, computed } from 'vue'

export default function useStepper(total: number) {
  const firstStep = 1
  const currentStep = ref(firstStep)
  const totalStep = ref(total)

  const goto = (step: number) => {
    if (step <= totalStep.value && step >= firstStep) {
      currentStep.value = step
    }
  }

  const next = () => {
    if (currentStep.value < totalStep.value) {
      currentStep.value += 1
    }
  }

  const prev = () => {
    if (currentStep.value > firstStep) {
      currentStep.value -= 1
    }
  }

  return {
    currentStep: computed(() => currentStep.value),
    totalStep: computed(() => totalStep.value),
    goto,
    next,
    prev,
  }
}
