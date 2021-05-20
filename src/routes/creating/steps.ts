import { ContinueFooter, GenericFooter } from './components/Footer'

export const isConfirmationStep = (stepIndex?: number): boolean => stepIndex === 0

export const steps = [
  {
    id: '1',
    label: 'Waiting for transaction confirmation',
    description: undefined,
    instruction: 'Please confirm the Trust creation in your wallet',
    footerComponent: null,
  },
  {
    id: '2',
    label: 'Transaction submitted',
    description: undefined,
    instruction: 'Please do not leave this page',
    footerComponent: GenericFooter,
  },
  {
    id: '3',
    label: 'Confirming transaction',
    description: undefined,
    instruction: 'Please do not leave this page',
    footerComponent: GenericFooter,
  },
  {
    id: '4',
    label: 'Setting up trust contract',
    description: undefined,
    instruction: 'Please do not leave this page',
    footerComponent: GenericFooter,
  },
  {
    id: '5',
    label: 'Finalizing your Trust',
    description: undefined,
    instruction: 'Please do not leave this page',
    footerComponent: GenericFooter,
  },
  {
    id: '6',
    label: 'Success',
    description: 'Your Trust was created successfully',
    instruction: undefined,
    footerComponent: ContinueFooter,
  },
]
