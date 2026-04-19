import { Clock, MapPin, MessageCircle, Mail } from "lucide-react";

export function ContactSection() {
  return (
    <div className="px-[5%] mt-20 mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-m-red font-bold text-[13px] uppercase tracking-widest mb-3 block">
          Find Us
        </span>
        <h2 className="text-[36px] font-bold text-m-ink mb-3">Contact & Location</h2>
        <p className="text-m-ink-muted text-[16px] max-w-md mx-auto">
          Visit our store or reach out — we're here to help every day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Map */}
        <div className="rounded-[24px] overflow-hidden shadow-lg border border-m-border min-h-[420px]">
          <iframe
            title="Store Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d517.6648579746352!2d-4.832447379084203!3d33.826847775629616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f9b3d5d6dd7ad%3A0xcd974fd2eb8032ee!2sData%20Management!5e1!3m2!1sde!2sma!4v1776523682550!5m2!1sde!2sma"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "420px", display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Info */}
        <div className="bg-m-card rounded-[24px] border border-m-border p-10 flex flex-col justify-center shadow-sm">
          <h3 className="text-[26px] font-bold text-m-ink mb-2">Get in Touch</h3>
          <p className="text-m-ink-muted text-[15px] mb-8">
            Come visit us in-store or send us a message on WhatsApp — we're happy to assist.
          </p>

          <div className="flex flex-col gap-6">
            {/* Opening Times */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0 mt-0.5">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-m-ink font-bold text-[16px]">Every Day</p>
                <p className="text-m-ink-muted text-[14px]">09:30 – 20:00</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0 mt-0.5">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-m-ink font-bold text-[16px]">Rue Ibn Jaber, HABBOUNA</p>
                <p className="text-m-ink-muted text-[14px]">Sefrou 31000, Morocco</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0 mt-0.5">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <a
                  href="https://wa.me/212762895481"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-m-ink font-bold text-[16px] hover:text-m-red transition-colors"
                >
                  +212 762 895 481
                </a>
                <p className="text-m-ink-muted text-[14px]">Telefon and WhatsApp</p>
              </div>
            </div>
            {/* Email */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-m-red/10 flex items-center justify-center text-m-red flex-shrink-0 mt-0.5">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <a
                  href="mailto:contact@datamgt.ma"
                  className="text-m-ink font-bold text-[16px] hover:text-m-red transition-colors"
                >
                  contact@datamgt.ma
                </a>
                <p className="text-m-ink-muted text-[14px]">Official Email Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
