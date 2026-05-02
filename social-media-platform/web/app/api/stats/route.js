import {
  getAverageFollowersPerUser,
  getAveragePostsPerUser,
  getMostActiveUser,
  getMostLikedPost,
  getMostCommentedPost,
  getTopUsersByFollowers,
  getPlatformTotals,
  getMostEngagedUser,
} from "@/lib/repository";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const [
    avgFollowers,
    avgPosts,
    mostActiveUser,
    mostLikedPost,
    mostCommentedPost,
    topUsersByFollowers,
    platformTotals,
    mostEngagedUser,
  ] = await Promise.all([
    getAverageFollowersPerUser(),
    getAveragePostsPerUser(),
    getMostActiveUser(),
    getMostLikedPost(),
    getMostCommentedPost(),
    getTopUsersByFollowers(),
    getPlatformTotals(),
    getMostEngagedUser(),
  ]);

  return new Response(
    JSON.stringify({
      avgFollowers,
      avgPosts,
      mostActiveUser,
      mostLikedPost,
      mostCommentedPost,
      topUsersByFollowers,
      platformTotals,
      mostEngagedUser,
    }),
    { headers }
  );
}

export async function OPTIONS() {
  return new Response(null, { headers });
}