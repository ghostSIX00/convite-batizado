import type { Metadata } from "next";
import GodparentsFlow from "@/components/GodparentsFlow";

export const metadata: Metadata = {
  title: "Uma notícia especial | Batizado de Anthony Gael",
  description: "Uma mensagem especial para os padrinhos de Anthony Gael.",
  robots: { index: false, follow: false },
};

export default function GodparentsPage() {
  return <GodparentsFlow />;
}
