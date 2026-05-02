import prisma from "./prisma.js";



export async function getAllUsers() {
  return prisma.user.findMany({
    include: { followers: true, following: true },
  });
}

export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      followers: true,
      following: true,
    },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    include: { followers: true, following: true },
  });
}

export async function createUser({ fullname, username, password }) {
  return prisma.user.create({ data: { fullname, username, password } });
}

export async function updateUserBio(id, bio) {
  return prisma.user.update({
    where: { id: Number(id) },
    data: { bio },
  });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}



export async function getAllPosts() {
  return prisma.post.findMany({
    include: {
      user: true,
      comments: { include: { user: true } },
      likes: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
      comments: { include: { user: true } },
      likes: true,
    },
  });
}

export async function createPost({ content, userId }) {
  return prisma.post.create({ data: { content, userId: Number(userId) } });
}

export async function deletePost(postId, userId) {
  const post = await prisma.post.findUnique({ where: { id: Number(postId) } });
  if (!post) throw new Error("Post not found");
  if (post.userId !== Number(userId)) throw new Error("Not allowed");

  await prisma.comment.deleteMany({ where: { postId: Number(postId) } });
  await prisma.like.deleteMany({ where: { postId: Number(postId) } });
  return prisma.post.delete({ where: { id: Number(postId) } });
}



export async function getAllComments() {
  return prisma.comment.findMany({ include: { user: true } });
}

export async function createComment({ text, userId, postId }) {
  return prisma.comment.create({
    data: { text, userId: Number(userId), postId: Number(postId) },
  });
}



export async function likePost({ userId, postId }) {
  return prisma.like.create({
    data: { userId: Number(userId), postId: Number(postId) },
  });
}

export async function unlikePost({ userId, postId }) {
  return prisma.like.deleteMany({
    where: { userId: Number(userId), postId: Number(postId) },
  });
}



export async function followUser({ followerId, followingId }) {
  return prisma.follow.create({
    data: { followerId: Number(followerId), followingId: Number(followingId) },
  });
}

export async function unfollowUser({ followerId, followingId }) {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: Number(followerId),
        followingId: Number(followingId),
      },
    },
  });
}




//Average number of followers per user

export async function getAverageFollowersPerUser() {
  const result = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followerId: true },
  });
  if (result.length === 0) return 0;
  const total = result.reduce((sum, r) => sum + r._count.followerId, 0);
  return (total / result.length).toFixed(2);
}


//Average number of posts per user

export async function getAveragePostsPerUser() {
  const result = await prisma.post.groupBy({
    by: ["userId"],
    _count: { id: true },
  });
  if (result.length === 0) return 0;
  const total = result.reduce((sum, r) => sum + r._count.id, 0);
  return (total / result.length).toFixed(2);
}


//Most active user (most posts in the last 3 months)

export async function getMostActiveUser() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const result = await prisma.post.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: threeMonthsAgo } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  if (result.length === 0) return null;

  const user = await prisma.user.findUnique({
    where: { id: result[0].userId },
    select: { id: true, fullname: true, username: true },
  });

  return { user, postCount: result[0]._count.id };
}


//Most liked post

export async function getMostLikedPost() {
  const result = await prisma.like.groupBy({
    by: ["postId"],
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 1,
  });

  if (result.length === 0) return null;

  const post = await prisma.post.findUnique({
    where: { id: result[0].postId },
    include: { user: { select: { username: true, fullname: true } } },
  });

  return { post, likeCount: result[0]._count.userId };
}


//Most commented post

export async function getMostCommentedPost() {
  const result = await prisma.comment.groupBy({
    by: ["postId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  if (result.length === 0) return null;

  const post = await prisma.post.findUnique({
    where: { id: result[0].postId },
    include: { user: { select: { username: true, fullname: true } } },
  });

  return { post, commentCount: result[0]._count.id };
}


//Top 5 users by follower count

export async function getTopUsersByFollowers() {
  const result = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followerId: true },
    orderBy: { _count: { followerId: "desc" } },
    take: 5,
  });

  const enriched = await Promise.all(
    result.map(async (r) => {
      const user = await prisma.user.findUnique({
        where: { id: r.followingId },
        select: { id: true, fullname: true, username: true },
      });
      return { user, followerCount: r._count.followerId };
    })
  );

  return enriched;
}


//Total platform counts (users, posts, comments, likes)

export async function getPlatformTotals() {
  const [users, posts, comments, likes, follows] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.follow.count(),
  ]);
  return { users, posts, comments, likes, follows };
}


//Most popular user by engagement (likes + comments on their posts)

export async function getMostEngagedUser() {
  const posts = await prisma.post.findMany({
    select: {
      userId: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  const engagementMap = {};
  for (const post of posts) {
    if (!engagementMap[post.userId]) engagementMap[post.userId] = 0;
    engagementMap[post.userId] += post._count.likes + post._count.comments;
  }

  const topUserId = Object.entries(engagementMap).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (!topUserId) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(topUserId[0]) },
    select: { id: true, fullname: true, username: true },
  });

  return { user, engagementScore: topUserId[1] };
}