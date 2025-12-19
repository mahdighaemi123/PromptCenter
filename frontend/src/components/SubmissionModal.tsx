import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon, X, UploadCloud, Sparkles } from "lucide-react";
import { api, CategoryEnum } from "@/lib/api";
import { toast } from "sonner";

interface SubmissionModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubmissionModal({ isOpen, onOpenChange }: SubmissionModalProps) {
    const queryClient = useQueryClient();
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        prompt_text: "",
        category: CategoryEnum.OTHER,
        tags: "",
        author: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const mutation = useMutation({
        mutationFn: async () => {
            let finalImageUrl = "";
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);
                const uploadRes = await api.post("/upload", uploadFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                finalImageUrl = uploadRes.data.url;
            }
            const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t !== "");
            const newPrompt = {
                ...formData,
                tags: tagsArray,
                image_url: finalImageUrl 
            };
            const response = await api.post("/prompts", newPrompt);
            return response.data;
        },
        onSuccess: () => {
            onOpenChange(false);
            toast.success("پرامپت با موفقیت ثبت شد!");
            setFormData({ title: "", prompt_text: "", category: CategoryEnum.OTHER, tags: "", author: "" });
            setSelectedFile(null);
            setPreviewUrl(null);
            queryClient.invalidateQueries({ queryKey: ["prompts"] });
        },
        onError: () => {
            toast.error("خطا در ثبت. لطفا دوباره تلاش کنید.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] bg-[#1a1a1a]/95 backdrop-blur-xl border-white/10 text-white max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        ثبت پرامپت جدید
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-right">
                        ایده خلاقانه خود را با دیگران به اشتراک بگذارید.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    {/* فیلد آپلود تصویر پیشرفته */}
                    <div className="grid gap-2">
                        <Label className="text-zinc-300">تصویر کاور (اختیاری)</Label>
                        {!previewUrl ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Label 
                                    htmlFor="image-upload" 
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
                                >
                                    <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-purple-300 transition-colors">
                                        <div className="p-2 bg-white/5 rounded-full group-hover:bg-purple-500/20">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-medium">برای آپلود کلیک کنید</span>
                                    </div>
                                </Label>
                            </div>
                        ) : (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors text-white shadow-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-zinc-300">عنوان پرامپت</Label>
                        <Input 
                            required 
                            placeholder="مثلا: طراحی لوگوی مینیمال..." 
                            className="bg-black/20 border-white/10 focus:border-purple-500/50 h-11 rounded-xl text-right placeholder:text-zinc-600"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-zinc-300">متن پرامپت (انگلیسی)</Label>
                        <Textarea 
                            required 
                            placeholder="Enter the prompt text here..." 
                            className="min-h-[120px] bg-black/20 border-white/10 focus:border-purple-500/50 resize-none rounded-xl text-left font-mono text-sm placeholder:text-zinc-700"
                            value={formData.prompt_text}
                            onChange={e => setFormData({...formData, prompt_text: e.target.value})}
                            dir="ltr" // برای نوشتن انگلیسی
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-zinc-300">دسته‌بندی</Label>
                            <Select 
                                value={formData.category} 
                                onValueChange={(val: CategoryEnum) => setFormData({...formData, category: val})}
                            >
                                <SelectTrigger className="bg-black/20 border-white/10 h-11 rounded-xl text-right" dir="rtl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white" dir="rtl">
                                    {Object.values(CategoryEnum).map((cat) => (
                                        <SelectItem key={cat} value={cat} className="focus:bg-white/10 cursor-pointer">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-zinc-300">نام شما</Label>
                            <Input 
                                required 
                                placeholder="نام نویسنده"
                                className="bg-black/20 border-white/10 focus:border-purple-500/50 h-11 rounded-xl text-right"
                                value={formData.author}
                                onChange={e => setFormData({...formData, author: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-zinc-300">تگ‌ها (با کاما جدا کنید)</Label>
                        <Input 
                            placeholder="dark, funny, minimal" 
                            className="bg-black/20 border-white/10 focus:border-purple-500/50 h-11 rounded-xl text-left font-mono text-sm"
                            value={formData.tags}
                            onChange={e => setFormData({...formData, tags: e.target.value})}
                            dir="ltr"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={mutation.isPending} className="bg-white text-black hover:bg-zinc-200 w-full h-12 rounded-xl text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                    در حال ارسال...
                                </>
                            ) : (
                                "ثبت نهایی پرامپت"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}