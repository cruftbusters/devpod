import { PropsWithChildren } from 'react'

export function MarginAround({ children }: PropsWithChildren) {
  return <div style={{ margin: '1em' }}>{children}</div>
}

export function MarginAboveBelow({ children }: PropsWithChildren) {
  return <div style={{ margin: '1em 0' }}>{children}</div>
}
