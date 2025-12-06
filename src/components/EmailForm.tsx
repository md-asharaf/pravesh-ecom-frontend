import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { contactService } from "@/services/contact.service"
import { useAppSelector } from "@/store/hooks"

type FormValues = {
    name: string
    email: string
    subject?: string
    message: string
}

export default function EmailForm() {
    const { register, handleSubmit, reset } = useForm<FormValues>()
    const settings = useAppSelector((s) => s.settings.settings);
    const email = settings?.email || "support@praveshmart.com";

    const { mutate: sendEmail, isPending } = useMutation({
        mutationFn: (data: FormValues) => contactService.sendEmail(data),
        onSuccess: ({message}) => {
            toast.success(message || "Message sent successfully! We'll get back to you within 2 business hours.");
            reset();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to send message. Please try again later.");
        },
    });

    const onSubmit = (data: FormValues) => {
        sendEmail(data);
    }

    return (
        <div id="contact-form" className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200">
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Email Us</p>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Send Us a Message</h4>
                <p className="text-sm sm:text-base text-slate-600">
                    Prefer email? Send us a quick message and we'll route it to the right team.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
            >
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700 block mb-2">
                            Your Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Your full name"
                            {...register("name", { required: true })}
                            className="w-full h-10 sm:h-11 text-sm sm:text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 block mb-2">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register("email", { required: true })}
                                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <Label htmlFor="subject" className="text-sm font-medium text-slate-700 block mb-2">
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Subject"
                                {...register("subject")}
                                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="message" className="text-sm font-medium text-slate-700 block mb-2">
                            Message
                        </Label>
                        <Textarea
                            id="message" 
                            placeholder="Enter your message here"
                            rows={6}
                            {...register("message", { required: true })}
                            className="w-full text-sm sm:text-base resize-none"
                        />
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <Button 
                            type="submit" 
                            className="w-full sm:w-auto px-6 sm:px-8 h-10 sm:h-11 text-sm sm:text-base" 
                            disabled={isPending}
                        >
                            {isPending ? "Sending..." : "Send Message"}
                        </Button>

                        <div className="text-xs sm:text-sm text-slate-600">
                            <span className="opacity-70">We usually reply within 2 business hours.</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs sm:text-sm text-slate-600 mb-2">Or email us directly:</p>
                        <a 
                            className="text-sm sm:text-base text-primary hover:text-primary/80 hover:underline font-medium break-all" 
                            href={`mailto:${email}`}
                        >
                            {email}
                        </a>
                    </div>
                </div>
            </form>
        </div>
    )
}