import { PropsWithChildren, CSSProperties } from 'react'

export function Grid({
  children,
  style,
}: PropsWithChildren & { style: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-grid',
        gridGap: '0.125em',
        padding: '0.125em 0.25em',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function GridRow({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'subgrid',
        gridColumn: '1/-1',
      }}
    >
      {children}
    </div>
  )
}
