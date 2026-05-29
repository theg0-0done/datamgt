import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, CheckCircle, ChevronDown, Building, User, FileText, Send, HelpCircle } from "lucide-react";
import { fadeInUp, staggerContainer } from "../utils/animationUtils";

export function ContactPage() {
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!form.inquiryPurpose) tempErrors.inquiryPurpose = "Inquiry purpose is required";
    if (!form.description) tempErrors.description = "Please select a description";
    if (!form.fullName.trim()) tempErrors.fullName = "Full name is required";
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!form.message.trim()) tempErrors.message = "Message is required";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Simulate submission
      setSubmitted(true);
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
            Get In Touch
          </span>
          <h1 className="text-[38px] md:text-[54px] font-black text-m-ink leading-tight mb-4">
            Let's Get In Touch
          </h1>
          <p className="text-m-ink-muted text-[16px] max-w-md mx-auto">
            We are here to answer your questions and help you with your tech requirements.
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
            <p className="text-m-ink font-bold text-[18px] mb-2">Call/WhatsApp</p>
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
            <p className="text-m-ink font-bold text-[18px] mb-2">Email Support</p>
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
            <p className="text-m-ink font-bold text-[18px] mb-2">Office Location</p>
            <p className="text-m-ink-muted text-[15px]">Rue Ibn Jaber, HABBOUNA</p>
            <p className="text-m-ink-muted text-[14px] mt-1 opacity-70">Sefrou 31000, Morocco</p>
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
                  Or fill out the form below
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inquiry Purpose */}
                    <div className="relative">
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        Inquiry Purpose <span className="text-m-red">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          name="inquiryPurpose"
                          value={form.inquiryPurpose}
                          onChange={handleChange}
                          className={`w-full bg-m-card border-2 ${errors.inquiryPurpose ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 pr-10 text-[14px] font-medium text-m-ink outline-none appearance-none transition-all cursor-pointer`}
                        >
                          <option value="">Choose one option...</option>
                          <option value="sales">Sales Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Business Partnership</option>
                          <option value="general">General Question</option>
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
                        Description that fits you <span className="text-m-red">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          className={`w-full bg-m-card border-2 ${errors.description ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 pr-10 text-[14px] font-medium text-m-ink outline-none appearance-none transition-all cursor-pointer`}
                        >
                          <option value="">Choose one option...</option>
                          <option value="individual">Individual / Consumer</option>
                          <option value="business">Business / Enterprise</option>
                          <option value="reseller">Reseller / Wholesaler</option>
                          <option value="other">Other</option>
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
                        Full Name <span className="text-m-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name..."
                        className={`w-full bg-m-card border-2 ${errors.fullName ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50`}
                      />
                      {errors.fullName && (
                        <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        Email Address <span className="text-m-red">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email address..."
                        className={`w-full bg-m-card border-2 ${errors.email ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50`}
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
                        Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="Enter your organization..."
                        className="w-full bg-m-card border-2 border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80 rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50"
                      />
                    </div>

                    <div>
                      <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number..."
                        className="w-full bg-m-card border-2 border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80 rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[12px] font-black uppercase tracking-wider text-m-ink-muted mb-2 block">
                      Message <span className="text-m-red">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Enter your message here..."
                      className={`w-full bg-m-card border-2 ${errors.message ? "border-m-red" : "border-m-border hover:border-m-ink-muted/50 focus:border-m-red/80"} rounded-2xl p-4 text-[14px] font-medium text-m-ink outline-none transition-all placeholder:text-m-ink-muted/50 resize-none`}
                    />
                    {errors.message && (
                      <p className="text-m-red text-[11px] font-bold mt-1.5">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center md:justify-start pt-4">
                    <button
                      type="submit"
                      className="bg-m-red hover:bg-m-red/70 active:scale-95 text-white flex items-center justify-center gap-2 rounded-xl py-3 px-8 font-black font-sans uppercase tracking-widest text-[13px] transition-all cursor-pointer"
                    >
                      <span>Submit Form</span>
                      <span className="font-light">▷</span>
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
                  Thank You!
                </h3>
                <p className="text-m-ink-muted text-[16px] max-w-md mx-auto mb-8 leading-relaxed">
                  Your message has been sent successfully. Our team will review your inquiry and get back to you shortly.
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
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
