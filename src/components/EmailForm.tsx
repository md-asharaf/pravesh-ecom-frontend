import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type FormValues = {
    name: string
    email: string
    subject?: string
    message: string
}

export default function EmailForm() {
    const { register, handleSubmit, reset } = useForm<FormValues>()
    const [notice, setNotice] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        try {
            console.log("EmailForm submit:", data)
            await new Promise((r) => setTimeout(r, 600))
            setNotice("Thanks — we received your message and will reply within 2 business hours.")
            reset()
        } catch (err) {
            setNotice("Something went wrong. Please try again later.")
            console.error("EmailForm error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="contact-form" className="mt-8 pt-6 border-t border-gray-400">
            <h4 className="text-lg font-semibold mb-3">Email Us</h4>
            <p className="text-sm text-muted-foreground mb-4">
                Prefer email? Send us a quick message and we'll route it to the right team.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
            >
                {/* inputs (left) */}
                <div className="md:col-span-2 space-y-3">
                    <div>
                        <Label htmlFor="name" className="text-xs text-primary block mb-1">
                            Your Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Your full name"
                            {...register("name", { required: true })}
                            className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm bg-white focus:border-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email" className="text-xs text-primary block mb-1">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register("email", { required: true })}
                                className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm focus:border-none"
                            />
                        </div>

                        <div>
                            <Label htmlFor="subject" className="text-xs text-primary block mb-1">
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                placeholder="subject"
                                {...register("subject")}
                                className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm bg-white focus:border-none"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="message" className="text-xs text-primary block mb-1">
                            Message
                        </Label>
                        <Textarea

                            id="message" placeholder="Enter your message here "
                            rows={5}
                            {...register("message", { required: true })}
                            className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm bg-white focus:border-none"
                        />
                    </div>
                </div>

                {/* actions / meta (right) */}
                <div className="md:col-span-1 flex flex-col items-start md:items-end gap-3">
                    <div className="w-full md:w-auto items-end flex flex-col">
                        <Button type="submit" className="inline-flex items-center justify-center px-4 py-2 text-sm" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground mt-1 md:text-right">
                        {notice ?? <span className="opacity-70">We usually reply within 2 business hours.</span>}
                    </div>

                    <div className="text-xs text-muted-foreground mt-2 text-left md:text-right">
                        Or email us directly:
                        <div className="mt-1">
                            <a className="text-sm text-primary hover:underline" href="mailto:support@praveshmart.com">
                                support@praveshmart.com
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}