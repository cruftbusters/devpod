import { PropsWithChildren } from 'react'

export function Listicle({ children }: PropsWithChildren) {
  return (
    <div
      style={{ display: 'inline-grid', gridAutoFlow: 'column', gridGap: '1em' }}
    >
      {children}
    </div>
  )
}
