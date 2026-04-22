"use client";

import Link from "next/link";
import { Rochester, Outfit } from "next/font/google";
import Image from "next/image";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const SocialIcon = ({ d, href }: { d: string; href: string }) => (
  <Link
    href={href}
    className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-accent transition-all duration-300 group hover:-translate-y-1 shadow-lg border border-border-main"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 fill-text-main group-hover:fill-white group-hover:scale-110 transition-transform"
    >
      <path d={d} />
    </svg>
  </Link>
);

export default function Footer() {
  const ContactDetails = [
    {
      label: "Address",
      value:
        "Andheri Head Post Office, Andheri, Mumbai, Maharashtra, India, Pin Code: 400053",
      href: "/",
    },
    {
      label: "Phone",
      value: "+91 98765xxxxx",
      href: "/",
    },
    {
      label: "Email",
      value: "media@hiremypartner.com",
      href: "/",
    },
  ];

  const QuickLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "How It Works",
      href: "/#how-it-works",
    },
    {
      label: "Browse Partners",
      href: "/browse-partners",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Become a Partner",
      href: "/become-a-partner",
    },
    {
      label: "Safety & Trust",
      href: "/#safety-and-trust",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
  ];

  return (
    <footer className="bg-bg-base pt-16 pb-10 px-4 md:pt-24 border-t border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-8 mb-12">
          {/* Brand & Socials */}
          <div className="flex flex-col gap-8">
            <div>
              <Image
                src="/images/Logo.webp"
                alt="logo"
                width={100}
                height={100}
              />
              <h1 className={`${rochester.className} text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-2`}>
                Hire Your Partner
              </h1>
              <p className={`${outfit.className} text-transparent bg-clip-text bg-linear-to-r from-primary to-accent text-lg italic font-medium`}>
                Where connections, conversations, and relationships begin
              </p>
            </div>

            <div className="flex gap-4">
              {/* X (Twitter) */}
              <SocialIcon
                href="#"
                d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"
              />
              {/* YouTube */}
              <SocialIcon
                href="#"
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
              {/* Instagram */}
              <SocialIcon
                href="#"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12c0 3.259.012 3.667.072 4.947.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.337 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.337 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.337-1.078-2.126-1.384c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`${rochester.className} text-2xl text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main mb-8 border-b border-border-main pb-2 w-fit`}
            >
              Contact Details
            </h4>
            <ul className="flex flex-col gap-4">
              {ContactDetails.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${outfit.className} text-text-muted hover:text-primary transition-colors`}
                  >
                    {link.value}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4
              className={`${rochester.className} text-2xl text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main mb-8 border-b border-border-main pb-2 w-fit`}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4">
              {QuickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${outfit.className} text-text-muted hover:text-primary transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className={`${rochester.className} text-2xl text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main mb-8 border-b border-border-main pb-2 w-fit`}
            >
              Terms & Conditions
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Cookie Policy", href: "/cookie-policy" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Condition", href: "/terms-and-condition" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${outfit.className} text-text-muted hover:text-primary transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-10 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-6">
          <p className={`${outfit.className} text-text-muted text-sm`}>
            Copyright HireYourPartner. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Terms", "Privacy", "Affiliates"].map((item) => (
              <Link
                key={item}
                href="#"
                className={`${outfit.className} text-text-muted hover:text-text-main text-sm transition-colors`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}



