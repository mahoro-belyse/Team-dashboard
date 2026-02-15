import React, { useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Here you can add your subscription logic (API call)
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Brand / Description */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-bold text-lg text-foreground mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                TC
              </div>
              TeamCollab
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional team collaboration platform for modern enterprises.
              Streamline workflow, communicate efficiently, and keep your team
              aligned.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex flex-col text-sm text-muted-foreground">
              <span className="mb-2 font-semibold text-foreground">
                Contact
              </span>
              <a
                href="mailto:info@teamcollab.com"
                className="hover:text-foreground transition-colors mb-1"
              >
                info@teamcollab.com
              </a>
              <a
                href="tel:+1234567890"
                className="hover:text-foreground transition-colors"
              >
                +25787488939
              </a>
            </div>

            <div className="flex gap-3 mt-4 sm:mt-0">
              {[
                { icon: Facebook, link: "https://facebook.com" },
                { icon: Twitter, link: "https://twitter.com" },
                { icon: Linkedin, link: "https://linkedin.com" },
                { icon: Instagram, link: "https://instagram.com" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/10 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5 rounded-lg p-6">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Mail className="w-5 h-5" />
            <span>Subscribe to our newsletter</span>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full sm:w-auto gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-4 py-2 rounded-lg border border-border text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TeamCollab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
