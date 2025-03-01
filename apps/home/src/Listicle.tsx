import { PropsWithChildren } from 'react'

export function Listicle({ children }: PropsWithChildren) {
  return (
    <span
      style={{ display: 'inline-grid', gridAutoFlow: 'column', gridGap: '1em' }}
    >
      {children}
    </span>
  )
}
