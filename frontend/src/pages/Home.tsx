import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Prompt } from "@/lib/api";
import { CategoryEnum, api } from "@/lib/api";
import { Navbar } from "@/components/Navbar"; // <--- اضافه شده
import { Hero } from "@/components/Hero";
import { PromptCard } from "@/components/PromptCard";
import { SubmissionModal } from "@/components/SubmissionModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
    AlertCircle, 
    Plus, 
    Search, 
    Sparkles, 
    Filter, 
    LayoutGrid, 
    TrendingUp
} from "lucide-react";

const categoryTranslations: Record<string, string> = {
    "All": "همه",
    "Story": "استوری",
    "Post": "پست اینستاگرام",
    "Reels": "ریلز",
    "Logo": "لوگو و برندینگ",
    "Banner": "بنر تبلیغاتی",
    "Other": "سایر موارد"
};

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryEnum | "All">("All");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    const { data: prompts, isLoading, isError } = useQuery({
        queryKey: ["prompts", selectedCategory, selectedTags],
        queryFn: async () => {
            const params: any = {};
            if (selectedCategory !== "All") params.category = selectedCategory;
            if (selectedTags.length > 0) params.tags = selectedTags;
            const res = await api.get<Prompt[]>("/prompts", { params });
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const { data: allTags } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const res = await api.get<string[]>("/tags");
            return res.data;
        },
        staleTime: 1000 * 60 * 10,
    });

    const scrollToGallery = () => {
        galleryRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="min-h-screen bg-black font-sans text-foreground overflow-x-hidden selection:bg-purple-500/30" dir="rtl">
            
            {/* --- هدر سراسری --- */}
            <Navbar />

            {/* --- پس‌زمینه زنده --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
            </div>

            {/* Hero Section */}
            {/* اضافه کردن pt-20 برای اینکه هدر روی محتوا نیفتد */}
            <div className="relative z-10 pt-10"> 
                <Hero onExplore={scrollToGallery} onSubmitClick={() => setIsModalOpen(true)} />
            </div>

            <SubmissionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

            <main ref={galleryRef} className="container mx-auto px-4 pt-8 space-y-8 max-w-[1800px] relative z-10 pb-20">

                {/* --- نوار ابزار گالری --- */}
                <div className="sticky top-24 z-40 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-2xl shadow-black/50 transition-all duration-300 group hover:border-white/20">
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg shadow-purple-500/20">
                                <LayoutGrid className="w-6 h-6 text-white" />
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight font-display">گالری خلاقیت</h2>
                                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                                    <span className="text-green-400">{prompts ? prompts.length : 0} پرامپت فعال</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full max-w-lg">
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-zinc-500" />
                            </div>
                            <Input 
                                placeholder="جستجو در بین هزاران ایده..." 
                                className="pr-12 pl-4 bg-white/5 border-white/5 focus:border-purple-500/50 focus:bg-white/10 h-12 rounded-2xl transition-all text-right text-white placeholder:text-zinc-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 gap-2 hidden sm:flex">
                                <Filter className="w-4 h-4" /> فیلترها
                            </Button>
                            <Button
                                className="h-11 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] gap-2 font-bold transition-all"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus className="w-5 h-5" /> ثبت پرامپت
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-5">
                        <Tabs
                            value={selectedCategory}
                            onValueChange={(v) => setSelectedCategory(v as CategoryEnum | "All")}
                            className="w-full"
                        >
                            <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
                                <TabsList className="bg-transparent p-0 h-auto gap-3 flex w-max pl-4">
                                    <TabsTrigger
                                        value="All"
                                        className="rounded-xl px-6 py-2.5 border border-white/5 bg-white/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-transparent hover:bg-white/10 transition-all font-medium"
                                    >
                                        <LayoutGrid className="w-4 h-4 ml-2"/>
                                        همه
                                    </TabsTrigger>

                                    {Object.values(CategoryEnum)
                                        .filter((cat) => cat !== CategoryEnum.ALL)
                                        .map((cat) => (
                                            <TabsTrigger
                                                key={cat}
                                                value={cat}
                                                className="rounded-xl px-5 py-2.5 border border-white/5 bg-white/5 data-[state=active]:bg-white data-[state=active]:text-black hover:bg-white/10 transition-all"
                                            >
                                                {categoryTranslations[cat] || cat}
                                            </TabsTrigger>
                                        ))}
                                </TabsList>
                                <ScrollBar orientation="horizontal" className="hidden" />
                            </ScrollArea>
                        </Tabs>
                    </div>

                    {allTags && allTags.length > 0 && (
                        <div className="pt-5 flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0 bg-white/5 px-3 py-1.5 rounded-lg">
                                <TrendingUp className="w-3 h-3 text-green-400"/>
                                ترندها:
                            </div>
                            <ScrollArea className="w-full whitespace-nowrap">
                                <div className="flex gap-2 pb-1 pl-4">
                                    {allTags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className={`cursor-pointer px-4 py-1.5 text-xs border-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95
                                                ${selectedTags.includes(tag)
                                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                                                    : "text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20"
                                                }`}
                                            onClick={() => toggleTag(tag)}
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="hidden" />
                            </ScrollArea>
                        </div>
                    )}
                </div>

                {/* --- شبکه نمایش کارت‌ها --- */}
                <div className="min-h-[600px] w-full px-1">
                    {isLoading ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="break-inside-avoid">
                                    <Skeleton className="h-[300px] w-full rounded-3xl bg-white/5 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-32 text-red-400 bg-red-950/10 rounded-[2rem] border border-red-900/30 backdrop-blur-sm">
                            <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-xl font-bold">خطا در اتصال</p>
                            <Button variant="outline" className="mt-4 rounded-full" onClick={() => window.location.reload()}>تلاش مجدد</Button>
                        </div>
                    ) : prompts?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 text-center">
                            <div className="w-32 h-32 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/5">
                                <Sparkles className="w-12 h-12 text-zinc-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">پرامپتی پیدا نشد!</h3>
                            <Button 
                                variant="secondary" 
                                className="rounded-full px-8 h-12 font-medium mt-4"
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedTags([]);
                                }}
                            >
                                پاک کردن فیلترها
                            </Button>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-32">
                            {prompts?.map((prompt) => (
                                <div key={prompt.id || prompt._id} className="break-inside-avoid">
                                    <PromptCard prompt={prompt} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}