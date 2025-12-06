import EmailForm from "../../components/EmailForm"
import SocialMediaHandle from "../../components/SocialMediaHandle"
import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { useAppSelector } from "@/store/hooks"

export default function Contact() {
  const settings = useAppSelector((s) => s.settings.settings);
  
  const businessName = settings?.businessName || "Pravesh Hardware";
  const email = settings?.email || "support@praveshmart.com";
  const phone = settings?.phone || "+91 98765 43210";
  const address = settings?.address || "Plot 21, Industrial Estate Road\nMumbai, India";
  
  const addressLines = address 
    ? address.split('\n').filter(line => line.trim())
    : ["Plot 21, Industrial Estate Road", "Mumbai, India"];
  
  const displayAddressLines = addressLines.length > 0 
    ? addressLines 
    : ["Plot 21, Industrial Estate Road", "Mumbai, India"];
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
        {/* Header */}
        <header className="space-y-3 sm:space-y-4 md:space-y-6 border-b border-slate-200 pb-6 sm:pb-8 md:pb-12">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center w-full mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-snug text-slate-900">
              How Can We Help You Build?
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-4xl text-center w-full mx-auto px-4">
              We are committed to making your material sourcing experience as seamless as possible. Whether you have a question about a product, need a large-volume quote, or require support for an existing order, we're here to help.
            </p>
          </div>
        </header>

        {/* Visit Our Hardware Hub */}
        <article className="grid md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-12">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-500 mb-3 sm:mb-4">Location</p>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900 mb-3 sm:mb-4">
                {businessName} Showroom
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 sm:mb-6">
                Walk in to see stocked inventory, confirm specs, and meet the specialists behind every order.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5" />
                <address className="not-italic text-sm sm:text-base text-slate-600 leading-relaxed">
                  {displayAddressLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </address>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base text-slate-600">
                  <p className="font-medium mb-0.5">Business Hours</p>
                  <p>{settings?.workingHours || "Mon–Sat · 7:00 AM – 7:00 PM"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base text-slate-600">
                  <p className="font-medium mb-0.5">Phone</p>
                  {phone ? (
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors break-all">
                      {phone}
                    </a>
                  ) : (
                    <span>+91 98765 43210</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base text-slate-600">
                  <p className="font-medium mb-0.5">Email</p>
                  {email ? (
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors break-all">
                      {email}
                    </a>
                  ) : (
                    <span>support@praveshmart.com</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-1 sm:pt-2">
              <a 
                href="https://maps.app.goo.gl/Jzcj4cTBrhCyPM3Q9" 
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visit on Google Maps →
              </a>
            </div>
          </div>

          <div className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] rounded-lg sm:rounded-xl overflow-hidden shadow-md border border-slate-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14972.712311746767!2d84.95959226748488!3d20.251448049365123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a187fdbf49314bf%3A0x3767ebe7c3ad5b07!2sNuagaon%2C%20Odisha%20752083!5e0!3m2!1sen!2sin!4v1765026377192!5m2!1sen!2sin" 
              className="w-full h-full border-0" 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title={`${businessName} Location`}
            />
          </div>
        </article>

        <EmailForm />

        <SocialMediaHandle />
      </section>
    </div>
  )
}