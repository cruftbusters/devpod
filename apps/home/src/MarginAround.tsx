import { PropsWithChildren } from 'react'

export function MarginAround({ children }: PropsWithChildren) {
  return <div style={{ margin: '1em' }}>{children}</div>
}
