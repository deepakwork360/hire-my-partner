"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Users, Eye, MapPin, Calendar, TrendingUp } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

type ProfileAnalyticsData = {
  totalViews: number;
  uniqueViewers: number;
  mostActiveCity: string;
  viewsThisWeek: number;
};

type Props = {
  data: ProfileAnalyticsData;
};

export default function ProfileAnalytics({ data }: Props) {
  const stats = [
    {
      label: "Total Views",
      value: data.totalViews.toLocaleString(),
      icon: Eye,
      color: "from-primary-dark via-primary to-accent",
      bg: "bg-primary/10",
    },
    {
      label: "Unique Viewers",
      value: data.uniqueViewers.toLocaleString(),
      icon: Users,
      color: "from-primary/80 to-accent/80",
      bg: "bg-primary/5",
    },
    {
      label: "Most Active City",
      value: data.mostActiveCity,
      icon: MapPin,
      color: "from-primary-dark via-primary to-primary-dark",
      bg: "bg-primary/10",
    },
    {
      label: "Views This Week",
      value: data.viewsThisWeek.toLocaleString(),
      icon: Calendar,
      color: "from-primary via-accent to-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className={`${outfit.className} space-y-10`}>
      {/* Header Area */}
      <div className="flex flex-col gap-3 relative">
        <div className="absolute -left-10 top-0 w-1 h-full bg-linear-to-b from-primary-dark to-accent rounded-full blur-[1px] opacity-70 hidden md:block" />
        <h1 className={`${rochester.className} text-5xl text-text-main tracking-wide flex items-center gap-4`}>
          Profile Views Summary
          <div className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent min-w-[100px]" />
        </h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <TrendingUp size={12} className="text-primary" />
            Track your profile views and engagement metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="bg-bg-card border border-border-main rounded-[24px] p-8 flex flex-col gap-6 relative overflow-hidden group hover:bg-bg-secondary transition-all shadow-sm"
            >
              {/* Decorative Accents */}
              <div className={`absolute -right-4 -top-4 w-20 h-20 ${stat.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/5 to-transparent" />

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br ${stat.color} shadow-lg shadow-primary/20`}>
                <Icon size={24} className="text-white" />
              </div>

              <div className="space-y-1">
                <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                <h3 className="text-text-main text-3xl font-black tracking-tight">
                  {stat.value}
                </h3>
              </div>

              {/* View Detail Link indicator (Visual only) */}
              <div className="mt-2 flex items-center gap-2 text-primary/50 group-hover:text-primary transition-colors">
                 <div className="w-1.5 h-1.5 rounded-full bg-current" />
                 <span className="text-[9px] font-black uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    Live Data
                 </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
