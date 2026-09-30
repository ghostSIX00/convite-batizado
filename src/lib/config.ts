export const EVENT = {
  titulo: "Batizado de Anthony Gael",
  descricao: "Você está convidado(a) para o batizado de Anthony Gael. Toque para ver o convite e confirmar sua presença.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  endereco: (process.env.NEXT_PUBLIC_EVENT_ADDRESS || "").trim(),
  maxPessoas: 10,
};

export function mapsUrl(endereco: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}
