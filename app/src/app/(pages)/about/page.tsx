"use client";

import { Button } from "@/client/common/components/ui/button";
import { CheckCircle2, Lock, ShieldCheck, Menu, X, Phone, User2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "backdrop-blur bg-white/0 py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-main to-main-dark">
                  TrustVote
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#stats">Statistics</NavLink>
              <NavLink href="/about">About</NavLink>
              <Button
                className="bg-main hover:bg-main-dark"
                asChild
              >
                <a href="/auth/register">Get Started</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-main" /> : <Menu className="h-6 w-6 text-main" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full backdrop-blur bg-white/80 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <NavLink
                  href="#features"
                  mobile
                >
                  Features
                </NavLink>
                <NavLink
                  href="#stats"
                  mobile
                >
                  Statistics
                </NavLink>
                <NavLink
                  href="/about"
                  mobile
                >
                  About
                </NavLink>
                <Button
                  className="bg-main hover:bg-main-dark"
                  asChild
                >
                  <a href="/auth/register">Get Started</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-main-light">
        <div className="absolute inset-0 overflow-visible">
          <div className="absolute w-32 h-32 bg-main rounded-full opacity-70 blur-3xl animate-[bounce1_8s_linear_infinite]"></div>
          <div className="absolute w-32 h-32 bg-main rounded-full opacity-70 blur-3xl animate-[bounce2_10s_linear_infinite]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-5xl pb-1 sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-main to-main-dark mb-8">
              About Us
            </h1>
            <p className="max-w-2xl mx-auto text-3xl text-text-light mb-10">
              TrustVote is a decentralized voting platform that allows users to vote on proposals and decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 relative overflow-hidden bg-gradient-to-b from-main-light to-main-light/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-main to-main-dark mb-6">
              Team
            </h2>
            <p className="text-text-light text-xl max-w-3xl mx-auto">
              Meet the team behind TrustVote
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              {
                icon: User2,
                title: "Yusuf Ahmed",
                description:
                  "Founding Developer",
              },
              {
                icon: User2,
                title: "Abu Hamza",
                description:
                  "Operations and management",
              },
              {
                icon: User2,
                title: "Umar Razzaqui",
                description:
                  "Documentation",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-3xl p-10 text-center bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg border-2 border-white/60 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex justify-center mb-8">
                  <div className="bg-gradient-to-r from-main to-main-dark p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-text-dark mb-6">{feature.title}</h3>
                <p className="text-text-light text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-main-light/30 to-main-light">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-90"></div>
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83L25.172 0h-2.83zM32 0l-1.414 1.414 3.657 3.657-1.414 1.414-3.657-3.657L27.757 4.242 26.343 2.828 29.172 0h2.828zm-6.717 0l-3.657 3.657 1.414 1.414L26.343 1.77 27.757 3.182l-1.414 1.415L22.343 0h2.94z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E')] opacity-10"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold text-text mb-8">Contact Us</h2>
          <p className="text-xl text-text-light mb-12 max-w-2xl mx-auto">
            We'd love to hear from you!
          </p>
          <div className="flex flex-col gap-8 items-center">
            <p className="text-2xl text-text-dark font-semibold hover:text-main transition-colors flex items-center gap-3">
              <span className="bg-gradient-to-r from-main to-main-dark p-2 rounded-lg text-white">
                <Phone className="w-6 h-6" />
              </span>
              +91 9067751841
            </p>
            <p className="text-2xl text-text-dark font-semibold hover:text-main transition-colors flex items-center gap-3">
              <span className="bg-gradient-to-r from-main to-main-dark p-2 rounded-lg text-whtie">
                ✉️
              </span>
              yusufahmed195@gmail.com
            </p>
          </div>
        </div>
      </section>


      <footer className="bg-main-light py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-light">
            &copy; {new Date().getFullYear()} TrustVote. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function NavLink({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <a
      href={href}
      className={`text-text hover:text-main transition-colors ${mobile ? "block py-2" : ""}`}
    >
      {children}
    </a>
  );
}
