import "dotenv/config";
import { PrismaClient } from "./client/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();

  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const ahmed = await prisma.user.create({
    data: {
      fullname: "Ahmed Ali",
      username: "ahmed",
      password: "123",
      bio: "I love coding",
    },
  });

  const sara = await prisma.user.create({
    data: {
      fullname: "Sara Mohamed",
      username: "sara",
      password: "123",
      bio: "Frontend developer",
    },
  });

  const saoud = await prisma.user.create({
    data: {
      fullname: "Saoud Hamad",
      username: "saoud",
      password: "123",
      bio: "Student at QU",
    },
  });

  const post1 = await prisma.post.create({
    data: {
      content: "Hello everyone, this is my first post.",
      userId: ahmed.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: "Today I am working on my web project.",
      userId: sara.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      content: "Prisma and Next.js are useful for this project.",
      userId: saoud.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      { text: "Nice post!", userId: sara.id, postId: post1.id },
      { text: "Good luck!", userId: ahmed.id, postId: post2.id },
      { text: "Great work!", userId: saoud.id, postId: post1.id },
    ],
  });

  await prisma.like.createMany({
    data: [
      { userId: sara.id, postId: post1.id },
      { userId: saoud.id, postId: post1.id },
      { userId: ahmed.id, postId: post2.id },
    ],
  });

  await prisma.follow.createMany({
    data: [
      { followerId: ahmed.id, followingId: sara.id },
      { followerId: sara.id, followingId: saoud.id },
      { followerId: saoud.id, followingId: ahmed.id },
    ],
  });

  console.log("Seed data inserted ✅");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());