import type { Metadata } from "next";
import GodparentsFlow from "@/components/GodparentsFlow";

export const metadata: Metadata = {
  title: "Uma notícia especial | Batizado de Anthony Gael",
  description: "Uma mensagem especial para o padrinho de Anthony Gael.",
  robots: { index: false, follow: false },
};

export default function GodfatherPage() {
  return <GodparentsFlow papel="padrinho" imagem="/convite-padrinho.png" />;
}
