export interface IDriverMeta {
  team: string
  number: string
  country: string
}

// Parses an item's "Team: X | Number: Y | Country: Z" description into structured fields.
// Inverse of the format produced by the seed script; returns empty strings when absent.
export function parseDriverMeta(description: string | null): IDriverMeta {
  const [team = '', number = '', country = ''] = description
    ? description.split(' | ').map((part) => part.split(': ')[1] ?? '')
    : []

  return { team, number, country }
}
