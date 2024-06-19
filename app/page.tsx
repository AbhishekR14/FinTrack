"use client";

import { testAtom } from "../store/atoms/test";
import { useRecoilValue } from "recoil";

export default function Home() {
  const test = useRecoilValue(testAtom);
  return <div> {test} </div>;
}
