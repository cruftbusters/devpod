import { useEffect, useState } from 'react'
import { TextSheet } from './TextSheet'
import { Transfer } from './types'
import { useStatus } from '../useStatus'
import { AccountBalances, summarize } from './Balance'

export function useLedger() {
  const textStatus = useStatus()
  const [text, _setText] = useState('')

  const transfersStatus = useStatus()
  const [transfers, _setTransfers] = useState<Transfer[]>([])

  const summaryStatus = useStatus()
  const [summary, setSummary] = useState<AccountBalances>(new Map())

  function setText(text: string) {
    try {
      _setText(text)
      _setTransfers(Array.from(TextSheet.fromText(text).toTransfers()))

      textStatus.info('successfully deserialized transfers from text')
      transfersStatus.clear()
    } catch (cause) {
      textStatus.error('failed to deserialize transfers from text', cause)
    }
  }

  function setTransfers(transfers: Transfer[]) {
    try {
      _setText(TextSheet.fromTransfers(transfers).toText())
      _setTransfers(transfers)

      textStatus.clear()
      transfersStatus.info('successfully serialized transfers to text')
    } catch (cause) {
      transfersStatus.error('failed to serialize transfers to text', cause)
    }
  }

  useEffect(() => {
    try {
      setSummary(summarize(transfers))
      summaryStatus.info('successfully summarized transfers')
    } catch (cause) {
      summaryStatus.error('failed to summarize transfers', cause)
    }
  }, [summaryStatus, transfers])

  return {
    setText,
    setTransfers,
    summary,
    summaryStatus,
    text,
    textStatus,
    transfers,
    transfersStatus,
  }
}
