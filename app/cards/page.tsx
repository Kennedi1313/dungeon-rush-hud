"use client";

import { useRouter } from "next/navigation";
import { CardsScreen } from "../../src/features/cards/CardsScreen";

export default function CardsPage() {
  const router = useRouter();
  return <CardsScreen onBack={() => router.push("/")} />;
}
