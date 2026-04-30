import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ✅ LIKE
export async function POST(request) {
  const body = await request.json();
  const { userId, postId } = body;

  try {
    const like = await prisma.like.create({
      data: {
        userId: Number(userId),
        postId: Number(postId),
      },
    });

    return new Response(JSON.stringify(like), { headers });

  } catch {
    return new Response(JSON.stringify({ error: "Already liked" }), {
      status: 400,
      headers,
    });
  }
}

// ❌ UNLIKE
export async function DELETE(request) {
  const body = await request.json();
  const { userId, postId } = body;

  await prisma.like.deleteMany({
    where: {
      userId: Number(userId),
      postId: Number(postId),
    },
  });

  return new Response(JSON.stringify({ success: true }), { headers });
}

// CORS
export async function OPTIONS() {
  return new Response(null, { headers });
}