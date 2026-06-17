import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TournamentStatus } from "./generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const GAMES = ["FREE_FIRE", "BGMI", "VALORANT", "COD_MOBILE"];

const STATUSES: TournamentStatus[] = [
  TournamentStatus.DRAFT,
  TournamentStatus.REGISTRATION_OPEN,
  TournamentStatus.REGISTRATION_CLOSED,
  TournamentStatus.ONGOING,
  TournamentStatus.COMPLETED,
];

const TOURNAMENT_NAMES = [
  "Blaze Royale Open #2",
  "Shadow Strike Championship",
  "Neon Warfare Invitational",
  "Iron Grip Classic #2",
  "Zone Wars #1",
  "Clutch Masters #2",
  "White Wolf Clash",
  "Strike Force #1",
  "Crimson League Season 1",
  "Phantom Assault Cup",
  "Bomb League 1",
  
  
];

const DESCRIPTIONS = [
  "Join the ultimate battle where only the strongest survive. Prove your worth.",
  "A high-octane tournament for serious players. Entry is free — glory is not.",
  "Top squads compete for the grand prize. Register now before slots run out.",
  "Weekly showdown with rotating rules. Adapt or be eliminated.",
  "Open to all skill levels. Climb the leaderboard and claim your prize.",
  "Elite invitational tournament for top-ranked players only.",
  "Fast-paced, no-nonsense competitive gaming at its finest.",
  "Team up or go solo — either way, only one winner takes it all.",
  "Monthly flagship event with the biggest prize pool of the season.",
  "Rookie-friendly tournament designed for rising talent.",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomFutureDate(minDays = 1, maxDays = 60): Date {
  const now = new Date();
  const daysAhead = randomBetween(minDays, maxDays);
  now.setDate(now.getDate() + daysAhead);
  now.setHours(randomBetween(10, 22), randomBetween(0, 1) * 30, 0, 0);
  return now;
}

async function main() {
  console.log("🌱 Starting tournament seeding...\n");

  const tournaments = TOURNAMENT_NAMES.map((title, i) => {
    const maxPlayers = randomFrom([32, 48, 64, 100, 128]);
    const joined = randomBetween(0, maxPlayers);
    const entryFee = randomFrom([0, 0, 29, 49, 99, 149, 199]);
    const prizePool = entryFee === 0 ? 0 : entryFee * maxPlayers * 0.8;

    return {
      title,
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      game: randomFrom(GAMES),
      entryFee,
      prizePool,
      maxPlayers,
      joinedPlayersCount: joined,
      roomSize: randomFrom([12, 16, 25, 50]),
      startTime: randomFutureDate(),
      status: randomFrom(STATUSES),
      rules: `- No teaming up with enemies\n- No hacking or exploiting\n- All players must be registered before the match starts\n- Results must be submitted within 10 minutes of match end`,
    };
  });

  let created = 0;

  for (const data of tournaments) {
    const tournament = await prisma.tournament.create({ data });
    console.log(`  ✅ [${++created}/20] Created: "${tournament.title}" (${tournament.status})`);
  }

  console.log(`\n🎉 Successfully seeded ${created} tournaments!`);
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
