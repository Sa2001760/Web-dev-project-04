import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// GET posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      comments: { include: { user: true } },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return new Response(JSON.stringify(posts), {
    headers: corsHeaders(),
  });
}

// CREATE POST
export async function POST(req) {
  const body = await req.json();

  const post = await prisma.post.create({
    data: {
      content: body.content,
      userId: body.userId,
    },
  });

  return new Response(JSON.stringify(post), {
    headers: corsHeaders(),
  });
}

export async function DELETE(request) {
  const body = await request.json();
  const { postId, userId } = body;

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: corsHeaders(),
    });
  }

  if (post.userId !== Number(userId)) {
    return new Response(JSON.stringify({ error: "Not allowed" }), {
      status: 403,
      headers: corsHeaders(),
    });
  }

  await prisma.comment.deleteMany({
    where: { postId: Number(postId) },
  });

  await prisma.like.deleteMany({
    where: { postId: Number(postId) },
  });

  await prisma.post.delete({
    where: { id: Number(postId) },
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: corsHeaders(),
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders(),
  });
}
