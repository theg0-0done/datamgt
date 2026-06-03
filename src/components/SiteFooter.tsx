import { Facebook, Instagram, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import darkLogo from "../assets/datamgt_dark_logo_png.png";
import lightLogo from "../assets/datamgt_light_logo_png.png";
import { useLanguage } from "../i18n/LanguageContext";

export function SiteFooter({ isDark }: { isDark: boolean }) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-m-card border-t border-m-border pt-16 pb-8">
      <div className="px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex-shrink-0 flex items-center gap-[8px] cursor-pointer mb-6">
                <img src={isDark ? darkLogo : lightLogo} alt="Data Management Logo" className="h-[40px] w-auto object-contain" />
             </div>
             <p className="text-m-ink-muted text-[14px] leading-relaxed mb-6">
                {t("footer.description")}
             </p>
             <div className="flex gap-4">
                 <a href="https://www.facebook.com/datamgt.officielle/" target="__blank" className="w-10 h-10 rounded-full bg-m-border flex items-center justify-center text-m-ink hover:bg-m-red hover:text-white transition-colors">
                     <Facebook className="h-5 w-5" />
                 </a>
                 <a href="https://instagram.com/datamgt.ma/" target="__blank" className="w-10 h-10 rounded-full bg-m-border flex items-center justify-center text-m-ink hover:bg-m-red hover:text-white transition-colors">
                     <Instagram className="h-5 w-5" />
                 </a>
                 <a href="mailto:contact@datamgt.ma" target="__blank" className="w-10 h-10 rounded-full bg-m-border flex items-center justify-center text-m-ink hover:bg-m-red hover:text-white transition-colors">
                     <Mail className="h-5 w-5" />
                 </a>
             </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold text-[16px] mb-6">{t("footer.quickLinks")}</h4>
            <ul className="flex flex-col gap-3 text-[14px] text-m-ink-muted">
                <li><Link to={`/${lang}`} className="hover:text-m-red hover:font-bold transition-colors">{t("navbar.home")}</Link></li>
                <li><Link to={`/${lang}/about`} className="hover:text-m-red hover:font-bold transition-colors">{t("navbar.about")}</Link></li>
                <li><Link to={`/${lang}/products`} className="hover:text-m-red hover:font-bold transition-colors">{t("navbar.products")}</Link></li>
                <li><a href="#faq" className="hover:text-m-red hover:font-bold transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
             <h4 className="font-bold text-[16px] mb-6">{t("footer.contactUs")}</h4>
             <div className="bg-m-border/50 p-4 rounded-[12px]">
                <p className="text-m-ink-muted text-[12px] mb-2">{t("footer.gotQuestions")}</p>
                <a href="tel:+212668531517" className="text-[20px] font-bold text-m-red block mb-4">
                    +212 668-531517
                </a>
                <button
                    onClick={() => window.open('https://wa.me/212668531517', '_blank')}
                    className="w-full flex items-center justify-center gap-2 bg-m-red hover:bg-m-ink-muted text-white py-2 rounded-[8px] font-bold text-[14px] transition-colors"
                >
                    <MessageCircle className="h-5 w-5" /> {t("footer.whatsappUs")}
                </button>
             </div>
          </div>
        </div>

        <div className="border-t border-m-border pt-8 flex justify-center items-center gap-4">
            <p className="text-m-ink-muted text-[14px]">
                © {new Date().getFullYear()} Data Management. {t("footer.rightsReserved")}
            </p>
        </div>
      </div>
    </footer>
  );
}
