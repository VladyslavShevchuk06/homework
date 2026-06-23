import { db } from './index'
import { items } from './schema'
import { slugify } from '@/app/shared/utils'

const drivers = [
  {
    title: 'Max Verstappen',
    description: 'Team: Red Bull Racing | Number: 3 | Country: Netherlands',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268725259.webp',
  },
  {
    title: 'Isak Hadjar',
    description: 'Team: Red Bull Racing | Number: 6 | Country: France',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268710644.webp',
  },
  {
    title: 'Lewis Hamilton',
    description: 'Team: Ferrari | Number: 44 | Country: United Kingdom',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_3/2261401734.webp',
  },
  {
    title: 'Charles Leclerc',
    description: 'Team: Ferrari | Number: 16 | Country: Monaco',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_3/2262590967.webp',
  },
  {
    title: 'Lando Norris',
    description: 'Team: McLaren | Number: 1 | Country: United Kingdom',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2262443438.webp',
  },
  {
    title: 'Oscar Piastri',
    description: 'Team: McLaren | Number: 81 | Country: Australia',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Practice/2268566614.webp',
  },
  {
    title: 'George Russell',
    description: 'Team: Mercedes | Number: 63 | Country: United Kingdom',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265209242.webp',
  },
  {
    title: 'Andrea Kimi Antonelli',
    description: 'Team: Mercedes | Number: 12 | Country: Italy',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2262577854.webp',
  },
  {
    title: 'Fernando Alonso',
    description: 'Team: Aston Martin | Number: 14 | Country: Spain',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265212512.webp',
  },
  {
    title: 'Lance Stroll',
    description: 'Team: Aston Martin | Number: 18 | Country: Canada',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China___Practice__Sprint_Qualifying/2266244175.webp',
  },
  {
    title: 'Pierre Gasly',
    description: 'Team: Alpine | Number: 10 | Country: France',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2261204473.webp',
  },
  {
    title: 'Franco Colapinto',
    description: 'Team: Alpine | Number: 43 | Country: Argentina',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2262423826.webp',
  },
  {
    title: 'Oliver Bearman',
    description: 'Team: Haas | Number: 87 | Country: United Kingdom',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265209293.webp',
  },
  {
    title: 'Esteban Ocon',
    description: 'Team: Haas | Number: 31 | Country: France',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/fom-website/2026/Australia/GettyImages-2264863604.webp',
  },
  {
    title: 'Nico Hulkenberg',
    description: 'Team: Audi | Number: 27 | Country: Germany',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265208863.webp',
  },
  {
    title: 'Gabriel Bortoleto',
    description: 'Team: Audi | Number: 5 | Country: Brazil',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268728402.webp',
  },
  {
    title: 'Liam Lawson',
    description: 'Team: Racing Bulls | Number: 30 | Country: New Zeland',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China___Sprint__Qualifying/2266431845.webp',
  },
  {
    title: 'Arvid Lindblad',
    description: 'Team: Racing Bulls | Number: 41 | Country: United Kingdom',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China/2266576203.webp',
  },
  {
    title: 'Sergio Pérez',
    description: 'Team: Cadillac | Number: 11 | Country: Mexico',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China___Sprint__Qualifying/2266418217.webp',
  },
  {
    title: 'Valtteri Bottas',
    description: 'Team: Cadillac | Number: 77 | Country: Finland',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/fom-website/2025/Cadillac%20(GM)/Untitled-10%20-%20Copy.webp',
  },
  {
    title: 'Carlos Sainz',
    description: 'Team: Williams | Number: 55 | Country: Spain',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268737625.webp',
  },
  {
    title: 'Alexander Albon',
    description: 'Team: Williams | Number: 23 | Country: Thailand',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268737626.webp',
  },
]

async function seed() {
  console.log('🌱 Seeding database with 22 F1 drivers...')

  try {
    // clear existing rows so re-seeding updates data instead of duplicating it
    // (favorites cascade-delete with items, so a re-seed starts from a clean slate)
    await db.delete(items)
    console.log('🧹 Cleared existing items')

    // guard against slug collisions (e.g. two identical titles) so the unique
    // constraint can never fail — append -2, -3, … to later duplicates
    const usedSlugs = new Set<string>()

    for (const driver of drivers) {
      const base = slugify(driver.title)
      let slug = base
      let n = 2
      while (usedSlugs.has(slug)) {
        slug = `${base}-${n}`
        n += 1
      }
      usedSlugs.add(slug)

      await db.insert(items).values({
        slug,
        title: driver.title,
        description: driver.description,
        imageUrl: driver.imageUrl,
      })
      console.log(`✅ Added: ${driver.title} (${slug})`)
    }

    console.log('\n✨ Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
