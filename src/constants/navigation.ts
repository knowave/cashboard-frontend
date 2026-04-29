import type { PageKey } from '../types/finance'

export const NAV_ITEMS: Array<{ key: PageKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'accounts', label: 'Accounts' },
  { key: 'loans', label: 'Loans' },
  { key: 'simulation', label: 'Simulation' },
]
