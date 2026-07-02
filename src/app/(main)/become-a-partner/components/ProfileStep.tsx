"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// Reusable components matching original structure
const InputWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`w-full relative group ${className}`}>{children}</div>;

const getInputClass = (hasError = false) =>
  `w-full border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-300 shadow-sm font-medium tracking-wide outline-none focus:outline-none focus:ring-4 ${
    hasError
      ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
      : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus:border-primary focus:ring-primary/20"
  }`;

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem = ({ label, checked, onChange }: CheckboxItemProps) => (
  <label
    className={`flex items-center gap-4 border rounded-2xl p-5 cursor-pointer transition-all duration-300 group select-none relative overflow-hidden ${
      checked
        ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] transform scale-[1.02]"
        : "bg-bg-secondary border-border-main hover:border-primary/30 hover:bg-bg-card"
    }`}
  >
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <div
      className={`w-6 h-6 shrink-0 rounded-[6px] border-2 flex items-center justify-center transition-all duration-300 ${
        checked
          ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
          : "border-slate-500 group-hover:border-primary"
      }`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>
    <span
      className={`text-[15px] font-medium transition-colors z-10 ${
        checked ? "text-text-main font-bold" : "text-text-main group-hover:text-primary"
      }`}
    >
      {label}
    </span>
    {checked && (
      <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/10 to-transparent z-0 pointer-events-none" />
    )}
  </label>
);

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

const TagInput = ({ tags, onChange, placeholder }: TagInputProps) => {
  const tagsArray = Array.isArray(tags)
    ? tags
    : typeof tags === "string" && tags
    ? (tags as string).split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!tagsArray.includes(trimmed)) {
      onChange([...tagsArray, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tagsArray.length > 0) {
      onChange(tagsArray.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tagsArray.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full flex flex-wrap items-center gap-2 p-4 min-h-[56px] rounded-2xl border transition-all duration-300 shadow-sm cursor-text bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
    >
      {tagsArray.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl text-text-main text-xs font-semibold transition-colors hover:bg-white/15 select-none"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(idx);
            }}
            className="text-text-muted hover:text-text-main hover:scale-110 transition-transform p-0.5 flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-text-muted cursor-pointer" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        placeholder={tagsArray.length === 0 ? placeholder : ""}
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          if (val.endsWith(",")) {
            addTag(val.slice(0, -1));
          } else {
            setInputValue(val);
          }
        }}
        onBlur={() => addTag(inputValue)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] !bg-transparent !border-none !outline-none focus:!outline-none focus:!border-none focus:!ring-0 !ring-0 text-text-main text-sm font-semibold placeholder:text-text-muted p-0 m-0 !shadow-none"
        style={{ border: "none", outline: "none", boxShadow: "none", background: "transparent", backgroundColor: "transparent" }}
      />
    </div>
  );
};

interface ProfileStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
}

export default function ProfileStep({
  formData,
  onChange,
  showErrors,
  errors,
}: ProfileStepProps) {
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const languagesList = [
    "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada",
    "Malayalam", "Punjabi", "Urdu", "Odia", "Spanish", "French", "German", "Arabic"
  ];

  const toggleLanguage = (lang: string) => {
    const current = formData.languages || [];
    const updated = current.includes(lang)
      ? current.filter((l: string) => l !== lang)
      : [...current, lang];
    onChange({ languages: updated });
  };

  return (
    <div className="space-y-8">
      {/* Languages Spoken */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
          Languages Spoken
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {languagesList.map((item, idx) => {
            const isCore = idx < 4;
            if (!isCore && !showAllLanguages) return null;
            return (
              <CheckboxItem
                key={item}
                label={item}
                checked={(formData.languages || []).includes(item)}
                onChange={() => toggleLanguage(item)}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowAllLanguages(!showAllLanguages)}
          className="w-full cursor-pointer bg-bg-secondary border border-border-main border-dashed rounded-2xl p-5 text-text-muted hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 font-medium group"
        >
          {showAllLanguages ? (
            <>
              <ChevronUp className="w-5 h-5 text-primary group-hover:scale-125 transition-transform duration-300" />
              See Less Languages
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5 text-primary group-hover:scale-125 transition-transform duration-300" />
              See More Languages
            </>
          )}
        </button>
      </div>

      {/* Short Bio */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
          Short Bio
        </label>
        <InputWrapper>
          <textarea
            placeholder="I'm outgoing, love events and respectful company..."
            rows={4}
            className={getInputClass(showErrors && !!errors?.bio)}
            value={formData.bio || ""}
            onChange={(e) => onChange({ bio: e.target.value })}
          />
          {showErrors && errors?.bio && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.bio}
            </p>
          )}
        </InputWrapper>
      </div>

      {/* Tags & Interests */}
      <div className="space-y-6">
        <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
          Tags & Interests (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWrapper>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2 ml-1">
              Tags
            </span>
            <TagInput
              tags={formData.tagsInput || []}
              onChange={(tags) => onChange({ tagsInput: tags })}
              placeholder="e.g. Friendly, Traveler, Foodie"
            />
          </InputWrapper>

          <InputWrapper>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2 ml-1">
              Interests
            </span>
            <TagInput
              tags={formData.interestsInput || []}
              onChange={(interests) => onChange({ interestsInput: interests })}
              placeholder="e.g. Cooking, Photography, Music"
            />
          </InputWrapper>
        </div>
      </div>
    </div>
  );
}
