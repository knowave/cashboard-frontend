import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'article' | 'section' | 'div'
  interactive?: boolean
}

export function Card({
  as: Component = 'section',
  children,
  className = '',
  interactive = false,
  ...props
}: CardProps) {
  return (
    <Component
      className={`rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] shadow-slate-200/70 transition dark:border-slate-800/90 dark:bg-slate-900 dark:shadow-none ${
        interactive ? 'hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(15,23,42,0.10)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
