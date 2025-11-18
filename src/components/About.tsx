import { Link } from "react-router-dom";

const About = () => {
    const companyName = "Pravesh Hardware";

    const productSpecialization = [
        {
            category: "Cement & Concrete",
            description: `The essential binding agents for superior strength and long-term durability in all foundational work.
We supply various grades of Portland cement, specialized concrete mixes, and related additives necessary for robust slabs, footings, and load-bearing structures, ensuring your project stands the test of time.`,
            visual: "https://plus.unsplash.com/premium_photo-1661963687013-36b88a78062e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            category: "Steel Reinforcement Rods (Rebars)",
            description: `Crucial for adding tensile strength to concrete structures and preventing cracking.
Our inventory includes high-yield, corrosion-resistant steel rebar in various diameters and lengths, ensuring the structural integrity and resilience of columns, beams, and sheer walls across commercial and residential builds`,
            visual: "https://cdn.pixabay.com/photo/2014/10/05/08/11/iron-rods-474792_1280.jpg",
        },
        {
            category: "Paints & Finishes",
            description: `More than just aesthetics—our range includes protective coatings, primers, and durable interior/exterior paints.
These products are formulated to withstand harsh weather, resist wear, and provide long-lasting, vibrant finishes, protecting your investment while enhancing curb appeal.`,
            visual: "https://www.bhg.com/thmb/eOoKuE3HJYQaXB5bfeomxNGRz_E=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/BHG-types-of-paint-finishes-and-surfaces-5651272-01-70310_6oE6Ox3DKGPASpXpULik4v-c4b401824dd34508b78295fd626248a7.jpg",
        },
        {
            category: "General Materials",
            description: `A comprehensive foundation of secondary yet essential materials, including high-grade aggregates (sand, gravel), foundational bricks, blocks, and tiling materials.
We ensure every accessory and minor component is readily available to support the completeness and quality of your entire construction lifecycle`,
            visual: "https://cdn.pixabay.com/photo/2016/11/29/13/46/rocks-1869970_1280.jpg",
        },
    ];

    const whyChooseUs = [
        {
            point: "Quality Assurance",
            detail: "We source exclusively from reputable manufacturers who uphold strict quality benchmarks.",
            icons: "/icons/quality.png",
        },
        {
            point: "Convenience & Speed",
            detail: "Order 24/7 through our platform and receive reliable doorstep delivery.",
            icons: "/icons/convenience.png",
        },
        {
            point: "Competitive Pricing",
            detail: "Streamlined supply chains keep pricing transparent and budget friendly.",
            icons: "/icons/price.png",
        },
        {
            point: "Expert Support",
            detail: "Seasoned specialists guide you toward the right materials every time.",
            icons: "/icons/support.png",
        },
    ];

    return (
        <div className=" text-slate-900" style={{ fontFamily: "Inter, sans-serif" }}>
            <section className="mx-auto max-w-6xl px-4 md:py-20 py-10 space-y-16">
                <header className="space-y-6 border-b border-black pb-12">
                    <div className="text-xl uppercase tracking-[0.3em] text-black">About</div>
                    <div className="space-y-4 md:flex md:items-end md:justify-between md:space-y-0">
                        <div className="max-w-3xl space-y-3">
                            <p className="text-sm text-slate-400">Mission Statement</p>
                            <h1 className="text-[32px] font-semibold leading-tight">About Us: Building Your Vision</h1>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                We are your trusted partner in construction. We've made it our mission to provide high-quality, reliable,
                                and essential building supplies directly to your job site, hassle-free.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://img.freepik.com/premium-vector/white-logo-construction-project-called-construction_856308-794.jpg?semt=ais_hybrid&w=740&q=80"
                                alt="Pravesh Hardware team"
                                className="h-16 w-16 rounded-full object-cover border border-slate-200 shadow-sm"
                                loading="lazy"
                            />
                            <span className="text-xl py-6 uppercase tracking-[0.3em] text-blue-600 font-semibold">
                                {companyName}
                            </span>
                        </div>
                    </div>
                </header>

                <section className="space-y-10">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Materials</p>
                        <h2 className="text-xl font-semibold">What We Deliver</h2>
                        <p className="text-sm text-slate-500">Reliable materials for every stage of construction.</p>
                    </div>
                    <div className="divide-y divide-slate-300/60">
                        {productSpecialization.map((item, index) => (
                            <article
                                key={item.category}
                                className="flex flex-row flex-wrap items-center gap-6 py-6 md:py-10 sm:flex-nowrap md:gap-10"
                            >
                                <div className="w-24 shrink-0 space-y-2 text-left md:w-32">
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Focus</p>
                                    <p className="text-sm font-medium text-slate-900">{`0${index + 1}`}</p>
                                </div>

                                <div className="w-60 sm:w-52 md:w-60">
                                    <div className="h-32 w-full overflow-hidden rounded-md bg-slate-100 sm:h-36 md:h-40">
                                        <img
                                            src={item.visual}
                                            alt={item.category}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-[220px] space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold sm:text-xl">{item.category}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="space-y-8 border-t border-slate-200/70 pt-12">
                    <div className="space-y-2 border-b border-t border-black py-3 flex items-center flex-col justify-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Why Choose Us</p>
                        <h2 className="text-xl font-semibold">Built on trust, efficiency, and expertise.</h2>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {whyChooseUs.map((item) => (
                            <div
                                key={item.point}
                                className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.icons}
                                        alt={item.point}
                                        className="h-9 w-9 rounded-full border border-slate-200 object-contain bg-white p-1.5"
                                        loading="lazy"
                                    />
                                    <p className="text-sm font-medium text-slate-900">{item.point}</p>
                                </div>
                                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                                <div className="mt-4 h-px w-full bg-slate-300/80" />
                            </div>
                        ))}
                    </div>
                </section>



                <section className="border-t border-black pt-12">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold">Let's Build Together.</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {companyName} is committed to making the material procurement process simple, transparent, and efficient so you
                                can focus on building the future.
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="self-start text-sm font-medium text-blue-600 transition hover:text-blue-800 md:self-end"
                        >
                            Shop Materials Now →
                        </Link>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default About;