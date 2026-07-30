import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TournamentStatus } from "./generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// ─── Constants ────────────────────────────────────────────────────────────────

const GAMES = ["FREE_FIRE", "BGMI", "VALORANT", "COD_MOBILE"];

const COMPLETED_TOURNAMENTS = [
  {
    title: "Blaze Royale Season 1",
    game: "FREE_FIRE",
    entryFee: 99,
    prizePool: 12000,
    description: "The inaugural season of the most brutal Free Fire tournament. Only the elite survived.",
  },
  {
    title: "Shadow Strike Championship",
    game: "BGMI",
    entryFee: 149,
    prizePool: 18000,
    description: "Top squads clashed in a high-stakes BGMI showdown. One champion emerged.",
  },
  {
    title: "Neon Warfare Invitational",
    game: "VALORANT",
    entryFee: 199,
    prizePool: 25000,
    description: "Elite invitational for Valorant's finest. The prize pool was the biggest of the year.",
  },
  {
    title: "Iron Grip Classic",
    game: "FREE_FIRE",
    entryFee: 49,
    prizePool: 6000,
    description: "An open tournament for rising stars. No mercy, no excuses.",
  },
  {
    title: "Phantom Assault Cup",
    game: "COD_MOBILE",
    entryFee: 99,
    prizePool: 10000,
    description: "COD Mobile warriors fought through five brutal rounds for the grand prize.",
  },
];

// Prize distribution per tournament: top 5 get paid (% of prizePool)
const PRIZE_SPLITS = [0.40, 0.25, 0.15, 0.12, 0.08];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pastDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(18, 0, 0, 0);
  return d;
}

// ─── Cleanup: remove only leaderboard seed data ──────────────────────────────

async function cleanup() {
  console.log("🧹 Cleaning up previous leaderboard seed data...\n");

  await prisma.prizePayout.deleteMany({});
  await prisma.matchSubmission.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.tournamentEntry.deleteMany({});
  await prisma.tournament.deleteMany({
    where: { status: TournamentStatus.COMPLETED },
  });

  console.log("  ✅ Cleanup done.\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting leaderboard seed...\n");

  // ── Step 1: Fetch existing users ────────────────────────────────────────────
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  if (users.length === 0) {
    console.error(
      "❌ No users found in the database.\n   Please sign in at least once to create your user account, then run this seed again."
    );
    process.exit(1);
  }

  console.log(`👥 Found ${users.length} existing user(s):`);
  users.forEach((u, i) => console.log(`   ${i + 1}. ${u.name} (${u.email})`));
  console.log("");

  await cleanup();

  // Organizer = first user (or any user)
  const organizer = users[0]!;

  // ── Step 2: Create COMPLETED tournaments ────────────────────────────────────
  console.log("🏆 Creating completed tournaments...\n");

  const createdTournaments: Array<{ id: string; prizePool: number; title: string; game: string }> = [];

  for (let t = 0; t < COMPLETED_TOURNAMENTS.length; t++) {
    const tmeta = COMPLETED_TOURNAMENTS[t]!;
    const maxPlayers = Math.max(users.length, 16);

    const tournament = await prisma.tournament.create({
      data: {
        title: tmeta.title,
        description: tmeta.description,
        game: tmeta.game,
        entryFee: tmeta.entryFee,
        prizePool: tmeta.prizePool,
        maxPlayers,
        joinedPlayersCount: users.length,
        roomSize: 16,
        startTime: pastDate(60 - t * 10), // staggered in the past
        status: TournamentStatus.COMPLETED,
        organizerId: organizer.id,
        rules:
          "- No teaming up with enemies\n- No hacking or exploiting\n- Results must be submitted within 10 minutes of match end",
      },
    });

    createdTournaments.push({
      id: tournament.id,
      prizePool: tmeta.prizePool,
      title: tmeta.title,
      game: tmeta.game,
    });

    console.log(`  ✅ Tournament: "${tournament.title}" (${tmeta.game})`);
  }

  console.log("");

  // ── Step 3: For each tournament → entries, match, submissions, payouts ──────

  for (const tournament of createdTournaments) {
    console.log(`\n⚔️  Seeding data for: "${tournament.title}"`);

    // Shuffle users so ranking differs per tournament
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

    // ── 3a. TournamentEntry for each user ──────────────────────────────────────
    for (let i = 0; i < shuffledUsers.length; i++) {
      const user = shuffledUsers[i]!;
      await prisma.tournamentEntry.create({
        data: {
          userId: user.id,
          tournamentId: tournament.id,
          ign: user.name.replace(/\s+/g, "").slice(0, 16) || `Player${i + 1}`,
          gameUid: `${user.id.slice(0, 6).toUpperCase()}${randomBetween(1000, 9999)}`,
          status: "CONFIRMED",
        },
      });
    }
    console.log(`     ✅ ${shuffledUsers.length} tournament entries created`);

    // ── 3b. Match (1 completed match per tournament) ───────────────────────────
    const match = await prisma.match.create({
      data: {
        tournamentId: tournament.id,
        roundNumber: 1,
        scheduledAt: pastDate(randomBetween(5, 55)),
        status: "COMPLETED",
        roomId: `ROOM${randomBetween(10000, 99999)}`,
        roomPassword: `PWD${randomBetween(1000, 9999)}`,
      },
    });
    console.log(`     ✅ Match created (id: ${match.id.slice(0, 8)}...)`);

    // ── 3c. MatchSubmission for each user — kills decrease by rank ─────────────
    for (let i = 0; i < shuffledUsers.length; i++) {
      const user = shuffledUsers[i]!;
      // Rank 1 gets the most kills, descending with some randomness
      const baseKills = Math.max(1, 35 - i * 2);
      const kills = randomBetween(Math.max(1, baseKills - 3), baseKills + 3);
      const placement = i + 1;

      await prisma.matchSubmission.create({
        data: {
          userId: user.id,
          matchId: match.id,
          submittedKills: kills,
          submittedPlacement: placement,
          verifiedKills: kills,
          verifiedPlacement: placement,
          screenshotUrl: "https://placehold.co/1280x720/111/fff?text=Match+Result",
          status: "APPROVED",
          submittedAt: pastDate(randomBetween(4, 54)),
          verifiedAt: pastDate(randomBetween(1, 3)),
        },
      });
    }
    console.log(`     ✅ ${shuffledUsers.length} match submissions created`);

    // ── 3d. PrizePayout for top 5 (or fewer if not enough users) ──────────────
    const payoutCount = Math.min(5, shuffledUsers.length);
    for (let i = 0; i < payoutCount; i++) {
      const user = shuffledUsers[i]!;
      const amount = Math.round(tournament.prizePool * PRIZE_SPLITS[i]!);

      await prisma.prizePayout.create({
        data: {
          userId: user.id,
          tournamentId: tournament.id,
          amount,
          upiId: `${user.name.toLowerCase().replace(/\s+/g, "")}@upi`,
          transactionRef: `TXN_${Date.now()}_${i}_${tournament.id.slice(0, 6)}`,
          status: "PAID",
          paidAt: pastDate(randomBetween(1, 5)),
        },
      });
    }
    console.log(`     ✅ ${payoutCount} prize payouts created (top ${payoutCount} users)`);
  }

  // ── Step 4: Summary ────────────────────────────────────────────────────────
  const totalPayouts = await prisma.prizePayout.count();
  const totalSubmissions = await prisma.matchSubmission.count();

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Leaderboard seed complete!

   👥 Users used         : ${users.length}
   🏆 Tournaments created: ${createdTournaments.length}
   💀 Kill submissions   : ${totalSubmissions}
   💰 Prize payouts      : ${totalPayouts}

   The leaderboard will now rank users by:
     → Wins    = number of PrizePayout records (PAID)
     → Kills   = sum of verifiedKills (APPROVED)
     → Earnings = sum of PrizePayout amounts (PAID)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
