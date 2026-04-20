"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Send,
  Mail,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "../ui/PremiumButton";
import ThemeSwitcher from "./ThemeSwitcher";

const navItems = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Become a Partner", href: "/become-a-partner" },
  { label: "Safety and Trust", href: "/#safety-and-trust" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 ${
          isScrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-md shadow-lg border-b border-white/10 py-3"
            : "bg-transparent py-6"
        } flex items-center justify-between`}
      >
        {/* LEFT LOGO */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer z-10">
          <Image
            src="/images/Logo.webp"
            alt="logo"
            width={100}
            height={55}
            className="w-auto h-[45px] md:h-[55px] object-contain"
            priority
          />
        </Link>

        {/* CENTER NAV - DESKTOP */}
        <div
          className={`hidden lg:flex items-center backdrop-blur-md border rounded-full px-2 py-1 shadow-sm transition-all duration-500 ${
            isScrolled
              ? "bg-black/40 border-white/10"
              : "bg-white/10 border-white/20"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
              ${
                pathname === item.href
                  ? "bg-[#1a1a1a] border border-white/10 text-white shadow-md"
                  : isScrolled
                    ? "text-slate-300 hover:text-primary"
                    : "text-white/90 hover:text-white"
              }`}
            >
              {item.label}
              <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition" />
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE - DESKTOP/MOBILE */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Contact Us - Hidden on mobile/tablet */}
          <div className="hidden lg:block">
            <PremiumButton
              label="Contact Us"
              href="/contact"
              size="md"
              variant="primary"
            />
          </div>

          {/* Mobile Contact Icon */}
          <Link
            href="/contact"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary/80 border border-primary/30"
          >
            <Phone size={18} />
          </Link>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Profile */}
          <Link
            href="/profile"
            className={`hidden lg:block w-10 h-10 rounded-full overflow-hidden border cursor-pointer hover:scale-105 transition shadow-sm ${
              isScrolled ? "border-white/20" : "border-white/20"
            }`}
          >
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              alt="profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </Link>

          {/* Hamburger Menu - Mobile only */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-all active:scale-95 z-50 ${
              isScrolled
                ? "bg-[#111111] border-white/10 text-white"
                : "bg-white/10 border-white/20 text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY - MOVED OUTSIDE NAV TO PREVENT CLIPPING */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-[#080808] z-[90] lg:hidden overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[80%] h-[40%] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[60%] h-[30%] bg-primary-dark/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative h-full flex flex-col pt-32 pb-12 px-8 overflow-y-auto">
              {/* Menu Links */}
              <div className="flex flex-col gap-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.label}
                      variants={itemVariants}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`group relative flex items-center justify-between text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300 ${
                          isActive
                            ? "text-primary"
                            : "text-white hover:text-primary/80"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight
                          className={`w-8 h-8 transition-all duration-300 ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Section */}
              <motion.div
                variants={itemVariants}
                className="mt-auto space-y-10"
              >
                {/* CTA Button */}
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-5 bg-linear-to-r from-primary-dark to-accent text-white font-black text-xl rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-transform"
                >
                  Get Started Now
                </Link>

                {/* Social & Contact */}
                <div className="flex flex-col gap-6 border-t border-white/5 pt-10">
                  <div className="flex items-center gap-6">
                    <a
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary/80 transition-all"
                    >
                      <MessageCircle size={22} />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary/80 transition-all"
                    >
                      <Send size={22} />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary/80 transition-all"
                    >
                      <Mail size={22} />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                      Inquiries
                    </p>
                    <p className="text-white text-lg font-medium">
                      hello@hiremypartner.com
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
