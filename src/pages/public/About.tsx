import { Link } from "react-router-dom";
import { Users, Award, Building2, Package, Paintbrush, Layers, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

const About = () => {
  const settings = useAppSelector((s) => s.settings.settings);

  // Fallback data
  const companyName = settings?.businessName || "Pravesh Tread Industries Pvt Ltd";
  const aboutTitle = settings?.aboutTitle || "Building India's Future, One Material at a Time";
  const aboutDescription = settings?.aboutDescription || "Pravesh Tread Industries Pvt Ltd has been a cornerstone in the building materials industry, providing quality products that lay the foundation for countless structures across the region.\n\nOur commitment to excellence is reflected in our diverse product range, catering to both wholesale and retail markets. With years of expertise and a reputation for reliability, we have built a legacy of trust.";
  const whyChooseUs = settings?.whyChooseUs || "We offer a broad selection of products tailored to the specific needs of our customers. We source our products from reputable manufacturers and ensure consistent quality. Our strength lies in our ability to provide a wide range of building materials under one roof, backed by exceptional customer service.";

  const logo = settings?.logo || "https://img.freepik.com/premium-vector/white-logo-construction-project-called-construction_856308-794.jpg";

  const productSpecialization = [
    {
      category: "TMT Bars",
      description: `Our TMT bars ensure durability and strength in every build. We offer a wide range of TMT bars from top brands like Moira, Jindal, BS Thermax, and more, known for their high tensile strength and corrosion resistance.`,
      visual: "https://zhuzoor.com/wp-content/uploads/2025/01/wholesale-TMT-Bars-suppliers-India-.jpg",
      icon: Layers,
    },
    {
      category: "Pipes (MS, GI, GP)",
      description: `Our range of pipes includes MS (Mild Steel), GI (Galvanized Iron), and GP (Galvanized Plain) pipes. These pipes are perfect for plumbing, structural, and industrial applications. These pipes are durable, resistant to corrosion, and come in various sizes and thicknesses.`,
      visual: "https://images.jdmagicbox.com/quickquotes/images_main/gp-ms-pipes-and-tubes-375183878-u849d.jpg",
      icon: Package,
    },
    {
      category: "Bright Bars",
      description: `Bright bars are used in various engineering components, construction, and manufacturing. Our bright bars are known for their precision and smooth surface finish, making them ideal for applications requiring high dimensional accuracy.`,
      visual: "https://www.venuswires.com/images/blog/everything-you-need-to-know-about-bright-bars.png",
      icon: Gauge,
    },
    {
      category: "Steel Angles & Flats",
      description: `Our steel angles and flats provide the backbone for various structural applications. Available in a range of sizes, they are suitable for both heavy-duty and light-weight constructions.`,
      visual: "https://southaustinmetals.com/wp-content/uploads/2021/12/assorted-steel-1024x576.jpg",
      icon: Building2,
    },
    {
      category: "Cement",
      description: `We offer premium quality cement from top brands like MP Birla ensuring strong, durable builds. Whether for residential or industrial use, our cement provides consistent performance.`,
      visual: "https://media.istockphoto.com/id/1133989173/photo/sand-destined-to-the-manufacture-of-cement-in-a-quarry.jpg?s=612x612&w=0&k=20&c=kbLMm9vuxoYfzIsBiu-_TyZ52EX7C3OSm_YdhZ5heM0=",
      icon: Building2,
    },
    {
      category: "Paints and Hardware",
      description: `Our selection of paints and hardware includes everything needed to finish a project, from high-quality Berger paints to essential hardware like nails, screws, and welding rods.`,
      visual: "https://c8.alamy.com/comp/2BBYTE2/wall-and-ceiling-paint-hardware-store-bavaria-germany-2BBYTE2.jpg",
      icon: Paintbrush,
    },
    {
      category: "Steel Channels & Beams",
      description: `Steel channels and beams are critical for constructing strong frameworks. Our selection includes various sizes to meet your specific construction needs.`,
      visual: "https://cloudfrontgharpediabucket.gharpedia.com/uploads/2023/08/Steel-Sections-01-0311040001.jpg",
      icon: Building2,
    },
    {
      category: "Roofing Sheets",
      description: `We provide a variety of roofing options, including PPGL, GC, and cement sheets, suitable for residential, commercial, and industrial applications. These sheets are durable and designed to withstand harsh weather conditions.`,
      visual: "https://cpimg.tistatic.com/10071956/b/4/PPGI-Corrugated-Sheet..jpg",
      icon: Building2,
    },
  ];

  const stats = [
    { label: "Years of Experience", value: settings?.yearsOfExperience || "15+", icon: Award },
    { label: "Happy Customers", value: settings?.happyCustomers || "10K+", icon: Users },
    { label: "Products Available", value: settings?.productsAvailable || "500+", icon: Package },
    { label: "Cities Served", value: settings?.citiesServed || "50+", icon: Building2 },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-400 font-medium">
                  About {companyName}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900">
                  {aboutTitle.includes("One Material") ? (
                    <>
                      Building India's Future,{" "}
                      <span className="text-primary">One Material at a Time</span>
                    </>
                  ) : (
                    aboutTitle
                  )}
                </h1>
                {aboutDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <Button asChild size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8">
                  <Link to="/products">Explore Products</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl mt-6 lg:mt-0">
              <img
                src={logo}
                className="w-full h-full object-cover aspect-square"
                alt={companyName}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="p-2.5 sm:p-3 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 space-y-8 sm:space-y-12 md:space-y-16">


        {/* Product Specialization Section */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-3 max-w-3xl mx-auto px-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-400 font-medium">
              What We Deliver
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
              Materials for Every Construction Phase
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Reliable. Durable. Trusted by professionals.
            </p>
          </div>

          {/* Medium Square Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {productSpecialization.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.category}
                  className="group overflow-hidden border-slate-200 hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.visual}
                      alt={item.category}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-900">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                      {item.category}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="space-y-6 sm:space-y-8 md:space-y-12 border-t border-slate-200 pt-8 sm:pt-12 md:pt-16">
          <div className="text-center space-y-2 sm:space-y-3 max-w-3xl mx-auto px-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-400 font-medium">
              Why Choose Us
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
              Trusted by Contractors & Home Builders
            </h2>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            <Card className="border-slate-200">
              <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 md:gap-6">
                  <div className="inline-flex p-2.5 sm:p-3 md:p-4 rounded-xl bg-primary/10 flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                      Why Choose Us?
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
                      {whyChooseUs}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 mt-6 sm:mt-8 md:mt-12 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
                Let's Build Something Strong Together
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {companyName} is dedicated to making material procurement simple,
                transparent, and dependable. Start your project with quality materials today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-0">
              <Button asChild size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8">
                <Link to="/products">Shop Materials</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8">
                <Link to="/contact">Get Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default About;
