import { likePost, unlikePost } from "@/lib/repository";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req) {
  const body = await req.json();
  try {
    const like = await likePost(body);
    return new Response(JSON.stringify(like), { headers });
  } catch {
    return new Response(JSON.stringify({ error: "Already liked" }), { status: 400, headers });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  await unlikePost(body);
  return new Response(JSON.stringify({ success: true }), { headers });
}

export async function OPTIONS() {
  return new Response(null, { headers });
}