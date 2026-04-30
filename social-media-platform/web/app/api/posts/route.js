import "dotenv/config";
import { PrismaClient } from "@/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      comments: true,
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(posts);
}