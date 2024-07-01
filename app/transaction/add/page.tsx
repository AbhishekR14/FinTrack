"use client";
import NavBar from "@/components/ui/NavBar";
import Spinner from "@/components/ui/Spinner";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AddTransaction() {
  const session = useSession();
  const serachParams = useSearchParams();
  const type = serachParams.get("type") || "expense";
  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (!session || session.status === "unauthenticated") {
    return <div className="h-screen"></div>;
  }
  return (
    <div className="">
      <NavBar
        profilePicture={session.data?.user?.image || "/default-avatar.png"}
        userName={session.data?.user?.name || ""}
        email={session.data?.user?.email || ""}
      />
      <div className="min-h-screen flex justify-center items-center">
        Add Transaction of type {type}
      </div>
    </div>
  );
}
