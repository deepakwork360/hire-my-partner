"use client";

import { motion } from "framer-motion";
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock
} from "lucide-react";

// Custom Social Icons since some Lucide brands might be missing in this version
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12c0 3.259.012 3.667.072 4.947.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.337 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.337 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.337-1.078-2.126-1.384c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

export default function MapContainer() {
  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+91-1234567890",
      href: "tel:+911234567890"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: "123 Main Street, City, Country",
      href: "https://maps.google.com"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "support@example.com",
      href: "mailto:support@example.com"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Support Hours",
      value: "Mon–Sat: 9 AM – 6 PM IST",
      href: null
    }
  ];

  const socials = [
    { icon: <FacebookIcon />, href: "#" },
    { icon: <LinkedinIcon />, href: "#" },
    { icon: <TwitterIcon />, href: "#" },
    { icon: <InstagramIcon />, href: "#" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="w-full h-full flex flex-col bg-bg-secondary border border-border-main rounded-[48px] overflow-hidden shadow-2xl relative group"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
      
      {/* Header */}
      <div className="p-8 pb-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Talk to us <span className="text-primary">Directly</span>
        </h3>
        <p className="text-text-muted text-sm mt-1">We're just a message away.</p>
      </div>

      {/* Map Section */}
      <div className="px-8 mb-8">
        <div className="w-full h-[220px] rounded-3xl overflow-hidden border border-border-main relative group/map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8392319277!2d77.06889754725782!3d28.527213141380313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347ec447%3A0x673400516ee758!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1712999999999!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
            allowFullScreen={true} 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover/map:bg-transparent transition-colors duration-500" />
        </div>
      </div>

      {/* Info List */}
      <div className="px-8 flex-1 space-y-6">
        {contactInfo.map((info, idx) => (
          <div key={idx} className="flex items-start gap-4 group/item">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-border-main flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
              {info.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">{info.label}</p>
              {info.href ? (
                <a href={info.href} className="text-text-main hover:text-primary transition-colors font-medium">
                  {info.value}
                </a>
              ) : (
                <p className="text-text-main font-medium">{info.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Socials & Footer */}
      <div className="p-8 pt-0 mt-8">
        <div className="relative group/footer">
          {/* Subtle Top Divider */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          
          <div className="flex flex-col items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted bg-white/5 py-1.5 px-4 rounded-full border border-border-main">
              Connect With Us
            </span>
            
            <div className="flex items-center justify-center gap-5">
              {socials.map((social, idx) => (
                <motion.a 
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-border-main flex items-center justify-center text-text-muted hover:text-white hover:bg-primary hover:border-primary/50 hover:shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.4)] transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



