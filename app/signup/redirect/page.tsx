"use client";
import { useRouter } from "next/navigation";
import { signupWithProvider } from "../../api/user/actions/user";

export default function SignUpRedirect() {
  const router = useRouter();
  signupWithProvider();
  router.push("/home");
}
