import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">
              Eston Distributors
            </h3>
            <p className="text-neutral-300 mb-4">
              Your trusted partner for petroleum products and transport services across the region.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/transport" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Transport Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>Petrol/Gasoline</li>
              <li>Super Petrol</li>
              <li>Diesel</li>
              <li>Kerosene</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-neutral-300">
                <Phone size={18} className="text-primary-400" />
                <span>+254 722 943 291</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <Mail size={18} className="text-primary-400" />
                <span>estonkd@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <MapPin size={18} className="text-primary-400 mt-1" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-8 pt-6 text-center text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Eston Distributors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}