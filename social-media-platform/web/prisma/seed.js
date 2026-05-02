import "dotenv/config";
import { PrismaClient } from "./prisma/client/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// ─── DATA ────────────────────────────────────────────────────────────────────

const usersData = [
  { fullname: "Ahmed Ali",        username: "ahmed",    password: "123", bio: "Software engineer & coffee addict ☕" },
  { fullname: "Sara Mohamed",     username: "sara",     password: "123", bio: "Frontend developer | UI/UX enthusiast" },
  { fullname: "Saoud Hamad",      username: "saoud",    password: "123", bio: "CS student at QU 🎓" },
  { fullname: "Fatima Al-Ansari", username: "fatima",   password: "123", bio: "AI & ML researcher" },
  { fullname: "Omar Khalid",      username: "omar",     password: "123", bio: "Full stack dev | Open source lover" },
  { fullname: "Lina Hassan",      username: "lina",     password: "123", bio: "Digital artist & photographer 📸" },
  { fullname: "Yousef Nasser",    username: "yousef",   password: "123", bio: "Basketball fan & coder 🏀" },
  { fullname: "Maryam Said",      username: "maryam",   password: "123", bio: "Bookworm & tea lover 📚" },
  { fullname: "Khalid Ibrahim",   username: "khalid",   password: "123", bio: "DevOps engineer | Cloud enthusiast" },
  { fullname: "Noor Al-Rashid",   username: "noor",     password: "123", bio: "Marketing & content creator ✨" },
  { fullname: "Tariq Mansoor",    username: "tariq",    password: "123", bio: "Gamer & tech reviewer 🎮" },
  { fullname: "Reem Jassim",      username: "reem",     password: "123", bio: "Entrepreneur | Startup founder" },
];

const postsData = [
  // ahmed
  { content: "Hello everyone! Excited to join this platform 🎉", daysAgo: 90 },
  { content: "Just finished a 10km run. Feeling great! 🏃", daysAgo: 60 },
  { content: "Working on a cool Next.js project. Prisma is amazing!", daysAgo: 30 },
  { content: "Coffee + code = perfect morning ☕💻", daysAgo: 15 },
  { content: "Anyone else loving the new React features?", daysAgo: 5 },

  // sara
  { content: "Just deployed my first full-stack app 🚀", daysAgo: 85 },
  { content: "CSS grid is underrated. Change my mind.", daysAgo: 70 },
  { content: "UI tip: always add hover states to interactive elements!", daysAgo: 45 },
  { content: "Finished reading Atomic Habits. Highly recommend 📖", daysAgo: 20 },
  { content: "Dark mode or light mode? I say both 🌗", daysAgo: 3 },

  // saoud
  { content: "Finals week survival mode activated 😅", daysAgo: 88 },
  { content: "Pulled an all-nighter to finish my project. Worth it!", daysAgo: 65 },
  { content: "Databases are fascinating once you get the hang of them", daysAgo: 40 },
  { content: "Shoutout to everyone grinding through their assignments 💪", daysAgo: 18 },
  { content: "Submitted the project! Now time to sleep 😴", daysAgo: 1 },

  // fatima
  { content: "Just published my first ML model on HuggingFace!", daysAgo: 80 },
  { content: "Neural networks are poetry written in math 🧠", daysAgo: 55 },
  { content: "Attending an AI conference next week. So excited!", daysAgo: 35 },
  { content: "Reading about transformers architecture. Mind blown.", daysAgo: 12 },

  // omar
  { content: "Open source contributions are the best way to learn!", daysAgo: 75 },
  { content: "Containerized my entire dev environment with Docker 🐳", daysAgo: 50 },
  { content: "TypeScript saves lives. That's it, that's the post.", daysAgo: 28 },
  { content: "New blog post: REST vs GraphQL – which should you pick?", daysAgo: 8 },

  // lina
  { content: "Golden hour shoot at the corniche today 🌅", daysAgo: 78 },
  { content: "New painting finished! Check it out 🎨", daysAgo: 52 },
  { content: "Photography tip: natural light is always best", daysAgo: 25 },
  { content: "Art is how I make sense of the world ✨", daysAgo: 7 },

  // yousef
  { content: "We won the intramural basketball tournament! 🏆", daysAgo: 82 },
  { content: "Game dev is hard. Respect to anyone who does it.", daysAgo: 58 },
  { content: "Nothing beats coding with music in the background 🎵", daysAgo: 32 },
  { content: "Weekend hackathon starting in 2 hours. Let's go!", daysAgo: 10 },

  // maryam
  { content: "Book recommendation: The Pragmatic Programmer. A must-read!", daysAgo: 84 },
  { content: "There is something magical about a cup of tea and a good book 🍵", daysAgo: 62 },
  { content: "Finished reading 20 books this year. New record!", daysAgo: 38 },
  { content: "Libraries are underrated spaces. Bring them back!", daysAgo: 14 },

  // khalid
  { content: "Kubernetes in production: lessons learned the hard way", daysAgo: 76 },
  { content: "CI/CD pipelines save so much time. Set them up early.", daysAgo: 48 },
  { content: "Cloud costs can spiral fast. Always monitor your bills 💸", daysAgo: 22 },

  // noor
  { content: "Launched a new marketing campaign today. Fingers crossed! 🤞", daysAgo: 72 },
  { content: "Content creation tip: consistency > perfection", daysAgo: 46 },
  { content: "Brand storytelling is a superpower. Learn it.", daysAgo: 16 },
  { content: "Reached 1000 followers! Thank you all 🙏", daysAgo: 4 },

  // tariq
  { content: "Just finished Elden Ring. 10/10 masterpiece 🎮", daysAgo: 68 },
  { content: "GPU prices are finally dropping. Time to upgrade!", daysAgo: 42 },
  { content: "Honest review: the new phone is good but not worth the price", daysAgo: 19 },

  // reem
  { content: "Closed our seed funding round today! 🎉 Hard work pays off", daysAgo: 64 },
  { content: "Entrepreneurship lesson: your network is your net worth", daysAgo: 36 },
  { content: "Startup tip: talk to your customers every single week", daysAgo: 11 },
  { content: "Hiring! Looking for a senior engineer to join our team.", daysAgo: 2 },
];

const commentsData = [
  "Great post! 👏",
  "Totally agree with this!",
  "This is so relatable 😂",
  "Thanks for sharing!",
  "Love this perspective",
  "Keep it up! 💪",
  "This made my day",
  "So true!",
  "Can't agree more",
  "Amazing content as always!",
  "This is inspirational",
  "Well said!",
  "Following for more of this",
  "Bookmarked this post",
  "Need more people talking about this",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function daysAgoDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    users.push(user);
  }
  console.log(`Created ${users.length} users`);

  // Assign posts to users (each user by index order)
  const userPostMap = {
    0: [0,1,2,3,4],
    1: [5,6,7,8,9],
    2: [10,11,12,13,14],
    3: [15,16,17,18],
    4: [19,20,21,22],
    5: [23,24,25,26],
    6: [27,28,29,30],
    7: [31,32,33,34],
    8: [35,36,37],
    9: [38,39,40,41],
    10: [42,43,44],
    11: [45,46,47,48],
  };

  const posts = [];
  for (const [userIdx, postIdxArr] of Object.entries(userPostMap)) {
    for (const pIdx of postIdxArr) {
      const p = postsData[pIdx];
      const post = await prisma.post.create({
        data: {
          content: p.content,
          userId: users[Number(userIdx)].id,
          createdAt: daysAgoDate(p.daysAgo),
        },
      });
      posts.push(post);
    }
  }
  console.log(`Created ${posts.length} posts`);

  // Create comments: each user comments on ~8 random posts they didn't author
  let commentCount = 0;
  for (const user of users) {
    const otherPosts = posts.filter((p) => p.userId !== user.id);
    const targets = shuffle(otherPosts).slice(0, 8);
    for (const post of targets) {
      await prisma.comment.create({
        data: {
          text: randomItem(commentsData),
          userId: user.id,
          postId: post.id,
        },
      });
      commentCount++;
    }
  }
  console.log(`Created ${commentCount} comments`);

  // Create likes: each user likes ~10 random posts they didn't author
  let likeCount = 0;
  for (const user of users) {
    const otherPosts = posts.filter((p) => p.userId !== user.id);
    const targets = shuffle(otherPosts).slice(0, 10);
    for (const post of targets) {
      try {
        await prisma.like.create({
          data: { userId: user.id, postId: post.id },
        });
        likeCount++;
      } catch {
        // skip duplicate
      }
    }
  }
  console.log(`Created ${likeCount} likes`);

  // Create follows: each user follows ~5 others
  let followCount = 0;
  for (const user of users) {
    const others = shuffle(users.filter((u) => u.id !== user.id)).slice(0, 5);
    for (const target of others) {
      try {
        await prisma.follow.create({
          data: { followerId: user.id, followingId: target.id },
        });
        followCount++;
      } catch {
        // skip duplicate
      }
    }
  }
  console.log(`Created ${followCount} follows`);

  console.log("\nSeed complete.");
  console.log(`   Users: ${users.length}`);
  console.log(`   Posts: ${posts.length}`);
  console.log(`   Comments: ${commentCount}`);
  console.log(`   Likes: ${likeCount}`);
  console.log(`   Follows: ${followCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());