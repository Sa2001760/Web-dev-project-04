import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers });
}

// FOLLOW
export async function POST(req) {
  const { followerId, followingId } = await req.json();

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return new Response(JSON.stringify(follow), { headers });
}

// UNFOLLOW
export async function DELETE(req) {
  const { followerId, followingId } = await req.json();

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return new Response(JSON.stringify({ message: "Unfollowed" }), { headers });
}