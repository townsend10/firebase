"use client";
import { HomePublic } from "./_components/home-public";

// Cache this page for 1 hour (public landing page)
export const revalidate = 3600;

export default function Page() {
  return <HomePublic />;
}
