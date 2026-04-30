import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

// GET posts
export async function GET() {
  const posts = await prisma.post.findMany({
  include: {
    user: true,
    comments: {
      include: {
        user: true   // 🔥 ADD THIS
      }
    },
    likes: true
  },
  orderBy: {
    createdAt: "desc"
  }
});

  return new Response(JSON.stringify(posts), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// CREATE POST
export async function POST(request) {
  try {
    const body = await request.json();

    const { content, userId } = body;

    if (!content || !userId) {
      return Response.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: Number(userId),
      },
    });

    return new Response(JSON.stringify(post), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}