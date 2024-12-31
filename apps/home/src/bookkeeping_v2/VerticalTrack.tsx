import { PropsWithChildren } from 'react'
import './VerticalTrack.css'

export function VerticalTracks({ children }: PropsWithChildren) {
  return <div className="vertical-tracks">{children}</div>
}

export function VerticalTrack({ children }: PropsWithChildren) {
  return <div className="vertical-track">{children}</div>
}
