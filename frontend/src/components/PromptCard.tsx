import type { Prompt } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function PromptCard({ prompt }: { prompt: Prompt }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt_text);
        setCopied(true);
        toast.success("پرامپت با موفقیت کپی شد!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="break-inside-avoid mb-6"
            dir="rtl" // کل کارت راست‌چین
        >
            <Card className="overflow-hidden border-white/10 bg-[#121212] hover:bg-[#181818] backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group flex flex-col shadow-lg hover:shadow-purple-900/10">
                
                {prompt.image_url && (
                    <div className="w-full overflow-hidden bg-zinc-900 relative">
                        <img
                            src={prompt.image_url}
                            alt={prompt.title}
                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 block"
                            loading="lazy"
                        />
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border-none cursor-pointer">
                                <Heart className="w-3 h-3 mr-1" /> پسندیدن
                            </Badge>
                        </div>
                    </div>
                )}

                <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-lg leading-tight text-zinc-100">{prompt.title}</h3>
                        <Badge variant="secondary" className="shrink-0 bg-white/10 hover:bg-white/20 text-zinc-300 border-none">
                            {prompt.category}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 px-5">
                    {/* باکس متن پرامپت - چپ‌چین برای خوانایی انگلیسی */}
                    <div 
                        className="relative p-4 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-400 font-mono max-h-32 overflow-hidden mask-linear-fade text-left" 
                        dir="ltr"
                    >
                        <span className="select-text">{prompt.prompt_text}</span>
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {prompt.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-colors cursor-pointer">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="pt-0 flex justify-between items-center text-sm text-muted-foreground border-t border-white/5 p-4 bg-white/[0.02] mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-zinc-400">{prompt.author}</span>
                    </div>

                    <Button
                        size="sm"
                        variant={copied ? "default" : "secondary"}
                        onClick={handleCopy}
                        className={`h-9 px-4 gap-2 transition-all rounded-lg ${copied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "کپی شد" : "کپی"}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}