// interface
export interface IDriverMeta {
  team: string
  number: string
  country: string
}

// parse driver meta
// inverse of the seed "Team: X | Number: Y | Country: Z" format; empty strings when absent
export function parseDriverMeta(description: string | null): IDriverMeta {
  const [team = '', number = '', country = ''] = description
    ? description.split(' | ').map((part) => part.split(': ')[1] ?? '')
    : []

  return { team, number, country }
}
