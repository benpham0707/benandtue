"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const categories = ["All", "Web", "Mobile", "Brand", "Other"];

const projects = [
  {
    id: 1,
    title: "Project Alpha",
    category: "Web",
    description: "A futuristic web application",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    size: "large",
  },
  {
    id: 2,
    title: "Project Beta",
    category: "Mobile",
    description: "Cross-platform mobile experience",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    size: "medium",
  },
  {
    id: 3,
    title: "Project Gamma",
    category: "Brand",
    description: "Brand identity system",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    size: "medium",
  },
  {
    id: 4,
    title: "Project Delta",
    category: "Web",
    description: "E-commerce platform",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    size: "small",
  },
  {
    id: 5,
    title: "Project Epsilon",
    category: "Other",
    description: "Experimental project",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    size: "small",
  },
  {
    id: 6,
    title: "Project Zeta",
    category: "Mobile",
    description: "iOS native application",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    size: "large",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Gallery
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            A collection of our side quests, experiments, and shipped products.
            Each project tells a story.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-2 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-12 pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className={`relative group cursor-pointer ${
                project.size === "large" ? "md:col-span-2 md:row-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              layout
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl ${
                  project.size === "large" ? "aspect-square" : "aspect-[4/3]"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 group-hover:scale-110`}
                />

                {/* Mesh Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
                    `,
                  }}
                />

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="text-white/60 text-sm mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: hoveredProject === project.id ? 0 : 20,
                      opacity: hoveredProject === project.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.category}
                  </motion.span>
                  <motion.h3
                    className="text-white text-2xl font-bold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: hoveredProject === project.id ? 0 : 20,
                      opacity: hoveredProject === project.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p
                    className="text-white/70 text-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: hoveredProject === project.id ? 0 : 20,
                      opacity: hoveredProject === project.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* View button */}
                  <motion.div
                    className="mt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: hoveredProject === project.id ? 0 : 20,
                      opacity: hoveredProject === project.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    <span className="inline-flex items-center gap-2 text-white text-sm font-medium">
                      View Project
                      <svg
                        className="w-4 h-4"
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
                    </span>
                  </motion.div>
                </motion.div>

                {/* Corner decoration */}
                <div className="absolute top-4 right-4 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white/40 text-xs">{String(project.id).padStart(2, "0")}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="px-6 md:px-12 pb-24">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/5 to-white/10 p-12 md:p-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have a project in mind?
            </h2>
            <p className="text-white/60 mb-8">
              We&apos;re always looking for the next adventure. Let&apos;s build something amazing together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform"
            >
              Start a Conversation
              <svg
                className="w-4 h-4"
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
            </Link>
          </div>

          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 to-transparent" />
        </motion.div>
      </section>
    </main>
  );
}


