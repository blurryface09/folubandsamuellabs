"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Request = {
  id: string;
  type: string;
  details: Record<string, string>;
  status: string;
  created_at: string;
};

const statusStyle: Record<string, string> = {
  pending: "text-yellow-400/80 bg-yellow-400/5 border-yellow-400/20",
  processing: "text-blue-400/80 bg-blue-400/5 border-blue-400/20",
  completed: "text-green-400/80 bg-green-400/5 border-green-400/20",
  cancelled: "text-red-400/80 bg-red-400/5 border-red-400/20",
};

const quickLinks = [
  { href: "/exchange/trade/crypto", label: "Trade Crypto", icon: "₿", desc: "Buy or sell BTC, USDT, ETH and more" },
  { href: "/exchange/trade/giftcard", label: "Sell Gift Card", icon: "🎁", desc: "Steam, iTunes, Amazon, Google Play & more" },
  { href: "/exchange/accounts", label: "Get an Account", icon: "🏦", desc: "CashApp, Zelle, PayPal, bank accounts" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; user_metadata?: Record<string, string> } | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/exchange/login"); return; }
      setUser(user);

      const { data } = await supabase
        .from("exchange_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setRequests(data ?? []);
      setLoading(false);
    };
    init();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/exchange/login");
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "there";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white/20 text-sm tracking-widest">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-14 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-6 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase">Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome, {firstName}.</h1>
            <p className="text-white/25 text-sm mt-1">{user?.email}</p>
          </div>
          <button onClick={signOut}
            className="text-xs text-white/25 hover:text-red-400/70 transition-colors tracking-widest uppercase border border-white/8 hover:border-red-400/20 px-5 py-2.5">
            Sign Out
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#c9a84c]/10 mb-14">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="bg-[#080808] hover:bg-[#0b0906] transition-colors p-8 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />
              <p className="text-3xl mb-4">{l.icon}</p>
              <p className="text-white font-bold mb-1.5 group-hover:text-[#c9a84c] transition-colors text-sm">{l.label}</p>
              <p className="text-white/25 text-xs leading-relaxed mb-5">{l.desc}</p>
              <span className="text-[#c9a84c]/30 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all text-sm mt-auto">→</span>
            </Link>
          ))}
        </div>

        {/* Request history */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase">Your Requests</span>
          </div>

          {requests.length === 0 ? (
            <div className="border border-[#c9a84c]/10 p-16 text-center">
              <p className="text-white/20 text-sm mb-6">No requests yet. Start a trade or request an account.</p>
              <Link href="/exchange/trade/crypto"
                className="inline-block px-8 py-3 border border-[#c9a84c]/30 text-[#c9a84c] text-xs tracking-widest uppercase hover:bg-[#c9a84c]/5 transition-colors">
                Make Your First Trade
              </Link>
            </div>
          ) : (
            <div className="border border-[#c9a84c]/10 divide-y divide-[#c9a84c]/8">
              {requests.map((r) => (
                <div key={r.id} className="p-6 flex items-start justify-between gap-4 flex-wrap hover:bg-[#0a0906] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <p className="text-white font-semibold text-sm capitalize">{r.type.replace(/_/g, " ")}</p>
                      <span className={`text-[10px] tracking-widest uppercase px-2.5 py-0.5 border ${statusStyle[r.status] ?? statusStyle.pending}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-white/25 text-xs truncate">
                      {Object.entries(r.details).slice(0, 3).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join(" · ")}
                    </p>
                  </div>
                  <p className="text-white/20 text-xs shrink-0 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
