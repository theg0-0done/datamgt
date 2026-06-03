import { Truck, CheckCircle, HeadphonesIcon, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function FeaturesBar() {
  const { t } = useLanguage();

  return (
    <div className="px-[5%] mt-12 mb-4">
      <div className="bg-m-card rounded-[20px] p-[30px] grid grid-cols-2 md:grid-cols-4 gap-[20px] border border-m-border shadow-sm">
        <div className="flex items-center gap-[15px]">
          <Truck className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">{t("features.freeShipping")}</h4>
            <p className="text-m-ink-muted text-[12px]">{t("features.freeShippingDesc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <CheckCircle className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">{t("features.safeMoney")}</h4>
            <p className="text-m-ink-muted text-[12px]">{t("features.safeMoneyDesc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <HeadphonesIcon className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">{t("features.support")}</h4>
            <p className="text-m-ink-muted text-[12px]">{t("features.supportDesc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <ShieldCheck className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">{t("features.securePayment")}</h4>
            <p className="text-m-ink-muted text-[12px]">{t("features.securePaymentDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

