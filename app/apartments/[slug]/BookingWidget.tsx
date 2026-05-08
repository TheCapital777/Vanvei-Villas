"use client";

import { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatPrice } from "@/lib/utils/booking";
import type { Apartment } from "@/lib/constants/apartments";

const LIPA_NUMBER = "15798558";
const LIPA_NAME = "ESTARMILY KASSIM URASSA";

type ApartmentData = Apartment;

const WHATSAPP_NUMBERS = [
  { label: "Line 1", number: "255710739543" },
  { label: "Line 2", number: "255754274616" },
];

const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function LipaCopyField() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(LIPA_NUMBER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">LIPA Number</span>
        <span className="text-[10px] text-white/30">{LIPA_NAME}</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-white font-black text-xl tracking-widest">{LIPA_NUMBER}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-300"
          style={copied
            ? { borderColor: "#22c55e", color: "#22c55e" }
            : { borderColor: "rgba(200,145,42,0.4)", color: "#c8912a" }
          }
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BookingWidget({ apartment }: { apartment: ApartmentData }) {
  const [checkIn, setCheckIn]     = useState("");
  const [checkOut, setCheckOut]   = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [showLipa, setShowLipa]   = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        ))
      : 0;

  const totalPrice = nights * apartment.price;
  const ready = checkIn && checkOut && nights >= 2;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const whatsappMessage = useCallback(() =>
    encodeURIComponent(
      `Hi Vanvei Villas! I'd like to book *${apartment.name}*.\n\n` +
      `Check-in: ${checkIn ? formatDate(checkIn) : "—"}\n` +
      `Check-out: ${checkOut ? formatDate(checkOut) : "—"}\n` +
      `Guests: ${numGuests}\n` +
      `Total: ${formatPrice(totalPrice)} TZS\n\n` +
      `I'll send payment confirmation shortly.`
    ),
  [apartment.name, checkIn, checkOut, numGuests, totalPrice]);

  const today = new Date().toISOString().split("T")[0];

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300 text-sm [color-scheme:dark]";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">

      {/* Price header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{formatPrice(apartment.price)}</span>
          <span className="text-white/40 text-sm">TZS / night</span>
        </div>
        <p className="text-white/30 text-xs mt-1">Minimum 2 nights</p>
      </div>

      {/* Dates */}
      <div className="p-6 border-b border-white/10 space-y-3">
        <p className="text-sm font-medium text-white/70">Select Dates</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/40 mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => { setCheckIn(e.target.value); setShowLipa(false); }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => { setCheckOut(e.target.value); setShowLipa(false); }}
              className={inputClass}
            />
          </div>
        </div>
        {checkIn && checkOut && nights < 2 && (
          <p className="text-xs text-red-400">Minimum stay is 2 nights</p>
        )}
      </div>

      {/* Guests */}
      {ready && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Guests</p>
              <p className="text-xs text-white/30 mt-0.5">Max {apartment.guests}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                className="w-8 h-8 rounded-full border border-white/20 text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors text-lg leading-none flex items-center justify-center"
              >−</button>
              <span className="text-white font-bold w-4 text-center">{numGuests}</span>
              <button
                onClick={() => setNumGuests(Math.min(apartment.guests, numGuests + 1))}
                className="w-8 h-8 rounded-full border border-white/20 text-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors text-lg leading-none flex items-center justify-center"
              >+</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {ready && (
        <div className="px-6 py-4 border-b border-white/10 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">{formatPrice(apartment.price)} × {nights} night{nights !== 1 ? "s" : ""}</span>
            <span className="text-white">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/10">
            <span className="text-white">Total</span>
            <span className="text-[var(--color-gold)]">{formatPrice(totalPrice)} TZS</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-6 space-y-3">
        {ready ? (
          <>
            <button
              onClick={() => setShowLipa(true)}
              className="w-full bg-[var(--color-gold)] text-black font-bold py-3.5 rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-300"
            >
              Book Now
            </button>
            <div className="grid grid-cols-2 gap-2">
              {WHATSAPP_NUMBERS.map(({ label, number }) => (
                <a key={number} href={`https://wa.me/${number}?text=${whatsappMessage()}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 font-medium py-3 rounded-full transition-colors duration-300 text-xs">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={WA_ICON}/></svg>
                  WhatsApp {label}
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-white/30 text-sm py-2">Select your dates to continue</p>
        )}
      </div>

      {/* LIPA section */}
      {showLipa && ready && (
        <div className="border-t border-white/10 p-6 space-y-5">

          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">Complete Payment</h3>
            <button onClick={() => setShowLipa(false)} className="text-white/30 hover:text-white/70 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Gold-framed QR card */}
          <div className="relative mx-auto w-fit">
            {/* Outer gold glow */}
            <div className="absolute -inset-[3px] rounded-2xl" style={{
              background: "linear-gradient(135deg, #c8912a, #f0c060, #7a5518, #c8912a)",
              boxShadow: "0 0 30px rgba(200,145,42,0.4), 0 8px 32px rgba(0,0,0,0.5)",
            }} />
            <div className="relative bg-white rounded-2xl p-5 flex flex-col items-center gap-3">
              {/* Corner accents */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{borderColor:"#c8912a"}} />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{borderColor:"#c8912a"}} />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{borderColor:"#c8912a"}} />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{borderColor:"#c8912a"}} />

              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#c8912a]">Lipa Kwa Simu</p>

              <QRCodeSVG
                value={LIPA_NUMBER}
                size={160}
                fgColor="#0a0a0a"
                bgColor="#ffffff"
                level="M"
              />

              <p className="text-[10px] text-neutral-400 font-medium">Scan to pay · M-Pesa / Tigo / Airtel</p>
            </div>
          </div>

          {/* LIPA number copy field */}
          <LipaCopyField />

          {/* Amount due */}
          <div className="rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 px-4 py-3 flex items-center justify-between">
            <span className="text-white/60 text-sm">Amount to send</span>
            <span className="text-[var(--color-gold)] font-black text-lg">{formatPrice(totalPrice)} TZS</span>
          </div>

          {/* Steps */}
          <ol className="space-y-2 text-sm text-white/50">
            {[
              "Open M-Pesa, Tigo Pesa or Airtel Money",
              "Scan the QR code or enter LIPA number",
              `Send exactly ${formatPrice(totalPrice)} TZS`,
              "WhatsApp us your receipt to confirm",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold)] text-[10px] flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {/* WhatsApp buttons */}
          <div className="space-y-2">
            <p className="text-xs text-white/30 text-center">Send your receipt to confirm booking</p>
            {WHATSAPP_NUMBERS.map(({ label, number }) => (
              <a key={number} href={`https://wa.me/${number}?text=${whatsappMessage()}`} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-full hover:bg-[#1ebe5d] transition-colors duration-300 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={WA_ICON}/></svg>
                Send Receipt — {label}
              </a>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
