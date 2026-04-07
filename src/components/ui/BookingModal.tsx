"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface BookingModalProps {
  trigger: React.ReactNode;
}

export default function BookingModal({ trigger }: BookingModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl flex flex-col" style={{ height: "92vh", maxHeight: "92vh" }}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src="https://links.capiolab.com/widget/booking/GQr99p4CGYyV7BQpnPMX"
              className="flex-1 w-full rounded-2xl"
              style={{ border: "none", minHeight: 0 }}
              id="GQr99p4CGYyV7BQpnPMX_booking"
            />
          </div>
        </div>
      )}

      <Script
        src="https://links.capiolab.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </>
  );
}
