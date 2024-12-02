import { PropsWithChildren } from 'react'
import './VerticalTrack.css'

export function VerticalTrack({ children }: PropsWithChildren) {
  return <div className="vertical-track">{children}</div>
}
