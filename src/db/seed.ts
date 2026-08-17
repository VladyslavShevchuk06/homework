import { db } from './index'
import { items, teams } from './schema'
import { slugify } from '@/app/shared/utils/slug.util'

const constructors = [
  { nameEn: 'Red Bull Racing', nameUk: 'Red Bull Racing' },
  { nameEn: 'Ferrari', nameUk: 'Ferrari' },
  { nameEn: 'McLaren', nameUk: 'McLaren' },
  { nameEn: 'Mercedes', nameUk: 'Mercedes' },
  { nameEn: 'Aston Martin', nameUk: 'Aston Martin' },
  { nameEn: 'Alpine', nameUk: 'Alpine' },
  { nameEn: 'Haas', nameUk: 'Haas' },
  { nameEn: 'Audi', nameUk: 'Audi' },
  { nameEn: 'Racing Bulls', nameUk: 'Racing Bulls' },
  { nameEn: 'Cadillac', nameUk: 'Cadillac' },
  { nameEn: 'Williams', nameUk: 'Williams' },
]

const drivers = [
  {
    titleEn: 'Max Verstappen',
    titleUk: 'Макс Ферстаппен',
    team: 'Red Bull Racing',
    number: 3,
    countryEn: 'Netherlands',
    countryUk: 'Нідерланди',
    descriptionEn: 'Multiple-time world champion known for his aggressive pace and racecraft.',
    descriptionUk: 'Багаторазовий чемпіон світу, відомий агресивним темпом і майстерністю пілотування.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268725259.webp',
  },
  {
    titleEn: 'Isak Hadjar',
    titleUk: 'Ісак Хаджар',
    team: 'Red Bull Racing',
    number: 6,
    countryEn: 'France',
    countryUk: 'Франція',
    descriptionEn: 'A rising talent stepping up to the senior team after strong junior results.',
    descriptionUk: 'Молодий талант, що піднявся до основної команди після сильних результатів у молодших серіях.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268710644.webp',
  },
  {
    titleEn: 'Lewis Hamilton',
    titleUk: 'Льюїс Гемілтон',
    team: 'Ferrari',
    number: 44,
    countryEn: 'United Kingdom',
    countryUk: 'Велика Британія',
    descriptionEn: 'One of the most successful drivers in the sport, now racing in red.',
    descriptionUk: 'Один з найуспішніших пілотів в історії спорту, який тепер виступає за червону команду.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_3/2261401734.webp',
  },
  {
    titleEn: 'Charles Leclerc',
    titleUk: 'Шарль Леклер',
    team: 'Ferrari',
    number: 16,
    countryEn: 'Monaco',
    countryUk: 'Монако',
    descriptionEn: 'A quick and precise qualifier leading the Ferrari charge.',
    descriptionUk: 'Швидкий і точний у кваліфікаціях пілот, який очолює атаку Ferrari.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_3/2262590967.webp',
  },
  {
    titleEn: 'Lando Norris',
    titleUk: 'Ландо Норріс',
    team: 'McLaren',
    number: 1,
    countryEn: 'United Kingdom',
    countryUk: 'Велика Британія',
    descriptionEn: 'Consistent front-runner and a fan favourite for his relaxed style.',
    descriptionUk: 'Стабільний лідер і улюбленець вболівальників завдяки своєму невимушеному стилю.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2262443438.webp',
  },
  {
    titleEn: 'Oscar Piastri',
    titleUk: 'Оскар Піастрі',
    team: 'McLaren',
    number: 81,
    countryEn: 'Australia',
    countryUk: 'Австралія',
    descriptionEn: 'A composed and increasingly quick driver in the McLaren line-up.',
    descriptionUk: 'Витриманий і дедалі швидший пілот у складі McLaren.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Practice/2268566614.webp',
  },
  {
    titleEn: 'George Russell',
    titleUk: 'Джордж Расселл',
    team: 'Mercedes',
    number: 63,
    countryEn: 'United Kingdom',
    countryUk: 'Велика Британія',
    descriptionEn: 'A methodical racer leading the Mercedes team on track.',
    descriptionUk: 'Методичний гонщик, який веде команду Mercedes на трасі.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265209242.webp',
  },
  {
    titleEn: 'Andrea Kimi Antonelli',
    titleUk: 'Андреа Кімі Антонеллі',
    team: 'Mercedes',
    number: 12,
    countryEn: 'Italy',
    countryUk: 'Італія',
    descriptionEn: 'A highly rated young driver making his mark with Mercedes.',
    descriptionUk: 'Високо оцінений молодий пілот, який заявляє про себе у Mercedes.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2262577854.webp',
  },
  {
    titleEn: 'Fernando Alonso',
    titleUk: 'Фернандо Алонсо',
    team: 'Aston Martin',
    number: 14,
    countryEn: 'Spain',
    countryUk: 'Іспанія',
    descriptionEn: 'A veteran two-time champion still fighting at the front.',
    descriptionUk: 'Досвідчений дворазовий чемпіон, який досі бореться в лідерах.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265212512.webp',
  },
  {
    titleEn: 'Lance Stroll',
    titleUk: 'Ленс Стролл',
    team: 'Aston Martin',
    number: 18,
    countryEn: 'Canada',
    countryUk: 'Канада',
    descriptionEn: 'A powerful driver who excels in changeable conditions.',
    descriptionUk: 'Потужний пілот, який добре почувається у мінливих умовах.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China___Practice__Sprint_Qualifying/2266244175.webp',
  },
  {
    titleEn: 'Pierre Gasly',
    titleUk: 'П’єр Гаслі',
    team: 'Alpine',
    number: 10,
    countryEn: 'France',
    countryUk: 'Франція',
    descriptionEn: 'A race winner leading the Alpine team with experience.',
    descriptionUk: 'Переможець гонок, який досвідчено веде команду Alpine.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2261204473.webp',
  },
  {
    titleEn: 'Franco Colapinto',
    titleUk: 'Франко Колапінто',
    team: 'Alpine',
    number: 43,
    countryEn: 'Argentina',
    countryUk: 'Аргентина',
    descriptionEn: 'An exciting newcomer bringing fresh energy to the grid.',
    descriptionUk: 'Захопливий новачок, який приносить свіжу енергію у пелотон.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/Formula_1_Testing_in_Bahrain___Day_2/2262423826.webp',
  },
  {
    titleEn: 'Oliver Bearman',
    titleUk: 'Олівер Бермен',
    team: 'Haas',
    number: 87,
    countryEn: 'United Kingdom',
    countryUk: 'Велика Британія',
    descriptionEn: 'A promising young driver earning a full-time seat at Haas.',
    descriptionUk: 'Перспективний молодий пілот, який отримав постійне місце у Haas.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265209293.webp',
  },
  {
    titleEn: 'Esteban Ocon',
    titleUk: 'Естебан Окон',
    team: 'Haas',
    number: 31,
    countryEn: 'France',
    countryUk: 'Франція',
    descriptionEn: 'A determined racer and a previous grand prix winner.',
    descriptionUk: 'Рішучий гонщик і колишній переможець гран-прі.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/fom-website/2026/Australia/GettyImages-2264863604.webp',
  },
  {
    titleEn: 'Nico Hulkenberg',
    titleUk: 'Ніко Хюлькенберг',
    team: 'Audi',
    number: 27,
    countryEn: 'Germany',
    countryUk: 'Німеччина',
    descriptionEn: 'An experienced qualifier anchoring the new Audi project.',
    descriptionUk: 'Досвідчений майстер кваліфікації, який є опорою нового проєкту Audi.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Australia___Qualifying/2265208863.webp',
  },
  {
    titleEn: 'Gabriel Bortoleto',
    titleUk: 'Габріель Бортолето',
    team: 'Audi',
    number: 5,
    countryEn: 'Brazil',
    countryUk: 'Бразилія',
    descriptionEn: 'A junior champion beginning his top-flight career with Audi.',
    descriptionUk: 'Чемпіон молодших серій, який починає карєру у вищому дивізіоні з Audi.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268728402.webp',
  },
  {
    titleEn: 'Liam Lawson',
    titleUk: 'Ліам Лоусон',
    team: 'Racing Bulls',
    number: 30,
    countryEn: 'New Zealand',
    countryUk: 'Нова Зеландія',
    descriptionEn: 'A gritty competitor who makes the most of every opportunity.',
    descriptionUk: 'Наполегливий боєць, який використовує кожну можливість сповна.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China___Sprint__Qualifying/2266431845.webp',
  },
  {
    titleEn: 'Arvid Lindblad',
    titleUk: 'Арвід Ліндблад',
    team: 'Racing Bulls',
    number: 41,
    countryEn: 'United Kingdom',
    countryUk: 'Велика Британія',
    descriptionEn: 'A highly rated rookie graduating from the junior ranks.',
    descriptionUk: 'Високо оцінений новачок, який піднявся з молодших серій.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China/2266576203.webp',
  },
  {
    titleEn: 'Sergio Pérez',
    titleUk: 'Серхіо Перес',
    team: 'Cadillac',
    number: 11,
    countryEn: 'Mexico',
    countryUk: 'Мексика',
    descriptionEn: 'A tyre-management specialist returning with the Cadillac team.',
    descriptionUk: 'Спеціаліст з керування шинами, який повертається з командою Cadillac.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_China___Sprint__Qualifying/2266418217.webp',
  },
  {
    titleEn: 'Valtteri Bottas',
    titleUk: 'Валттері Боттас',
    team: 'Cadillac',
    number: 77,
    countryEn: 'Finland',
    countryUk: 'Фінляндія',
    descriptionEn: 'A multiple race winner bringing depth to the Cadillac line-up.',
    descriptionUk: 'Багаторазовий переможець гонок, який додає глибини складу Cadillac.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9North/c_fit,w_3200,h_1800/q_auto/v1740000001/fom-website/2025/Cadillac%20(GM)/Untitled-10%20-%20Copy.webp',
  },
  {
    titleEn: 'Carlos Sainz',
    titleUk: 'Карлос Сайнс',
    team: 'Williams',
    number: 55,
    countryEn: 'Spain',
    countryUk: 'Іспанія',
    descriptionEn: 'A race winner leading the Williams resurgence.',
    descriptionUk: 'Переможець гонок, який очолює відродження Williams.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9South/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268737625.webp',
  },
  {
    titleEn: 'Alexander Albon',
    titleUk: 'Александер Албон',
    team: 'Williams',
    number: 23,
    countryEn: 'Thailand',
    countryUk: 'Таїланд',
    descriptionEn: 'A smooth and reliable driver key to the Williams project.',
    descriptionUk: 'Плавний і надійний пілот, ключовий для проєкту Williams.',
    imageUrl:
      'https://media.formula1.com/image/upload/t_16by9Centre/c_fit,w_3200,h_1800/q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_Of_Japan___Qualifying/2268737626.webp',
  },
]

async function seed() {
  console.log('🌱 Seeding database with 22 F1 drivers...')

  try {
    // clear existing rows so re-seeding updates data instead of duplicating it
    // (favorites cascade-delete with items, so a re-seed starts from a clean slate)
    // items must go first — teams are referenced with on delete restrict
    await db.delete(items)
    await db.delete(teams)
    console.log('🧹 Cleared existing items and teams')

    const teamIdByName = new Map<string, string>()

    for (const constructor of constructors) {
      const [row] = await db
        .insert(teams)
        .values({ slug: slugify(constructor.nameEn), nameEn: constructor.nameEn, nameUk: constructor.nameUk })
        .returning({ id: teams.id })

      teamIdByName.set(constructor.nameEn, row.id)
    }
    console.log(`🏎️  Added ${constructors.length} teams`)

    // guard against slug collisions (e.g. two identical titles) so the unique
    // constraint can never fail — append -2, -3, … to later duplicates
    const usedSlugs = new Set<string>()

    for (const driver of drivers) {
      const teamId = teamIdByName.get(driver.team)

      if (!teamId) {
        throw new Error(`Unknown team "${driver.team}" for driver "${driver.titleEn}"`)
      }

      const base = slugify(driver.titleEn)
      let slug = base
      let n = 2
      while (usedSlugs.has(slug)) {
        slug = `${base}-${n}`
        n += 1
      }
      usedSlugs.add(slug)

      await db.insert(items).values({
        slug,
        titleEn: driver.titleEn,
        titleUk: driver.titleUk,
        teamId,
        number: driver.number,
        countryEn: driver.countryEn,
        countryUk: driver.countryUk,
        descriptionEn: driver.descriptionEn,
        descriptionUk: driver.descriptionUk,
        imageUrl: driver.imageUrl,
      })
      console.log(`✅ Added: ${driver.titleEn} (${slug})`)
    }

    console.log('\n✨ Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
