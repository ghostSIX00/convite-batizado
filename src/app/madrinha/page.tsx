import type { Metadata } from "next";
import GodparentsFlow from "@/components/GodparentsFlow";

export const metadata: Metadata = {
  title: "Convite da madrinha | Batizado de Anthony Gael",
  description: "Uma mensagem especial para a madrinha de Anthony Gael.",
  robots: { index: false, follow: false },
};

export default function GodmotherPage() {
  return <GodparentsFlow papel="madrinha" imagem="/convite-padrinhos.png" />;
}
