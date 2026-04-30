import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


// ➜ GET comments (optional, useful)
export async function GET() {
  const comments = await prisma.comment.findMany({
    include: { user: true },
  });

  return new Response(JSON.stringify(comments), { headers });
}


// ➜ ADD comment
export async function POST(req) {
  const body = await req.json();

  const comment = await prisma.comment.create({
    data: {
      text: body.text,
      userId: body.userId,
      postId: body.postId,
    },
  });

  return new Response(JSON.stringify(comment), { headers });
}

export async function OPTIONS() {
  return new Response(null, { headers });
}