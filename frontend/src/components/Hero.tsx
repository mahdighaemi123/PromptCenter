import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown, Plus, Zap, Users, Star, Rocket, MessageCircle } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  onSubmitClick: () => void;
}

// کامپوننت کمکی برای آیکون‌های شناور
const FloatingIcon = ({ icon: Icon, delay, x, y, rotate }: { icon: any, delay: number, x: number, y: number, rotate: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4], 
      y: [0, -20, 0],
      rotate: [rotate, rotate + 10, rotate],
    }}
    transition={{ 
      duration: 5, 
      delay: delay, 
      repeat: Infinity,
      ease: "easeInOut" 
    }}
    className="absolute text-white/10 pointer-events-none hidden lg:block backdrop-blur-sm p-4 rounded-3xl border border-white/5 bg-white/5"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Icon className="w-16 h-16" />
  </motion.div>
);

export function Hero({ onExplore, onSubmitClick }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden py-20" dir="rtl">
      
      {/* --- پس‌زمینه پویا --- */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] -z-10 animate-pulse delay-1000" />
      
      {/* آیکون‌های شناور بزرگ در فضا */}
      <FloatingIcon icon={Rocket} delay={0} x={10} y={15} rotate={-10} />
      <FloatingIcon icon={MessageCircle} delay={2} x={85} y={20} rotate={10} />
      <FloatingIcon icon={Zap} delay={1} x={15} y={65} rotate={-5} />
      <FloatingIcon icon={Star} delay={3} x={80} y={70} rotate={15} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl space-y-8 relative z-10"
      >
        {/* بج بالای تیتر */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-purple-200 text-sm font-medium backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 transition-colors cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>بزرگترین مرجع پرامپت‌های هوش مصنوعی</span>
        </motion.div>

        {/* تیتر اصلی */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl leading-tight">
          خلاقیت خود را <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
             آزاد کنید
          </span>
        </h1>
        
        {/* توضیحات */}
        <p className="text-lg md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light">
          گنجینه‌ای از بهترین دستورات (Prompts) برای <span className="text-white font-bold">Midjourney</span>، <span className="text-white font-bold">ChatGPT</span> و شبکه‌های اجتماعی. 
          <br className="hidden sm:block"/>
          کپی کنید، ایده بگیرید و محتوای خیره‌کننده بسازید.
        </p>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
          <Button 
            size="lg" 
            className="text-lg px-10 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 font-bold gap-2" 
            onClick={onExplore}
          >
            <Sparkles className="w-5 h-5" />
            شروع کاوش
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-10 h-16 rounded-2xl border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1 text-white gap-2"
            onClick={onSubmitClick}
          >
            <Plus className="w-5 h-5" />
            ثبت پرامپت جدید
          </Button>
        </div>

        {/* بخش اعتماد اجتماعی (Avatars) */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6 text-zinc-400 text-sm">
            <div className="flex -space-x-3 space-x-reverse">
                {[1,2,3,4].map((i) => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-black" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+12}`} alt="User" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                    +2k
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                    </div>
                    <span>محبوب بین ۱۰,۰۰۰ کاربر</span>
                </div>
            </div>
        </div>
      </motion.div>

      {/* فلش پایین */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={onExplore}
      >
        <ArrowDown className="w-8 h-8 animate-bounce text-zinc-500 hover:text-white transition-colors" />
      </motion.div>
    </section>
  );
}