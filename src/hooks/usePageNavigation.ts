import { useState } from 'react'
import type { PageKey } from '../types/finance'

export const usePageNavigation = (initialPage: PageKey = 'dashboard') => {
  const [activePage, setActivePage] = useState<PageKey>(initialPage)

  return { activePage, setActivePage }
}
