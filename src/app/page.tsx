import Image from "next/image";
import { EVENT, mapsUrl } from "@/lib/config";
import RsvpFlow from "@/components/RsvpFlow";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[520px] flex-col items-center px-4 pb-14 pt-5 sm:pt-10">
      <h1 className="sr-only">{EVENT.titulo}</h1>

      {/* Convite original, sem cortes, sem distorção, sem re-compressão */}
      <div className="w-full overflow-hidden rounded-[10px] bg-white shadow-[0_30px_60px_-28px_rgba(51,80,110,.55),0_0_0_1px_rgba(188,213,236,.9)]">
        <Image
          src="/convite.png"
          alt="Convite de batizado de Anthony Gael, com pomba, cruz, criança em oração, pia batismal e vela"
          width={736}
          height={1104}
          priority
          unoptimized
          sizes="(max-width: 520px) 100vw, 520px"
          className="block h-auto w-full object-contain"
        />
      </div>

      <div className="mt-7 flex w-full flex-col gap-3">
        <RsvpFlow />
        {EVENT.endereco && (
          <a href={mapsUrl(EVENT.endereco)} target="_blank" rel="noopener noreferrer" className="btn-contorno">
            <PinIcon /> Como chegar
          </a>
        )}
      </div>
    </main>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
