import { Truck, CheckCircle, HeadphonesIcon, ShieldCheck } from "lucide-react";

export function FeaturesBar() {
  return (
    <div className="px-[5%] mt-12 mb-4">
      <div className="bg-m-card rounded-[20px] p-[30px] grid grid-cols-2 md:grid-cols-4 gap-[20px] border border-m-border shadow-sm">
        <div className="flex items-center gap-[15px]">
          <Truck className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">Free Shipping</h4>
            <p className="text-m-ink-muted text-[12px]">On all orders</p>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <CheckCircle className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">Safe Money</h4>
            <p className="text-m-ink-muted text-[12px]">30 Days Return</p>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <HeadphonesIcon className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">24/7 Support</h4>
            <p className="text-m-ink-muted text-[12px]">Call us anytime</p>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <ShieldCheck className="h-8 w-8 text-m-red flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px]">Secure Payment</h4>
            <p className="text-m-ink-muted text-[12px]">100% secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
