import { Button } from "@/components/ui/button";
import { Sparkles, Github, Menu, User, Bell, Search } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-md transition-all duration-300" dir="rtl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            
            {/* بخش راست: لوگو و منو */}
            <div className="flex items-center gap-8">
                {/* لوگو */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Sparkles className="w-6 h-6 text-white" />
                        <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-white leading-none">
                            پرامپت‌سنتـر
                        </span>
                        <span className="text-[10px] text-purple-300 font-medium tracking-wider opacity-80">
                            PROMPT CENTER
                        </span>
                    </div>
                </div>

                {/* لینک‌های منو (مخصوص دسکتاپ) */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                    {['کاوش', 'آموزش', 'برترین‌ها', 'بلاگ'].map((item, i) => (
                        <a 
                            key={item} 
                            href="#" 
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${i === 0 ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>

            {/* بخش چپ: جستجو و اکشن‌ها */}
            <div className="flex items-center gap-3">
                {/* دکمه جستجو (موبایل) */}
                <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
                    <Search className="w-5 h-5" />
                </Button>

                {/* نوتیفیکیشن */}
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
                </Button>

                <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                {/* دکمه گیت‌هاب */}
                <Button variant="ghost" size="icon" className="hidden sm:flex text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                    <Github className="w-5 h-5" />
                </Button>

                {/* دکمه ورود/عضویت */}
                <Button className="hidden sm:flex rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-6 h-10 gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <User className="w-4 h-4" />
                    <span>ورود حساب</span>
                </Button>
                
                {/* دکمه منو موبایل */}
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                </Button>
            </div>
        </div>
    </nav>
  )
}