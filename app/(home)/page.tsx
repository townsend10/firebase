"use client";
import { Header } from "@/components/header";
import { InitalPage } from "@/components/inital-page";
import { getAuth } from "firebase/auth";

export default function Home() {
  return (
    <div className="flex ">
      <InitalPage />

      {/* {currentUser?.email} */}
    </div>
  );
}
