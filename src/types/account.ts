export type AccountType = 'LIQUID' | 'EMERGENCY' | 'SAVINGS' | 'INVESTMENT' | string

export type AccountRequest = {
  name: string
  type: string
  balance: number
}

export type AccountResponse = {
  id: string
  name: string
  type: string
  balance: number
  createdAt: string
  updatedAt: string
}

export type AccountFormValues = AccountRequest
