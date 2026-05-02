import { getAllComments, createComment } from "@/lib/repository";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const comments = await getAllComments();
  return new Response(JSON.stringify(comments), { headers });
}

export async function POST(req) {
  const body = await req.json();
  const comment = await createComment(body);
  return new Response(JSON.stringify(comment), { headers });
}

export async function OPTIONS() {
  return new Response(null, { headers });
}