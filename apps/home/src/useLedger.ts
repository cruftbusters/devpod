import { useEffect, useState } from 'react'
import { formatAmount } from './formatAmount'
import { HeaderedSheet } from './HeaderedSheet'
import { parseAmount } from './parseAmount'
import { TextSheet } from './TextSheet'
import { Transfer } from './types'
import { useStatus } from './useStatus'
import { AccountBalances, accrueBalance } from './Balance'

export function useLedger() {
  const textStatus = useStatus()
  const [text, _setText] = useState('')

  const transfersStatus = useStatus()
  const [transfers, _setTransfers] = useState<Transfer[]>([])

  const summaryStatus = useStatus()
  const [summary, setSummary] = useState<AccountBalances>(new Map())

  function setText(value: string) {
    try {
      _setText(value)

      const sheet = HeaderedSheet.fromTextSheet(
        ['debitAccount', 'creditAccount', 'amount'],
        TextSheet.fromText(value),
      )

      const transfers = []

      for (const [debitAccount, creditAccount, amountText] of sheet) {
        const amount = parseAmount(amountText)
        transfers.push({ debitAccount, creditAccount, amount })
      }

      _setTransfers(transfers)

      textStatus.info('successfully deserialized text sheet')
      transfersStatus.clear()
    } catch (cause) {
      textStatus.error('failed to deserialize text sheet', cause)
    }
  }

  function setTransfers(value: Transfer[]) {
    try {
      function* it() {
        yield ['debitAccount', 'creditAccount', 'amount']
        for (const { debitAccount, creditAccount, amount } of value) {
          yield [debitAccount, creditAccount, formatAmount(amount)]
        }
      }
      _setText(new TextSheet(it()).toText())
      _setTransfers(value)

      textStatus.clear()
      transfersStatus.info('successfully serialized text sheet')
    } catch (cause) {
      transfersStatus.error('failed to serialize text sheet', cause)
    }
  }

  useEffect(() => {
    try {
      const balance = new Map()

      for (const { debitAccount, creditAccount, amount } of transfers) {
        accrueBalance(balance, debitAccount.split(':'), amount)
        accrueBalance(balance, creditAccount.split(':'), {
          ...amount,
          sign: -amount.sign,
        })
      }

      setSummary(balance)

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
