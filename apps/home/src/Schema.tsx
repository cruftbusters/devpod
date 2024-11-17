import { Transfer } from './database'

export function Schema(
  headers = ['key', 'date', 'debitAccount', 'creditAccount', 'amount'],
) {
  async function _export(transfers: Transfer[]) {
    let content = 'data:text/csv;charset=utf-8,'
    content += headers.join(',') + '\r\n'
    for (const transfer of transfers) {
      content +=
        [
          transfer.key,
          transfer.date,
          transfer.debitAccount,
          transfer.creditAccount,
          transfer.amount,
        ].join(',') + '\r\n'
    }
    window.open(encodeURI(content))
  }

  async function _import(key: string, files: FileList | null) {
    const transfers = []

    for (const file of files || []) {
      const text = await file.text()
      const lines = text.split('\r\n')
      const tokens = lines.shift()?.split(',')
      if (tokens?.length !== headers.length) {
        throw Error(`expected ${headers} got ${tokens}`)
      }
      for (let index = 0; index < headers.length; index++) {
        if (tokens[index] !== headers[index]) {
          throw Error(`expected ${headers} got ${tokens}`)
        }
      }
      for (const line of lines) {
        if (line.length > 0) {
          const values = line.split(',')
          let transfer: Transfer = {
            key: '',
            ledger: key,
            date: '',
            debitAccount: '',
            creditAccount: '',
            amount: 0,
          }
          for (const header of headers) {
            transfer = {
              ...transfer,
              [header]:
                header === 'amount'
                  ? parseInt(values.shift() || '')
                  : values.shift(),
            }
          }
          transfers.push(transfer)
        }
      }
    }

    return transfers
  }

  return { _import, _export }
}
