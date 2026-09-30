"use client";

import { useState } from "react";
import RsvpModal from "./RsvpModal";

export default function RsvpFlow() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-ouro" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Confirmar presença
      </button>
      {open && <RsvpModal onClose={() => setOpen(false)} />}
    </>
  );
}
