"use client";

import { motion } from "framer-motion";

const collageImages = [
  { 
    id: 1, 
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    delay: 0,
    size: "w-32 h-48 md:w-40 md:h-56"
  },
  { 
    id: 2, 
    gradient: "from-amber-500 via-orange-500 to-red-500",
    delay: 0.1,
    size: "w-36 h-52 md:w-44 md:h-64"
  },
  { 
    id: 3, 
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    delay: 0.2,
    size: "w-28 h-40 md:w-36 md:h-48"
  },
];

export default function ImageCollage() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* Main collage container */}
      <div className="relative">
        {collageImages.map((img, index) => (
          <motion.div
            key={img.id}
            className={`absolute ${img.size} rounded-lg overflow-hidden`}
            style={{
              left: `${index * 60 - 60}px`,
              top: `${(index % 2 === 0 ? -20 : 40) + index * 20}px`,
              zIndex: 3 - index,
            }}
            initial={{ 
              opacity: 0, 
              y: 100,
              rotateZ: (index - 1) * 5
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              rotateZ: (index - 1) * 3
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.8 + img.delay,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ 
              scale: 1.05, 
              rotateZ: 0,
              zIndex: 10,
              transition: { duration: 0.3 }
            }}
          >
            {/* Gradient placeholder */}
            <div className={`w-full h-full bg-gradient-to-br ${img.gradient}`}>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: "100%" }}
                transition={{ 
                  duration: 1.5, 
                  delay: 1.5 + img.delay,
                  ease: "easeInOut"
                }}
              />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-end p-4">
                <div className="text-white/80 text-xs font-medium">
                  Project {img.id}
                </div>
              </div>
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-lg border border-white/10" />
          </motion.div>
        ))}

        {/* Floating decorative elements */}
        <motion.div
          className="absolute -right-8 top-0 w-16 h-32 flex flex-col justify-center items-center gap-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4 + i * 0.05, duration: 0.3 }}
            >
              <motion.div
                className="h-full bg-white/30 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.random() * 60 + 20}%` }}
                transition={{ delay: 1.6 + i * 0.05, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Vertical text decoration */}
        <motion.div
          className="absolute -left-12 top-1/2 -translate-y-1/2 text-white/20 text-sm tracking-[0.3em] font-light"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          PROJECTS
        </motion.div>
      </div>
    </motion.div>
  );
}


