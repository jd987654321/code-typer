import { supabase } from "./supabase/supabase";
import { animalNames } from "./namingInfo/animalNames";
import { funAdjectives } from "./namingInfo/adjectives";

export const config = {
  runtime: "edge",
};

function generateUsername(): string {
  const randomAnimal: string = animalNames[Math.floor(Math.random() * 200)];
  const randomAdjective: string =
    funAdjectives[Math.floor(Math.random() * 200)];
  const randomNumber: number = Math.floor(Math.random() * 999);

  return randomAdjective + randomAnimal + randomNumber;
}

async function isUsernameValid(username: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_profiles")
    .select("username")
    .eq("username", username);

  return data!.length === 0;
}

export default async function handler(req: Request): Promise<Response> {
  //should only accept get requests
  if (req.method !== "GET") {
    return new Response("Invalid Request Type", {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  }

  let username: string = generateUsername();
  let nameIsValid: boolean = false;

  while (!nameIsValid) {
    nameIsValid = await isUsernameValid(username);
    if (!nameIsValid) {
      username = generateUsername();
    }
  }

  return new Response(JSON.stringify({ validUsername: username }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
