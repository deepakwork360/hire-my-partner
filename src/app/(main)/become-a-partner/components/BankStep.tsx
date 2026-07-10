"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Plus, Edit2, Trash2, CheckCircle2, Landmark, QrCode } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "@/components/ui/toastStore";

const InputWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`w-full relative group ${className}`}>{children}</div>;

const getInputClass = (hasError = false, isValid = false) =>
  `w-full border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-300 shadow-sm font-medium tracking-wide outline-none focus:outline-none focus:ring-4 ${
    hasError
      ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
      : isValid
      ? "bg-emerald-500/5 border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
      : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus:border-primary focus:ring-primary/20"
  }`;

interface CurrencyOption {
  id?: number | string;
  code: string;
  name: string;
  symbol: string;
}

interface SavedBank {
  id: string;
  bankAccountHolderName: string;
  bankName: string;
  branchName: string;
  bankAccountNumber: string;
  currency: string;
  bankIfscCode?: string;
  iban?: string;
  swiftCode?: string;
  routingNumber?: string;
}

interface SavedUpi {
  id: string;
  upiId: string;
}

interface BankStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
}

export default function BankStep({
  formData,
  onChange,
  showErrors,
  errors,
}: BankStepProps) {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currenciesList, setCurrenciesList] = useState<CurrencyOption[]>([]);
  const [currencySearch, setCurrencySearch] = useState("");
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  const [bankList, setBankList] = useState<SavedBank[]>([]);
  const [upiList, setSavedUpiList] = useState<SavedUpi[]>([]);

  // Active edit/add mode
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  const [isAddingUpi, setIsAddingUpi] = useState(false);
  const [editingUpiId, setEditingUpiId] = useState<string | null>(null);

  // Local form states (separate from parent formData so they don't pollute until saved)
  const [localBank, setLocalBank] = useState<Omit<SavedBank, "id">>({
    bankAccountHolderName: "",
    bankName: "",
    branchName: "",
    bankAccountNumber: "",
    currency: "INR",
    bankIfscCode: "",
    iban: "",
    swiftCode: "",
    routingNumber: "",
  });

  const [localUpi, setLocalUpi] = useState<string>("");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchCurrencies() {
      setLoadingCurrencies(true);
      try {
        const { data } = await api.get("/currencies");
        if (data && data.status && Array.isArray(data.data)) {
          setCurrenciesList(data.data);
        } else if (data && Array.isArray(data.data)) {
          setCurrenciesList(data.data);
        } else if (Array.isArray(data)) {
          setCurrenciesList(data);
        }
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
      } finally {
        setLoadingCurrencies(false);
      }
    }
    fetchCurrencies();
  }, []);

  // Restore saved banks and UPIs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBanks = localStorage.getItem("practice_saved_banks");
      const savedUpis = localStorage.getItem("practice_saved_upis");
      const activeBankId = localStorage.getItem("practice_selected_bank_id");
      const activeUpiId = localStorage.getItem("practice_selected_upi_id");
      const savedMode = localStorage.getItem("practice_selected_payment_mode") || "bank";

      let parsedBanks: SavedBank[] = [];
      let parsedUpis: SavedUpi[] = [];

      if (savedBanks) {
        try {
          parsedBanks = JSON.parse(savedBanks);
          setBankList(parsedBanks);
        } catch (e) {}
      }
      if (savedUpis) {
        try {
          parsedUpis = JSON.parse(savedUpis);
          setSavedUpiList(parsedUpis);
        } catch (e) {}
      }

      // Restore active selection
      if (savedMode === "upi") {
        const foundUpi = parsedUpis.find(u => u.id === activeUpiId) || parsedUpis[0];
        if (foundUpi) {
          onChange({
            paymentMode: "upi",
            upiId: foundUpi.upiId,
            bankAccountHolderName: "",
            bankName: "",
            branchName: "",
            bankAccountNumber: "",
            currency: "",
            bankIfscCode: "",
            iban: "",
            swiftCode: "",
            routingNumber: "",
          });
        } else {
          onChange({ paymentMode: "upi" });
        }
      } else {
        const foundBank = parsedBanks.find(b => b.id === activeBankId) || parsedBanks[0];
        if (foundBank) {
          onChange({
            paymentMode: "bank",
            bankAccountHolderName: foundBank.bankAccountHolderName,
            bankName: foundBank.bankName,
            branchName: foundBank.branchName,
            bankAccountNumber: foundBank.bankAccountNumber,
            currency: foundBank.currency,
            bankIfscCode: foundBank.bankIfscCode || "",
            iban: foundBank.iban || "",
            swiftCode: foundBank.swiftCode || "",
            routingNumber: foundBank.routingNumber || "",
            upiId: "",
          });
        } else {
          onChange({ paymentMode: "bank" });
        }
      }
    }
  }, []);

  const fallbackCurrencies: CurrencyOption[] = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "QAR", name: "Qatari Rial", symbol: "ر.ق" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "रू" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" }
  ];

  const displayCurrencies = currenciesList.length > 0 ? currenciesList : fallbackCurrencies;

  const filteredCurrencies = displayCurrencies.filter((c) => {
    const term = currencySearch.toLowerCase();
    return (
      c.code?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term) ||
      c.symbol?.toLowerCase().includes(term)
    );
  });

  const validateLocalBank = () => {
    const errorsMap: Record<string, string> = {};

    // Account holder name validation
    if (!localBank.bankAccountHolderName) {
      errorsMap.bankAccountHolderName = "Please enter bank account holder name.";
    } else if (localBank.bankAccountHolderName.length < 3) {
      errorsMap.bankAccountHolderName = "Account holder name must be at least 3 characters.";
    } else if (localBank.bankAccountHolderName.length > 100) {
      errorsMap.bankAccountHolderName = "Account holder name cannot exceed 100 characters.";
    } else if (!/^[a-zA-Z\s.]+$/.test(localBank.bankAccountHolderName)) {
      errorsMap.bankAccountHolderName = "Account holder name must only contain letters, spaces, or dots.";
    }

    // Bank name validation
    if (!localBank.bankName) {
      errorsMap.bankName = "Please enter your bank name.";
    } else if (localBank.bankName.length < 3) {
      errorsMap.bankName = "Bank name must be at least 3 characters.";
    } else if (localBank.bankName.length > 100) {
      errorsMap.bankName = "Bank name cannot exceed 100 characters.";
    }

    // Branch name validation
    if (!localBank.branchName) {
      errorsMap.branchName = "Please enter your branch name.";
    } else if (localBank.branchName.length < 2) {
      errorsMap.branchName = "Branch name must be at least 2 characters.";
    }

    // Account number validation
    if (!localBank.bankAccountNumber) {
      errorsMap.bankAccountNumber = "Please enter your bank account number.";
    } else if (!/^\d{8,20}$/.test(localBank.bankAccountNumber)) {
      errorsMap.bankAccountNumber = "Bank account number must be between 8 and 20 digits.";
    }

    // Currency validation
    if (!localBank.currency || localBank.currency === "Select Currency") {
      errorsMap.currency = "Please select your currency.";
    }

    // IFSC validation if currency is INR
    if (localBank.currency === "INR") {
      if (!localBank.bankIfscCode || localBank.bankIfscCode.trim() === "") {
        errorsMap.bankIfscCode = "IFSC code is required for INR accounts.";
      } else {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
        if (!ifscRegex.test(localBank.bankIfscCode)) {
          errorsMap.bankIfscCode = "Invalid IFSC code format (e.g. SBIN0001234).";
        }
      }
    }

    // Optional fields
    if (localBank.iban && localBank.iban.trim() !== "") {
      const cleanIban = localBank.iban.replace(/\s+/g, "");
      if (cleanIban.length < 15 || cleanIban.length > 34) {
        errorsMap.iban = "IBAN must be between 15 and 34 characters.";
      }
    }

    if (localBank.swiftCode && localBank.swiftCode.trim() !== "") {
      const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i;
      if (!swiftRegex.test(localBank.swiftCode)) {
        errorsMap.swiftCode = "Invalid SWIFT/BIC code format (8 or 11 characters).";
      }
    }

    if (localBank.routingNumber && localBank.routingNumber.trim() !== "") {
      const routingRegex = /^\d{5,15}$/;
      if (!routingRegex.test(localBank.routingNumber)) {
        errorsMap.routingNumber = "Routing number must be between 5 and 15 digits.";
      }
    }

    setLocalErrors(errorsMap);
    return Object.keys(errorsMap).length === 0;
  };

  const validateLocalUpi = () => {
    const errorsMap: Record<string, string> = {};
    if (!localUpi) {
      errorsMap.upiId = "Please enter a UPI ID.";
    } else {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(localUpi)) {
        errorsMap.upiId = "Invalid UPI ID format (e.g. username@bank).";
      }
    }
    setLocalErrors(errorsMap);
    return Object.keys(errorsMap).length === 0;
  };

  const handleSaveBank = () => {
    if (!validateLocalBank()) return;

    let updatedList: SavedBank[];
    const activeId = editingBankId || Math.random().toString(36).substring(2, 9);

    if (editingBankId) {
      updatedList = bankList.map(b => b.id === editingBankId ? { ...localBank, id: editingBankId } : b);
    } else {
      updatedList = [...bankList, { ...localBank, id: activeId }];
    }

    setBankList(updatedList);
    localStorage.setItem("practice_saved_banks", JSON.stringify(updatedList));
    localStorage.setItem("practice_selected_bank_id", activeId);
    localStorage.setItem("practice_selected_payment_mode", "bank");

    onChange({
      paymentMode: "bank",
      bankAccountHolderName: localBank.bankAccountHolderName,
      bankName: localBank.bankName,
      branchName: localBank.branchName,
      bankAccountNumber: localBank.bankAccountNumber,
      currency: localBank.currency,
      bankIfscCode: localBank.bankIfscCode || "",
      iban: localBank.iban || "",
      swiftCode: localBank.swiftCode || "",
      routingNumber: localBank.routingNumber || "",
      upiId: "",
    });

    setIsAddingBank(false);
    setEditingBankId(null);
    toast.success("Bank details saved successfully!");
  };

  const handleEditBank = (bank: SavedBank) => {
    setLocalBank({
      bankAccountHolderName: bank.bankAccountHolderName,
      bankName: bank.bankName,
      branchName: bank.branchName,
      bankAccountNumber: bank.bankAccountNumber,
      currency: bank.currency,
      bankIfscCode: bank.bankIfscCode || "",
      iban: bank.iban || "",
      swiftCode: bank.swiftCode || "",
      routingNumber: bank.routingNumber || "",
    });
    setEditingBankId(bank.id);
    setIsAddingBank(true);
    setLocalErrors({});
  };

  const handleDeleteBank = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = bankList.filter(b => b.id !== id);
    setBankList(updatedList);
    localStorage.setItem("practice_saved_banks", JSON.stringify(updatedList));

    const selectedBankId = localStorage.getItem("practice_selected_bank_id");
    if (selectedBankId === id) {
      localStorage.removeItem("practice_selected_bank_id");
      if (updatedList.length > 0) {
        const nextBank = updatedList[0];
        localStorage.setItem("practice_selected_bank_id", nextBank.id);
        onChange({
          paymentMode: "bank",
          bankAccountHolderName: nextBank.bankAccountHolderName,
          bankName: nextBank.bankName,
          branchName: nextBank.branchName,
          bankAccountNumber: nextBank.bankAccountNumber,
          currency: nextBank.currency,
          bankIfscCode: nextBank.bankIfscCode || "",
          iban: nextBank.iban || "",
          swiftCode: nextBank.swiftCode || "",
          routingNumber: nextBank.routingNumber || "",
          upiId: "",
        });
      } else {
        onChange({
          bankAccountHolderName: "",
          bankName: "",
          branchName: "",
          bankAccountNumber: "",
          currency: "",
          bankIfscCode: "",
          iban: "",
          swiftCode: "",
          routingNumber: "",
        });
      }
    }
    toast.success("Bank account removed.");
  };

  const handleSaveUpi = () => {
    if (!validateLocalUpi()) return;

    let updatedList: SavedUpi[];
    const activeId = editingUpiId || Math.random().toString(36).substring(2, 9);

    if (editingUpiId) {
      updatedList = upiList.map(u => u.id === editingUpiId ? { upiId: localUpi, id: editingUpiId } : u);
    } else {
      updatedList = [...upiList, { upiId: localUpi, id: activeId }];
    }

    setSavedUpiList(updatedList);
    localStorage.setItem("practice_saved_upis", JSON.stringify(updatedList));
    localStorage.setItem("practice_selected_upi_id", activeId);
    localStorage.setItem("practice_selected_payment_mode", "upi");

    onChange({
      paymentMode: "upi",
      upiId: localUpi,
      bankAccountHolderName: "",
      bankName: "",
      branchName: "",
      bankAccountNumber: "",
      currency: "",
      bankIfscCode: "",
      iban: "",
      swiftCode: "",
      routingNumber: "",
    });

    setIsAddingUpi(false);
    setEditingUpiId(null);
    toast.success("UPI ID saved successfully!");
  };

  const handleEditUpi = (upi: SavedUpi) => {
    setLocalUpi(upi.upiId);
    setEditingUpiId(upi.id);
    setIsAddingUpi(true);
    setLocalErrors({});
  };

  const handleDeleteUpi = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = upiList.filter(u => u.id !== id);
    setSavedUpiList(updatedList);
    localStorage.setItem("practice_saved_upis", JSON.stringify(updatedList));

    const selectedUpiId = localStorage.getItem("practice_selected_upi_id");
    if (selectedUpiId === id) {
      localStorage.removeItem("practice_selected_upi_id");
      if (updatedList.length > 0) {
        const nextUpi = updatedList[0];
        localStorage.setItem("practice_selected_upi_id", nextUpi.id);
        onChange({
          paymentMode: "upi",
          upiId: nextUpi.upiId,
          bankAccountHolderName: "",
          bankName: "",
          branchName: "",
          bankAccountNumber: "",
          currency: "",
          bankIfscCode: "",
          iban: "",
          swiftCode: "",
          routingNumber: "",
        });
      } else {
        onChange({ upiId: "" });
      }
    }
    toast.success("UPI ID removed.");
  };

  const paymentMode = formData.paymentMode || "bank";

  return (
    <div className="space-y-6">
      {/* Payment Method Selector */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-white/5 border border-border-main max-w-md mx-auto mb-8 relative z-50">
        <button
          type="button"
          onClick={() => {
            onChange({ paymentMode: "bank" });
            localStorage.setItem("practice_selected_payment_mode", "bank");
            const activeBankId = localStorage.getItem("practice_selected_bank_id");
            const foundBank = bankList.find(b => b.id === activeBankId) || bankList[0];
            if (foundBank) {
              onChange({
                paymentMode: "bank",
                bankAccountHolderName: foundBank.bankAccountHolderName,
                bankName: foundBank.bankName,
                branchName: foundBank.branchName,
                bankAccountNumber: foundBank.bankAccountNumber,
                currency: foundBank.currency,
                bankIfscCode: foundBank.bankIfscCode || "",
                iban: foundBank.iban || "",
                swiftCode: foundBank.swiftCode || "",
                routingNumber: foundBank.routingNumber || "",
                upiId: "",
              });
            } else {
              onChange({
                paymentMode: "bank",
                bankAccountHolderName: "",
                bankName: "",
                branchName: "",
                bankAccountNumber: "",
                currency: "",
                bankIfscCode: "",
                iban: "",
                swiftCode: "",
                routingNumber: "",
                upiId: "",
              });
            }
          }}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2.5 text-sm font-semibold transition-all cursor-pointer ${
            paymentMode === "bank"
              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          <Landmark size={16} />
          Bank Account
        </button>
        <button
          type="button"
          onClick={() => {
            onChange({ paymentMode: "upi" });
            localStorage.setItem("practice_selected_payment_mode", "upi");
            const activeUpiId = localStorage.getItem("practice_selected_upi_id");
            const foundUpi = upiList.find(u => u.id === activeUpiId) || upiList[0];
            if (foundUpi) {
              onChange({
                paymentMode: "upi",
                upiId: foundUpi.upiId,
                bankAccountHolderName: "",
                bankName: "",
                branchName: "",
                bankAccountNumber: "",
                currency: "",
                bankIfscCode: "",
                iban: "",
                swiftCode: "",
                routingNumber: "",
              });
            } else {
              onChange({
                paymentMode: "upi",
                upiId: "",
                bankAccountHolderName: "",
                bankName: "",
                branchName: "",
                bankAccountNumber: "",
                currency: "",
                bankIfscCode: "",
                iban: "",
                swiftCode: "",
                routingNumber: "",
              });
            }
          }}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2.5 text-sm font-semibold transition-all cursor-pointer ${
            paymentMode === "upi"
              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          <QrCode size={16} />
          UPI ID
        </button>
      </div>

      {/* BANK ACCOUNT MODE */}
      {paymentMode === "bank" && (
        <div className="space-y-6">
          {/* Card Form */}
          {isAddingBank ? (
            <div className="p-6 rounded-[28px] border border-border-main/60 bg-white/5 shadow-xl backdrop-blur-xl relative">
              <h3 className="text-lg font-bold text-text-main mb-6">
                {editingBankId ? "Edit Bank Account Details" : "Add New Bank Account"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper className="col-span-1 md:col-span-2">
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    className={getInputClass(!!localErrors.bankAccountHolderName, !localErrors.bankAccountHolderName && !!localBank.bankAccountHolderName)}
                    value={localBank.bankAccountHolderName}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, bankAccountHolderName: e.target.value }))}
                  />
                  {localErrors.bankAccountHolderName && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.bankAccountHolderName}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="Bank Name"
                    className={getInputClass(!!localErrors.bankName, !localErrors.bankName && !!localBank.bankName)}
                    value={localBank.bankName}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, bankName: e.target.value }))}
                  />
                  {localErrors.bankName && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.bankName}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="Branch Name"
                    className={getInputClass(!!localErrors.branchName, !localErrors.branchName && !!localBank.branchName)}
                    value={localBank.branchName}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, branchName: e.target.value }))}
                  />
                  {localErrors.branchName && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.branchName}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="Account Number"
                    className={getInputClass(!!localErrors.bankAccountNumber, !localErrors.bankAccountNumber && !!localBank.bankAccountNumber)}
                    value={localBank.bankAccountNumber}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                  />
                  {localErrors.bankAccountNumber && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.bankAccountNumber}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <button
                    type="button"
                    onClick={() => setCurrencyOpen(!currencyOpen)}
                    className={`${getInputClass(!!localErrors.currency, !localErrors.currency && localBank.currency !== "Select Currency" && localBank.currency !== "")} flex items-center justify-between cursor-pointer`}
                  >
                    <span className={!localBank.currency || localBank.currency === "Select Currency" || localBank.currency === "" ? "text-text-muted" : "text-text-main"}>
                      {localBank.currency ? `${localBank.currency} - ${displayCurrencies.find(c => c.code === localBank.currency)?.name || ""}` : "Select Currency"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${currencyOpen ? "rotate-180" : ""}`} />
                  </button>
                  {localErrors.currency && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.currency}
                    </p>
                  )}

                  <AnimatePresence>
                    {currencyOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 cursor-default" 
                          onClick={() => {
                            setCurrencySearch("");
                            setCurrencyOpen(false);
                          }}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col max-h-64 overflow-hidden"
                        >
                          <div className="p-3 bg-black/5 dark:bg-white/[0.02] border-b border-border-main/50">
                            <div className="relative">
                              <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Search currency..."
                                value={currencySearch}
                                onChange={(e) => setCurrencySearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg-secondary/40 border border-border-main rounded-2xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto custom-scrollbar max-h-48 flex-1">
                            {filteredCurrencies.map((curr) => (
                              <button
                                key={curr.code}
                                type="button"
                                onClick={() => {
                                  setLocalBank(prev => ({ ...prev, currency: curr.code }));
                                  setCurrencySearch("");
                                  setCurrencyOpen(false);
                                }}
                                className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                                  localBank.currency === curr.code ? "bg-primary/10 text-primary" : ""
                                }`}
                              >
                                {curr.code} - {curr.name} ({curr.symbol})
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    className={getInputClass(!!localErrors.bankIfscCode, !localErrors.bankIfscCode && !!localBank.bankIfscCode)}
                    value={localBank.bankIfscCode || ""}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, bankIfscCode: e.target.value.toUpperCase() }))}
                  />
                  {localErrors.bankIfscCode && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.bankIfscCode}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="IBAN (Optional)"
                    className={getInputClass(!!localErrors.iban, !localErrors.iban && !!localBank.iban)}
                    value={localBank.iban || ""}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, iban: e.target.value }))}
                  />
                  {localErrors.iban && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.iban}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="SWIFT Code (Optional)"
                    className={getInputClass(!!localErrors.swiftCode, !localErrors.swiftCode && !!localBank.swiftCode)}
                    value={localBank.swiftCode || ""}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, swiftCode: e.target.value.toUpperCase() }))}
                  />
                  {localErrors.swiftCode && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.swiftCode}
                    </p>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <input
                    type="text"
                    placeholder="Routing Number (Optional)"
                    className={getInputClass(!!localErrors.routingNumber, !localErrors.routingNumber && !!localBank.routingNumber)}
                    value={localBank.routingNumber || ""}
                    onChange={(e) => setLocalBank(prev => ({ ...prev, routingNumber: e.target.value }))}
                  />
                  {localErrors.routingNumber && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.routingNumber}
                    </p>
                  )}
                </InputWrapper>
              </div>

              <div className="flex items-center gap-4 justify-end mt-8 border-t border-border-main/30 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBank(false);
                    setEditingBankId(null);
                  }}
                  className="px-6 py-3 rounded-full border border-border-main text-text-muted hover:text-text-main transition-all font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBank}
                  className="px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white transition-all font-semibold text-sm shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Card List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankList.map((bank) => {
                  const isSelected = localStorage.getItem("practice_selected_bank_id") === bank.id;
                  return (
                    <div
                      key={bank.id}
                      onClick={() => {
                        localStorage.setItem("practice_selected_bank_id", bank.id);
                        onChange({
                          paymentMode: "bank",
                          bankAccountHolderName: bank.bankAccountHolderName,
                          bankName: bank.bankName,
                          branchName: bank.branchName,
                          bankAccountNumber: bank.bankAccountNumber,
                          currency: bank.currency,
                          bankIfscCode: bank.bankIfscCode || "",
                          iban: bank.iban || "",
                          swiftCode: bank.swiftCode || "",
                          routingNumber: bank.routingNumber || "",
                          upiId: "",
                        });
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between h-40 ${
                        isSelected
                          ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                          : "bg-white/5 border-border-main hover:bg-white/10 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-text-muted"}`}>
                            <Landmark size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-text-main text-sm truncate">{bank.bankName}</h4>
                            <p className="text-xs text-text-muted font-medium mt-0.5 truncate">{bank.branchName}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-primary flex-shrink-0">
                            <CheckCircle2 size={18} className="fill-primary/10" />
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-end justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Account Holder</p>
                          <p className="text-xs font-semibold text-text-main mt-0.5 truncate">{bank.bankAccountHolderName}</p>
                          <p className="text-sm font-mono text-text-main mt-1 tracking-wider">
                            •••• •••• {bank.bankAccountNumber.slice(-4)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBank(bank);
                            }}
                            className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-text-main hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteBank(bank.id, e)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Button */}
              {bankList.length < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalBank({
                      bankAccountHolderName: "",
                      bankName: "",
                      branchName: "",
                      bankAccountNumber: "",
                      currency: "INR",
                      bankIfscCode: "",
                      iban: "",
                      swiftCode: "",
                      routingNumber: "",
                    });
                    setEditingBankId(null);
                    setIsAddingBank(true);
                    setLocalErrors({});
                  }}
                  className="w-full py-5 rounded-2xl border border-dashed border-primary/90 hover:border-primary/50 bg-white/[0.02] hover:bg-white/5 text-text-muted hover:text-text-main font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus size={18} />
                  Add Bank Account ({bankList.length}/3)
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* UPI ID MODE */}
      {paymentMode === "upi" && (
        <div className="space-y-6">
          {/* Card Form */}
          {isAddingUpi ? (
            <div className="p-6 rounded-[28px] border border-border-main/60 bg-white/5 shadow-xl backdrop-blur-xl relative">
              <h3 className="text-lg font-bold text-text-main mb-6">
                {editingUpiId ? "Edit UPI ID" : "Add New UPI ID"}
              </h3>
              
              <div className="space-y-6">
                <InputWrapper>
                  <input
                    type="text"
                    placeholder="UPI ID (e.g. username@bank)"
                    className={getInputClass(!!localErrors.upiId, !localErrors.upiId && !!localUpi)}
                    value={localUpi}
                    onChange={(e) => setLocalUpi(e.target.value)}
                  />
                  {localErrors.upiId && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                      {localErrors.upiId}
                    </p>
                  )}
                </InputWrapper>
              </div>

              <div className="flex items-center gap-4 justify-end mt-8 border-t border-border-main/30 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingUpi(false);
                    setEditingUpiId(null);
                  }}
                  className="px-6 py-3 rounded-full border border-border-main text-text-muted hover:text-text-main transition-all font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUpi}
                  className="px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white transition-all font-semibold text-sm shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Save UPI ID
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Card List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upiList.map((upi) => {
                  const isSelected = localStorage.getItem("practice_selected_upi_id") === upi.id;
                  return (
                    <div
                      key={upi.id}
                      onClick={() => {
                        localStorage.setItem("practice_selected_upi_id", upi.id);
                        onChange({
                          paymentMode: "upi",
                          upiId: upi.upiId,
                          bankAccountHolderName: "",
                          bankName: "",
                          branchName: "",
                          bankAccountNumber: "",
                          currency: "",
                          bankIfscCode: "",
                          iban: "",
                          swiftCode: "",
                          routingNumber: "",
                        });
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between h-32 ${
                        isSelected
                          ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                          : "bg-white/5 border-border-main hover:bg-white/10 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-text-muted"}`}>
                            <QrCode size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-text-main text-sm">UPI ID</h4>
                            <p className="text-xs text-text-muted font-medium mt-0.5">Instant Payments</p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-primary flex-shrink-0">
                            <CheckCircle2 size={18} className="fill-primary/10" />
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-text-main tracking-wide truncate max-w-[200px]">{upi.upiId}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUpi(upi);
                            }}
                            className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-text-main hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteUpi(upi.id, e)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Button */}
              {upiList.length < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalUpi("");
                    setEditingUpiId(null);
                    setIsAddingUpi(true);
                    setLocalErrors({});
                  }}
                  className="w-full py-5 rounded-2xl border border-dashed border-primary/90 hover:border-primary/50 bg-white/[0.02] hover:bg-white/5 text-text-muted hover:text-text-main font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus size={18} />
                  Add UPI ID ({upiList.length}/3)
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Warning/Helper Banners */}
      {!isAddingBank && !isAddingUpi && (
        <div className="mt-8 text-center">
          {paymentMode === "bank" && bankList.length === 0 && (
            <p className="text-sm font-semibold text-amber-500/80 bg-amber-500/5 border border-amber-500/10 py-3.5 px-6 rounded-2xl max-w-md mx-auto">
              Please add at least one bank account to proceed.
            </p>
          )}
          {paymentMode === "upi" && upiList.length === 0 && (
            <p className="text-sm font-semibold text-amber-500/80 bg-amber-500/5 border border-amber-500/10 py-3.5 px-6 rounded-2xl max-w-md mx-auto">
              Please add at least one UPI ID to proceed.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
