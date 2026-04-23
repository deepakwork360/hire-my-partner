"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Heart, Users, Share2, TrendingUp } from "lucide-react";

const rochester = Rochester({
  weight: "400",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

type ProfileInterestData = {
  totalInterestReceived: number;
  newInLast7Days: number;
  connectionsMade: number;
};

type Props = {
  data: ProfileInterestData;
};

export default function ProfileInterest({ data }: Props) {
  const stats = [
    {
      label: "Total Interest Received",
      value: data.totalInterestReceived.toLocaleString(),
      icon: Heart,
      color: "from-primary to-primary-dark",
      bg: "bg-primary/10",
      description: "Lifetime engagement on your profile"
    },
    {
      label: "New In Last 7 Days",
      value: data.newInLast7Days.toLocaleString(),
      icon: TrendingUp,
      color: "from-primary-dark to-accent",
      bg: "bg-primary-dark/10",
      description: "Recent surge in activity"
    },
    {
      label: "Connections Made",
      value: data.connectionsMade.toLocaleString(),
      icon: Users,
      color: "from-primary to-primary-dark",
      bg: "bg-primary/5",
      description: "Successful profiles reached back"
    },
  ];

  return (
    <div className={`${outfit.className} space-y-10`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/3 border border-white/10 rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden group hover:bg-white/5 transition-all"
            >
              {/* Decorative Accents */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/5 to-transparent" />

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-linear-to-br ${stat.color} shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform`}>
                <Icon size={28} className="text-white" />
              </div>

              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                <h3 className="text-white text-4xl font-black tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest pt-1">
                    {stat.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="mt-2 flex items-center gap-2 text-primary/50 group-hover:text-primary transition-all">
                 <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    Live Insights
                 </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
