"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../../components/Spinner";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (!session || session.status === "unauthenticated") {
    router.push("/");
    return <></>;
  }
  return <div className="text-white">Hi test:{JSON.stringify(session)}</div>;
}
