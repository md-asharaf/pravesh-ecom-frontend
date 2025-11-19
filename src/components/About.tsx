import { Link } from "react-router-dom";

const About = () => {
  const companyName = "Pravesh Hardware";

  const productSpecialization = [
    {
      category: "Cement & Concrete",
      description: `The essential binding agents for superior strength and long-term durability in all foundational work.
We supply various grades of Portland cement, specialized concrete mixes, and additives for robust slabs, footings, and load-bearing structures.`,
      visual:
        "https://plus.unsplash.com/premium_photo-1661963687013-36b88a78062e?q=80&w=1470&auto=format&fit=crop",
    },
    {
      category: "Steel Reinforcement Rods (Rebars)",
      description: `Crucial for adding tensile strength to concrete and preventing cracking.
We stock high-yield, corrosion-resistant rebar in all major sizes, ensuring stability for beams, columns, and foundations.`,
      visual: "https://cdn.pixabay.com/photo/2014/10/05/08/11/iron-rods-474792_1280.jpg",
    },
    {
      category: "Paints & Finishes",
      description: `Not just aesthetics — durable coatings, primers, and weather-resistant paints that protect while elevating exterior and interior appeal.`,
      visual:
        "https://www.bhg.com/thmb/eOoKuE3HJYQaXB5bfeomxNGRz_E=/750x0/filters:no_upscale():format(webp)/BHG-types-of-paint-finishes-and-surfaces-5651272-01.webp",
    },
    {
      category: "General Construction Materials",
      description: `Essential secondary materials like aggregates, bricks, blocks, and tiling materials — every foundational accessory for a complete construction pipeline.`,
      visual: "https://cdn.pixabay.com/photo/2016/11/29/13/46/rocks-1869970_1280.jpg",
    },
  ];

  const whyChooseUs = [
    {
      point: "Top-Grade Quality",
      detail:
        "We partner only with verified manufacturers following strict quality standards.",
      icon: "/icons/quality.png",
    },
    {
      point: "Fast & Reliable Delivery",
      detail: "Order anytime, get assured doorstep delivery within committed timelines.",
      icon: "/icons/convenience.png",
    },
    {
      point: "Best Prices Guaranteed",
      detail: "Because of our optimized supply chains, we give you the best rates openly and transparently.",
      icon: "/icons/price.png",
    },
    {
      point: "Expert Assistance",
      detail:
        "Our specialists help you choose the right materials for your exact project requirements.",
      icon: "/icons/support.png",
    },
  ];

  return (
    <div className="text-slate-900 bg-white">
      <section className="mx-auto max-w-6xl px-4 md:py-20 py-12 space-y-16">
        <header className="space-y-10 border-b border-slate-300 pb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mission</p>

              <h1 className="text-4xl md:text-5xl font-bold leading-snug text-slate-900">
                Building India’s Future, One Material at a Time
              </h1>

              <p className="text-base text-slate-600 leading-relaxed">
                At Pravesh Hardware, we provide reliable, high-quality construction materials
                delivered straight to your site — supporting builders, contractors, and
                households with trusted products.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <img
                src="https://img.freepik.com/premium-vector/white-logo-construction-project-called-construction_856308-794.jpg"
                className="h-16 w-16 rounded-full border shadow-sm object-cover"
                alt="logo"
              />
              <span className="text-xl font-semibold tracking-wide text-primary uppercase">
                {companyName}
              </span>
            </div>
          </div>
        </header>

        <section className="space-y-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">What We Deliver</p>
            <h2 className="text-3xl font-semibold">Materials for Every Construction Phase</h2>
            <p className="text-slate-500">Reliable. Durable. Trusted by professionals.</p>
          </div>

          <div className="divide-y divide-slate-200/70">
            {productSpecialization.map((item, index) => (
              <article
                key={item.category}
                className="flex flex-col md:flex-row items-start gap-8 py-10"
              >
                {/* Number */}
                <div className="w-20 shrink-0 space-y-1">
                  <p className="text-[11px] tracking-[0.25em] text-slate-400 uppercase">Focus</p>
                  <p className="text-lg font-semibold">{`0${index + 1}`}</p>
                </div>

                {/* Image */}
                <div className="w-full md:w-60 h-40 overflow-hidden rounded-lg shadow-sm bg-slate-100">
                  <img
                    src={item.visual}
                    alt={item.category}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* text */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold">{item.category}</h3>
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-12 border-t border-slate-200 pt-14">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Why Choose Us</p>
            <h2 className="text-3xl font-semibold">Trusted by Contractors & Home Builders</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              We stand for reliability, quality, and customer-first service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {whyChooseUs.map((item) => (
              <div
                key={item.point}
                className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.icon}
                    alt={item.point}
                    className="h-10 w-10 rounded-full border bg-white p-2"
                  />
                  <p className="text-lg font-semibold">{item.point}</p>
                </div>

                <p className="mt-3 text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-3xl p-10 mt-8 shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <h2 className="text-3xl font-bold text-slate-900">
                Let’s Build Something Strong Together.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {companyName} is dedicated to making material procurement simple,
                transparent, and dependable.
              </p>
            </div>

            <Link
              to="/products"
              className="self-start md:self-center text-sm font-semibold text-primary underline hover:text-primary/80"
            >
              Shop Materials →
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
};

export default About;
