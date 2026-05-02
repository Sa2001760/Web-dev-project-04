import { getAllPosts, createPost, deletePost } from "@/lib/repository";

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET() {
  const posts = await getAllPosts();
  return new Response(JSON.stringify(posts), { headers: corsHeaders() });
}

export async function POST(req) {
  const body = await req.json();
  const post = await createPost(body);
  return new Response(JSON.stringify(post), { headers: corsHeaders() });
}

export async function DELETE(req) {
  const { postId, userId } = await req.json();
  try {
    await deletePost(postId, userId);
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders() });
  } catch (e) {
    const status = e.message === "Post not found" ? 404 : 403;
    return new Response(JSON.stringify({ error: e.message }), { status, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}