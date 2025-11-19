import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-hero text-white pt-14 pb-8">
      <div className="container mx-auto px-4">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* COMPANY */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pravesh Hardware</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Quality construction materials delivered to your project site.
              Trusted by builders, contractors and homeowners.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-5">
              <a href="#" className="hover:text-yellow-300 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/products" className="hover:text-yellow-300">Products</Link></li>
              <li><Link to="/brands" className="hover:text-yellow-300">Brands</Link></li>
              <li><Link to="/categories" className="hover:text-yellow-300">Categories</Link></li>
              <li><Link to="/about" className="hover:text-yellow-300">About Us</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="text-base font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/contact" className="hover:text-yellow-300">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-yellow-300">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-yellow-300">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-yellow-300">FAQ</Link></li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-base font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Email: support@praveshmart.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 pt-8 border-t border-white/20 text-center">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Pravesh Hardware. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
