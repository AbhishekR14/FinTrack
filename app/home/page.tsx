"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  return <div className="text-white">Hi:{JSON.stringify(session)}</div>;
}
