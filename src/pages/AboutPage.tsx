import { ShieldCheck, Zap, HeadphonesIcon } from "lucide-react";

export function AboutPage() {
  return (
    <div className="px-[5%] py-16 animation-fade-in">
        {/* Main Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1 relative rounded-[24px] overflow-hidden shadow-2xl h-[400px] md:h-[440px] group">
                <div className="absolute inset-0 bg-m-ink/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Data Management Workspace" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-[32px] md:text-[40px] font-bold leading-tight relative">
                    Our Story
                    <div className="absolute -left-6 top-4 w-2 h-12 bg-m-red rounded-full hidden md:block"></div>
                </h2>
                <div className="space-y-6 text-m-ink-muted text-[16px] leading-relaxed">
                    <p>
                        Founded in the heart of Sefrou, Data Management was born from a simple vision: to bridge the gap between global electronic innovation and the Moroccan consumer. We realized that finding authentic, high-quality tech gear often meant long waiting times or settling for subpar alternatives.
                    </p>
                    <p>
                        We started small, sourcing only the best headphones and smartwatches, but our commitment to quality quickly resonated with our community. Today, we offer an expansive catalog of the latest laptops, smartphones, and accessories.
                    </p>
                    <p>
                        Our promise remains unchanged. We don't just sell products; we curate experiences. Every item in our inventory is tested and guaranteed to meet our rigorous standards. We believe that top-tier technology should be accessible, backed by customer support that treats you like family.
                    </p>
                </div>
            </div>
        </div>

        {/* Bold Process/Metrics */}
        <div className="mb-32 rounded-[32px] p-12 md:p-24 text-white relative bg-m-ink shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-m-red/60 blur-[100px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-m-blue/60 blur-[100px] -ml-64 -mb-64"></div>
            <div className="relative z-10 flex justify-around flex-col md:flex-row w-full gap-12 text-center text-m-bg">
                <div className="pt-8 md:pt-0">
                    <div className="text-[56px] md:text-[72px] font-bold tracking-tighter leading-none mb-2">
                        150+
                    </div>
                    <div className="text-[14px] font-medium tracking-widest uppercase opacity-80">
                        Top Brands
                    </div>
                </div>
                <div className="pt-8 md:pt-0">
                    <div className="text-[56px] md:text-[72px] font-bold tracking-tighter leading-none mb-2">
                        48h
                    </div>
                    <div className="text-[14px] font-medium tracking-widest uppercase opacity-80">
                        Fastest Delivery
                    </div>
                </div>
                <div className="pt-8 md:pt-0">
                    <div className="text-[56px] md:text-[72px] font-bold tracking-tighter leading-none mb-2">
                        +25K
                    </div>
                    <div className="text-[14px] font-medium tracking-widest uppercase opacity-80">
                        Happy Customers
                    </div>
                </div>
                <div className="pt-8 md:pt-0">
                    <div className="text-[56px] md:text-[72px] font-bold tracking-tighter leading-none mb-2">
                        24/7
                    </div>
                    <div className="text-[14px] font-medium tracking-widest uppercase opacity-80">
                        Expert Support
                    </div>
                </div>
            </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-32">
            <div className="text-center mb-16">
                <h2 className="text-[32px] font-bold">Why Choose Us</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center p-8 rounded-[24px] bg-m-card border border-m-border hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto bg-m-red/10 rounded-full flex items-center justify-center mb-6">
                        <ShieldCheck className="w-9 h-9 text-m-red" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-4">Premium Quality</h3>
                    <p className="text-m-ink-muted text-[14px]">
                        We partner directly with manufacturers to ensure every product is 100% authentic and meets global standards.
                    </p>
                </div>
                <div className="text-center p-8 rounded-[24px] bg-m-card border border-m-border hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto bg-m-red/10 rounded-full flex items-center justify-center mb-6">
                        <Zap className="w-9 h-9 text-m-red" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-4">Express Delivery</h3>
                    <p className="text-m-ink-muted text-[14px]">
                        Our optimized logistics network coverage ensures your latest tech arrives at your doorstep faster than ever.
                    </p>
                </div>
                <div className="text-center p-8 rounded-[24px] bg-m-card border border-m-border hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto bg-m-red/10 rounded-full flex items-center justify-center mb-6">
                        <HeadphonesIcon className="w-9 h-9 text-m-red" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-4">Dedicated Support</h3>
                    <p className="text-m-ink-muted text-[14px]">
                        Our tech experts are always on standby to help you choose, setup, and troubleshoot your devices.
                    </p>
                </div>
            </div>
        </div>

        {/* Bento Grid Gallery */}
        <div className="mb-24">
            <div className="text-center mb-16">
                <h2 className="text-[32px] font-bold">Life at Data Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                <div className="md:col-span-2 md:row-span-2 rounded-[24px] overflow-hidden relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Gallery Image 1"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="md:col-span-2 rounded-[24px] overflow-hidden relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Gallery Image 2"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                </div>
                <div className="rounded-[24px] overflow-hidden relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                        alt="Gallery Image 3"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                </div>
                <div className="rounded-[24px] overflow-hidden relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                        alt="Gallery Image 4"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                </div>
            </div>
        </div>
    </div>
  );
}
