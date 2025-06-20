import { ReactElement, useState, FormEvent, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
// import animalNames from "../../assets/fun_animals.txt?raw";
// import adjectives from "../../assets/fun_adjectives.txt?raw";

export default function LoginPage(): ReactElement {
  //login page should start with email, password login screen
  //should also include
  // sign up page
  // forget password section
  // sign in with google and github
  const names: string[] = animalNames.trim().split("\n");
  const adj: string[] = adjectives.trim().split("\n");

  console.log(names.length);
  console.log(adj.length);
  const avatars: string[] = [
    "Vim user",
    "Java Old Timer",
    "C++ Wizard",
    "Speedy Python",
    "Rust Enthusiast",
    "Data Bloke",
  ];

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log("logged in");
    } else {
      console.log("not logged in");
    }
  };

  useEffect(() => {
    fetchSession();
  });
  const createUniqueUsername = (): string => {
    let 
    let isNameValid = false;

    while (isNameValid) {
      const randomName: string = names[Math.floor(Math.random() * 200)];
      const randomAdj: string = adj[Math.floor(Math.random() * 200)];
      const randomNum: number = Math.floor(Math.random() * 1000) + 1;
      const response = await fetch("/api/checkUsernameAvailibility", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
      })
    }

    return randomAdj + randomName + randomNum;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const email: string = form.get("email") as string;
    const password: string = form.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log(data + " " + error);
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const email: string = form.get("email") as string;
    const password: string = form.get("password") as string;
    const uniqueAvatar: string = avatars[Math.floor(Math.random() * 6)];
    const uniqueUser: string = createUniqueUsername();
    const currentDate: Date = new Date();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();

    const { error: queryError } = await supabase.from("user_profiles").insert({
      id: userData.user!.id,
      avatar: uniqueAvatar,
      username: uniqueUser,
      created_at: currentDate.toISOString(),
    });

    console.log(data + " " + error);
  };

  const handleSignOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    console.log(" " + error);
  };

  const handleDeleteAccount = async (): Promise<void> => {};

  return (
    <>
      <form className="" onSubmit={handleLogin}>
        <input
          className="inline-block"
          placeholder="email"
          type="email"
          name="email"
          required
        />
        <input
          className="inline-block"
          placeholder="password"
          type="password"
          name="password"
          required
        />
        <button className="border-black border-2 p-4" type="submit">
          Login
        </button>
      </form>
      <form className="" onSubmit={handleSignUp}>
        <input
          className="inline-block"
          placeholder="email"
          type="email"
          name="email"
          required
        />

        <input
          className="inline-block"
          placeholder="password"
          type="password"
          name="password"
          required
        />
        <button className="border-black border-2 p-4" type="submit">
          Sign Up
        </button>
      </form>
      <button className="border-2 border-black" onClick={handleSignOut}>
        Sign Out
      </button>
      <button className="border-2 border-black">Delete Account</button>
      <p>{createUniqueUsername()}</p>
      <p>{avatars[Math.floor(Math.random() * 6)]}</p>
    </>
  );
}
