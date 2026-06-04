import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, CheckCircle, ChevronDown, Building, User, FileText, Send, HelpCircle } from "lucide-react";
import { fadeInUp, staggerContainer } from "../utils/animationUtils";
import { useLanguage } from "../i18n/LanguageContext";
import { sendContactInquiryEmail } from "../utils/emailService";

export function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    inquiryPurpose: "",
    description: "",
    fullName: "",
    email: "",
    organization: "",
    phoneNumber: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!form.inquiryPurpose) tempErrors.inquiryPurpose = t("contact.purposeRequired");
    if (!form.description) tempErrors.description = t("contact.descRequired");
    if (!form.fullName.trim()) tempErrors.fullName = t("contact.nameRequired");
    if (!form.email.trim()) {
      tempErrors.email = t("contact.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = t("contact.emailInvalid");
    }
    if (!form.message.trim()) tempErrors.message = t("contact.messageRequired");

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSending(true);
      setSubmitError(null);
      try {
        await sendContactInquiryEmail({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          organization: form.organization,
          inquiryPurpose: form.inquiryPurpose,
          description: form.description,
          message: form.message,
        });
        setSubmitted(true);
      } catch (err) {
        console.error("Error sending contact inquiry:", err);
        setSubmitError(t("contact.failedSend"));
      } finally {
        setIsSending(false);
      }
    }
  };

  return (

    <motion.div
      initial="hidden"
      animate="visible"
      className="px-[5%] py-16 min-h-screen bg-m-bg transition-colors duration-300"
    >
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-m-red font-black text-[13px] uppercase tracking-widest mb-3 block">
            {t("contact.badge")}
          </span>
          <h1 className="text-[38px] md:text-[54px] font-black text-m-ink leading-tight mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-m-ink-muted text-[16px] max-w-md mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        {/* Contact Methods Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {/* Card 1: Phone */}
          <motion.div
            variants={fadeInUp}
            className="bg-m-card border border-m-border rounded-[24px] p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-14 h-14 bg-m-red/10 rounded-full flex items-center justify-center text-m-red mb-5 flex-shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <p className="text-m-ink font-bold text-[18px] mb-2">{t("contact.call")}</p>
            <a
              href="https://wa.me/212668531517"
              target="_blank"
              rel="noopener noreferrer"
              className="text-m-ink font-bold text-[16px] hover:text-m-red transition-colors block"
            >
              +212 668-531517
            </a>
          </motion.div>

          {/* Card 2: Email */}
          <motion.div
            variants={fadeInUp}
            className="bg-m-card border border-m-border rounded-[24px] p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-14 h-14 bg-m-red/10 rounded-full flex items-center justify-center text-m-red mb-5 flex-shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-m-ink font-bold text-[18px] mb-2">{t("contact.emailSupport")}</p>
            <a
              href="mailto:contact@datamgt.ma"
              className="text-m-ink font-bold text-[16px] hover:text-m-red transition-colors block"
            >
              contact@datamgt.ma
            </a>
          </motion.div>

          {/* Card 3: Location */}
          <motion.div
            variants={fadeInUp}
            className="bg-m-card border border-m-border rounded-[24px] p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-14 h-14 bg-m-red/10 rounded-full flex items-center justify-center text-m-red mb-5 flex-shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <p className="text-m-ink font-bold text-[18px] mb-2">{t("contact.officeLocation")}</p>
            <p className="text-m-ink-muted text-[15px]">{t("contact.locationStreet")}</p>
            <p className="text-m-ink-muted text-[14px] mt-1 opacity-70">{t("contact.locationCity")}</p>
          </motion.div>
        </motion.div>

        <hr className="border-m-border/60 my-16 max-w-xl mx-auto" />

        {/* Contact Form Section */}
        <motion.div variants={fadeInUp} className="mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <h2 className="text-[26px] font-black text-center text-m-ink mb-10">
                  {t("contact.orFillForm")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inquiry Purpose */}
                    <div className="relative">
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        {t("contact.purposeLabel")} <span className="text-m-red">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          name="inquiryPurpose"
                          value={form.inquiryPurpose}
                          onChange={handleChange}
                          disabled={isSending}
                          className={`w-full bg-m-card border-2 ${errors.inquiryPurpose ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 pr-10 text-[14px] font-medium text-m-ink outline-none appearance-none transition-all cursor-pointer disabled:opacity-60`}
                        >
                          <option value="">{t("contact.chooseOption")}</option>
                          <option value="sales">{t("contact.optSales")}</option>
                          <option value="support">{t("contact.optSupport")}</option>
                          <option value="partnership">{t("contact.optPartnership")}</option>
                          <option value="general">{t("contact.optGeneral")}</option>
                        </select>
                        <ChevronDown className="absolute right-4 h-5 w-5 text-m-ink-muted pointer-events-none" />
                      </div>
                      {errors.inquiryPurpose && (
                        <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.inquiryPurpose}</p>
                      )}
                    </div>

                    {/* Description fits you */}
                    <div className="relative">
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        {t("contact.descLabel")} <span className="text-m-red">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          disabled={isSending}
                          className={`w-full bg-m-card border-2 ${errors.description ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 pr-10 text-[14px] font-medium text-m-ink outline-none appearance-none transition-all cursor-pointer disabled:opacity-60`}
                        >
                          <option value="">{t("contact.chooseOption")}</option>
                          <option value="individual">{t("contact.optIndividual")}</option>
                          <option value="business">{t("contact.optBusiness")}</option>
                          <option value="reseller">{t("contact.optReseller")}</option>
                          <option value="other">{t("contact.optOther")}</option>
                        </select>
                        <ChevronDown className="absolute right-4 h-5 w-5 text-m-ink-muted pointer-events-none" />
                      </div>
                      {errors.description && (
                        <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        {t("contact.nameLabel")} <span className="text-m-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        disabled={isSending}
                        placeholder={t("contact.placeholderName")}
                        className={`w-full bg-m-card border-2 ${errors.fullName ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50 disabled:opacity-60`}
                      />
                      {errors.fullName && (
                        <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        {t("contact.emailLabel")} <span className="text-m-red">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isSending}
                        placeholder={t("contact.placeholderEmail")}
                        className={`w-full bg-m-card border-2 ${errors.email ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50 disabled:opacity-60`}
                      />
                      {errors.email && (
                        <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Organization and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        {t("contact.orgLabel")}
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        disabled={isSending}
                        placeholder={t("contact.placeholderOrg")}
                        className="w-full bg-m-card border-2 border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80 rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50 disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        {t("contact.phoneLabel")}
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        disabled={isSending}
                        placeholder={t("contact.placeholderPhone")}
                        className="w-full bg-m-card border-2 border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80 rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                      {t("contact.messageLabel")} <span className="text-m-red">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      disabled={isSending}
                      placeholder={t("contact.placeholderMsg")}
                      className={`w-full bg-m-card border-2 ${errors.message ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50 resize-none disabled:opacity-60`}
                    />
                    {errors.message && (
                      <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.message}</p>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-4 bg-m-red/10 border border-m-red/20 text-m-red rounded-xl font-bold text-[14px]">
                      {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center md:justify-start pt-4">
                    <button
                      type="submit"
                      disabled={isSending}
                      className={`bg-m-red hover:bg-m-red/70 active:scale-95 text-white flex items-center justify-center gap-2 rounded-xl py-3 px-8 font-black font-sans uppercase tracking-widest text-[13px] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <span>{isSending ? t("contact.sending") : t("contact.submitBtn")}</span>
                      {!isSending && <span className="font-light">▷</span>}
                    </button>
                  </div>
                </form>
              </motion.div>

            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-center bg-m-card border border-m-border rounded-[32px] p-12 py-16 shadow-xl"
              >
                <div className="w-20 h-20 bg-[#0D3B36]/10 text-[#0d3b36] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-[28px] font-black text-m-ink mb-4">
                  {t("contact.thankYou")}
                </h3>
                <p className="text-m-ink-muted text-[16px] max-w-md mx-auto mb-8 leading-relaxed">
                  {t("contact.successMsg")}
                </p>
                <button
                  onClick={() => {
                    setForm({
                      inquiryPurpose: "",
                      description: "",
                      fullName: "",
                      email: "",
                      organization: "",
                      phoneNumber: "",
                      message: "",
                    });
                    setSubmitted(false);
                  }}
                  className="border-2 border-m-ink text-m-ink hover:bg-m-ink hover:text-m-bg rounded-xl py-2.5 px-6 font-bold text-[14px] transition-all active:scale-95 cursor-pointer"
                >
                  {t("contact.sendAnother")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
