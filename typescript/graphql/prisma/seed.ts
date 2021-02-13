import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
          viewCount: 42,
        },
      ],
    },
  },
  {
    // name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
          viewCount: 128,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
    avatar: "some_avatar wefwefewf",
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {

    const userExisted = await prisma.user.findUnique({
      where: {
        email: u.email,
      }
    });

    const user = await prisma.user.upsert({
      where: {
        email: u.email,
      },
      create: u,
      update: {
        name: !userExisted?.name ? u.name || "no-name" : undefined,
        avatar: !userExisted?.avatar ? u.avatar || 'default_avatar_url' : undefined,
      },
    })
    console.log(`Created/updated user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
