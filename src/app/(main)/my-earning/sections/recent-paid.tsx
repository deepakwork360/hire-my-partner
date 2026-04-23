"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { User, Calendar, Clock, Sparkles } from "lucide-react";
import Image from "next/image";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

// ── Mock Data ─────────────────────────────────────────────────────────────────

const recentBookings = [
  { id: 1, user: "Rahul S.", img: "/images/client.png", date: "20 June 2025", time: "8:00 PM", event: "Movie Night", amount: 800, tip: 200 },
  { id: 2, user: "Riya T.", img: "/images/client1.png", date: "18 June 2025", time: "6:30 PM", event: "Dinner Event", amount: 1200, tip: 0 },
  { id: 3, user: "Sagar M.", img: "/images/client2.png", date: "15 June 2025", time: "5:00 PM", event: "City Tour", amount: 1500, tip: 0 },
  { id: 4, user: "Tara P.", img: "/images/client3.png", date: "12 June 2025", time: "7:45 PM", event: "Party Companion", amount: 950, tip: 0 },
  { id: 5, user: "Mehul V.", img: "/images/client.png", date: "08 June 2025", time: "3:30 PM", event: "Café Meetup", amount: 750, tip: 0 },
];

export default function RecentPaid() {
  return (
    <div className={`${outfit.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-bg-card border border-border-main rounded-[32px] p-6 md:p-10 flex flex-col gap-8 shadow-xl shadow-black/5"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 relative">
           <div className="absolute -left-10 top-0 w-1 h-full bg-linear-to-b from-primary-dark to-accent rounded-full blur-[1px] opacity-50 hidden md:block" />
           <h2 className={`${rochester.className} text-4xl text-text-main tracking-wide flex items-center gap-4`}>
              Recent Paid Bookings
              <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent" />
           </h2>
           <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={10} className="text-primary" />
              Detailed breakdown of your most recent successful sessions
           </p>
        </div>

        {/* Desktop Table */}
        <div className="relative overflow-x-auto rounded-[24px] border border-border-main overflow-hidden shadow-xl shadow-black/5">
           <table className="w-full text-left min-w-[700px]">
              <thead className="bg-linear-to-r from-primary-dark via-primary to-accent text-white">
                 <tr className="uppercase font-black text-[10px] xl:text-[11px] tracking-widest">
                    <th className="px-6 xl:px-8 py-5 xl:py-7">User</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7">Date</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7">Time</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7">Event Type</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-right">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border-main bg-bg-secondary/40">
                 {recentBookings.map((row, idx) => (
                    <motion.tr 
                       key={row.id}
                       initial={{ opacity: 0, x: -10 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.05 }}
                       className="group hover:bg-primary/5 transition-all"
                    >
                       <td className="px-6 xl:px-8 py-5 xl:py-7">
                          <div className="flex items-center gap-3">
                             <div className="relative w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden border border-border-main ring-2 ring-transparent group-hover:ring-primary/50 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] transition-all">
                                <Image src={row.img} alt={row.user} fill className="object-cover" />
                             </div>
                             <span className="text-text-main text-sm xl:text-base font-bold group-hover:text-primary transition-colors uppercase tracking-tight">{row.user}</span>
                          </div>
                       </td>
                       <td className="px-6 xl:px-8 py-5 xl:py-7">
                          <div className="inline-flex px-4 py-1.5 rounded-full bg-linear-to-r from-primary/10 to-transparent border border-primary/10 text-text-main text-xs xl:text-sm font-medium">
                             {row.date}
                          </div>
                       </td>
                       <td className="px-6 xl:px-8 py-5 xl:py-7">
                          <div className="inline-flex px-4 py-1.5 rounded-full bg-bg-card border border-border-main text-text-muted text-xs xl:text-sm font-medium italic">
                             {row.time}
                          </div>
                       </td>
                       <td className="px-6 xl:px-8 py-5 xl:py-7">
                          <span className="px-4 py-2 bg-linear-to-r from-primary-dark to-accent rounded-lg text-white text-[9px] xl:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                             {row.event}
                          </span>
                       </td>
                       <td className="px-6 xl:px-8 py-5 xl:py-7 text-right">
                          <div className="flex flex-col items-end">
                             <span className="text-text-main text-base xl:text-lg font-black group-hover:text-primary transition-colors">₹{row.amount.toLocaleString()}</span>
                             {row.tip > 0 && (
                                <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase tracking-tighter">
                                   <Sparkles size={8} className="fill-emerald-500" />
                                   <span>+ ₹{row.tip} Tip</span>
                                </div>
                             )}
                          </div>
                       </td>
                    </motion.tr>
                 ))}
              </tbody>
           </table>
        </div>
      </motion.div>
    </div>
  );
}
