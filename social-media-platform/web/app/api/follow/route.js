import { followUser, unfollowUser } from "@/lib/repository";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req) {
  const body = await req.json();
  const follow = await followUser(body);
  return new Response(JSON.stringify(follow), { headers });
}

export async function DELETE(req) {
  const body = await req.json();
  await unfollowUser(body);
  return new Response(JSON.stringify({ message: "Unfollowed" }), { headers });
}

export async function OPTIONS() {
  return new Response(null, { headers });
}