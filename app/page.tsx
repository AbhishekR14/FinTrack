"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Home = () => {
  const router = useRouter();
  const session = useSession();
  if (session) {
    if (session.status === "loading") {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      );
    }
  }

  if (session.status === "authenticated") {
    router.push("/home");
    return <div className="h-screen"></div>;
  }
  return (
    <div>
      <nav className="bg-gray-100 border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/Logo.png" className="h-8" alt="FinTrack Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              FinTrack
            </span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Button className="md:mx-2" onClick={() => router.push("/signin")}>
              Sign In
            </Button>
            <div className="mx-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <section className="text-center py-16">
        <div className="container mx-auto">
          <div className="text-4xl font-bold mb-4">
            Track Your Spending Effortlessly
          </div>
          <div className="text-lg mb-8">
            Manage your finances, save money, and achieve your financial goals
            with FinTrack.
          </div>
          <Button>Take a Demo</Button>
          <Button className="ml-4" onClick={() => router.push("/signup")}>
            Get Started for Free
          </Button>
        </div>
      </section>

      <section id="features" className="py-16 dark:bg-gray-900 dark:text-white">
        <div className="container mx-auto">
          <div className="text-3xl font-bold text-center mb-12">Features</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 shadow-lg rounded dark:bg-gray-800 dark:text-white bg-white text-black">
              <div className="text-xl font-semibold mb-2">Track Spending</div>
              <div>Monitor your daily, weekly, and monthly expenses.</div>
            </div>
            <div className="p-6 shadow-lg rounded dark:bg-gray-800 dark:text-white bg-white text-black">
              <div className="text-xl font-semibold mb-2">Set Budgets</div>
              <div>Set and achieve your budget goals to save money.</div>
            </div>
            <div className="p-6 shadow-lg rounded dark:bg-gray-800 dark:text-white bg-white text-black">
              <div className="text-xl font-semibold mb-2">
                Financial Reports
              </div>
              <div>Get detailed financial reports and insights.</div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="get-started"
        className="py-16 text-center dark:bg-gray-900 dark:text-white"
      >
        <div className="container mx-auto">
          <div className="text-3xl font-bold mb-4">
            Ready to take control of your finances?
          </div>
          <Button onClick={() => router.push("/signup")}>Sign Up Now</Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
