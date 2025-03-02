export type Transfer = {
  date: string
  memo: string
  credit: string
  debit: string
  amount: string
}

export class TransferArraySheet {
  static toArray(
    rows: string[][],
    fields = ['date', 'memo', 'credit', 'debit', 'amount'],
  ): Transfer[] {
    const header = rows.shift() || ['']
    const lookup = fields.map((field) => {
      const index = header.indexOf(field)
      if (index < 0) {
        throw Error(`expected header to contain '${field}' got '${header}'`)
      }
      return index
    })

    return rows.map((row) =>
      fields.reduce((transfer, field, index) => {
        ;(transfer as Record<string, string>)[field] = row[lookup[index]] || ''
        return transfer
      }, {} as Transfer),
    )
  }

  static toSheet(
    transfers: Transfer[],
    header = ['date', 'memo', 'credit', 'debit', 'amount'],
  ) {
    const records = transfers.map((transfer: Record<string, string>) =>
      header.map((field) => {
        const value = transfer[field]
        if (value === undefined) {
          throw Error(`expected '${field}' value not to be undefined`)
        }
        return value
      }),
    )

    return [header].concat(records)
  }
}
