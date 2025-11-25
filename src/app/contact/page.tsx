"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "Twitter / X",
    handle: "@bandtco",
    href: "https://twitter.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    handle: "@bandtco",
    href: "https://github.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    handle: "B&T",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white/40 text-sm tracking-widest uppercase mb-4 block">
              Contact
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Let&apos;s build<br />
              <span className="text-white/40">something together.</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-white/60 text-xl max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have a project in mind? We&apos;d love to hear about it. 
            Drop us a message and let&apos;s start your next side quest.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-8">Send a message</h2>

            {isSubmitted ? (
              <motion.div
                className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-white/60 mb-6">
                  Thanks for reaching out. We&apos;ll get back to you soon.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 min-h-[150px] resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-white text-black hover:bg-white/90 font-medium text-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-8">Connect with us</h2>

            {/* Email */}
            <div className="mb-12">
              <span className="text-white/40 text-sm block mb-2">Email</span>
              <a
                href="mailto:hello@bandtco.com"
                className="text-2xl font-medium hover:text-white/80 transition-colors"
              >
                hello@bandtco.com
              </a>
            </div>

            {/* Social Links */}
            <div className="mb-12">
              <span className="text-white/40 text-sm block mb-4">Socials</span>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-white/60 group-hover:text-white transition-colors">
                      {link.icon}
                    </span>
                    <div className="flex-1">
                      <span className="block font-medium">{link.name}</span>
                      <span className="text-white/40 text-sm">{link.handle}</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-white/30 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white/60">Typical response time</span>
              </div>
              <span className="text-2xl font-bold">Within 24 hours</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              B&T
            </span>
            <span className="text-white/30">®</span>
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} B&T. Two cousins, infinite side quests.
          </p>
        </div>
      </footer>
    </main>
  );
}

