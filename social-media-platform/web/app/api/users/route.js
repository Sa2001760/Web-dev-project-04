import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const users = await prisma.user.findMany({
  include: {
    followers: true,
    following: true
  }
});

   return new Response(JSON.stringify(users), {
    headers: corsHeaders,
  });
}

export async function POST(request) {
  const body = await request.json();
  const { fullname, username, password } = body;

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    return new Response(
      JSON.stringify({ error: "Username already exists" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const user = await prisma.user.create({
    data: {
      fullname,
      username,
      password,
    },
  });

  return new Response(JSON.stringify(user), {
    status: 201,
    headers: corsHeaders,
  });
}

export async function PUT(request) {
  const body = await request.json();

  const { id, bio } = body;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { bio },
  });

  return new Response(JSON.stringify(user), {
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
  });
}