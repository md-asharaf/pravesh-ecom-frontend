import EmailForm from "./EmailForm"
import SocialMediaHandle from "./SocialMediaHandle"

const LOCATION_ADDRESS = [
    "Plot 21, Industrial Estate Road",
    "Mumbai, India",

]

export default function Contact() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold">Get In Touch: How Can We Help You Build?</h1>
                <p className="mt-3 text-md text-muted-foreground max-w-2xl">
                    We are committed to making your material sourcing experience as seamless as possible. Whether you have a question about a product, need a large-volume quote, or require support for an existing order, we're here to help.
                </p>
            </header>

            <div className="space-y-6">
                {/* Visit Our Hardware Hub */}
                <article className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-t border-black items-start">
                    <div className="col-span-1 flex-shrink-0 w-full lg:w-auto text-left">
                        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Location</div>

                        <div className="text-lg font-medium">Pravesh Hardware Showroom</div>

                        <address className="not-italic mt-2 text-sm text-muted-foreground">
                            {LOCATION_ADDRESS.map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </address>

                        <div className="mt-2 text-xs text-muted-foreground">Hours: Mon–Sat · 7:00 AM – 7:00 PM</div>
                        <div className="mt-2 text-xs text-muted-foreground">Phone: +91 98765 43210</div>
                        <div className="mt-2 text-xs text-muted-foreground">Email: support@praveshmart.com</div>
                    </div>

                    <div className="col-span-1 flex-shrink-0">
                        <div className="h-40 w-40 sm:w-60 rounded-md border border-gray-200/40 bg-gray-50 flex items-center justify-center text-xs text-muted-foreground">
                            Image placeholder
                        </div>
                    </div>

                    <div className="col-span-2 lg:col-span-1 flex-1 min-w-0">
                        <h3 className="text-xl font-semibold">Visit Our Hardware Hub</h3>
                        <p className="mt-2 text-md text-muted-foreground">
                            Walk in to see stocked inventory, confirm specs, and meet the specialists behind every order.
                        </p>

                        <div className="mt-4 flex items-end justify-between">

                            <a href="https://www.google.com/maps" className="text-sm text-primary transition-transform duration-200  inline-flex items-center gap-2 hover:underline font-bold"
                                target="_blank" rel="noopener noreferrer"
                            >Visit now→</a>
                        </div>
                    </div>
                </article>

            </div>

            <EmailForm />

            {/* Social media */}
            <SocialMediaHandle />
            {/* FAQ snippet */}
            <footer className="mt-10 pt-6 border-t border-gray-200/50">
                <h4 className="text-lg font-semibold">Frequently Asked Questions</h4>
                <p className="mt-2 text-sm text-muted-foreground">Before contacting us, you may find your answer instantly in our FAQ:</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>What are your delivery timelines? (Link to FAQ page)</li>
                    <li>How do I request a tax-exempt status? (Link to Account/FAQ page)</li>
                    <li>What is your return policy for bulk items? (Link to Policy page)</li>
                </ul>
            </footer>
        </section>
    )
}