import { motion } from "motion/react";
import { Home, AlertCircle } from "lucide-react";
import { fadeInUp, fadeIn } from "../utils/animationUtils";
import { useLanguage } from "../i18n/LanguageContext";

export function NotFoundPage() {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <motion.div variants={fadeInUp} className="mb-6">
        <div className="w-20 h-20 bg-m-red/10 rounded-full flex items-center justify-center mx-auto text-m-red">
          <AlertCircle className="w-10 h-10" />
        </div>
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        className="text-4xl font-black text-m-ink mb-2 tracking-tighter"
      >
        {lang === "fr" ? "Page Introuvable" : "Page Not Found"}
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="text-m-ink-muted max-w-md mb-8"
      >
        {lang === "fr"
          ? "Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
          : "Sorry, the page you are looking for does not exist or has been moved."}
      </motion.p>

      <motion.div variants={fadeInUp}>
        <a
          href={`/${lang}`}
          className="inline-flex items-center gap-2 bg-m-ink hover:bg-m-red text-m-card px-6 py-3 rounded-full font-bold text-[14px] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-m-red/20"
        >
          <Home className="w-4 h-4" />
          {lang === "fr" ? "Retour à l'accueil" : "Back to Home"}
        </a>
      </motion.div>
    </motion.div>
  );
}
