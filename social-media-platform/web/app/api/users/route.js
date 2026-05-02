import { getAllUsers, createUser, updateUserBio, findUserByUsername } from "@/lib/repository";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const users = await getAllUsers();
  return new Response(JSON.stringify(users), { headers: corsHeaders });
}

export async function POST(req) {
  const body = await req.json();
  const existing = await findUserByUsername(body.username);
  if (existing) {
    return new Response(
      JSON.stringify({ error: "Username already exists" }),
      { status: 400, headers: corsHeaders }
    );
  }
  const user = await createUser(body);
  return new Response(JSON.stringify(user), { status: 201, headers: corsHeaders });
}

export async function PUT(req) {
  const { id, bio } = await req.json();
  const user = await updateUserBio(id, bio);
  return new Response(JSON.stringify(user), { headers: corsHeaders });
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}