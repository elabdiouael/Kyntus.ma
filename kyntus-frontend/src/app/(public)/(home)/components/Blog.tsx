"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./blog.module.css";
import Link from "next/link";

// ========================================================
// ENGINE: LUXURY TEXT REVEAL
// ========================================================
const CyberTextReveal = ({ text, delayOffset = 0, className = "", inView }: { text: string; delayOffset?: number; className?: string; inView: boolean }) => {
  const words = text.split(" ");
  return (
    <span className={styles.cyberTextWrapper}>
      {words.map((word, i) => (
        <span key={i} className={styles.wordMask}>
          <motion.span
            className={`${styles.wordSpan} ${className}`}
            initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
            animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delayOffset + i * 0.05 }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// ========================================================
// BLOG CARD COMPONENT
// ========================================================
function BlogCard({ post, index, inView }: { post: any, index: number, inView: boolean }) {
  return (
    <motion.div 
      className={styles.blogCard}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 80, damping: 20 }}
    >
      <div className={styles.cardBorderGlow}></div>
      
      <div className={styles.imageWrapper}>
        <div className={styles.imageOverlay}></div>
        {/* URL's directine d'Tsawer High Quality */}
        <img src={post.image} alt={post.title} className={styles.postImg} />
        <div className={styles.categoryBadge}>{post.category}</div>
      </div>

      <div className={styles.postContent}>
        <span className={styles.postDate}>{post.date}</span>
        <h4 className={styles.postTitle}>{post.title}</h4>
        <p className={styles.postExcerpt}>{post.excerpt}</p>
        
        <div className={styles.readMoreBtn}>
          <span>Read Article</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIcon}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================================
// MAIN COMPONENT: BLOG / INSIGHTS
// ========================================================
export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-15%" });

  // Data m3a Tsawer (URLs)
  const blogPosts = [
    { 
      id: 1, category: "Telecom", date: "April 12, 2026", 
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
      title: "The Future of 5G Infrastructure in Europe",
      excerpt: "Exploring the next generation of connectivity and how autonomous networks are reshaping the global communication landscape."
    },
    { 
      id: 2, category: "Energy", date: "March 28, 2026", 
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
      title: "Sustainable Smart Grids: A 2026 Perspective",
      excerpt: "How renewable energy integration and AI-driven grid management are driving absolute efficiency in urban sectors."
    },
    { 
      id: 3, category: "Innovation", date: "March 15, 2026", 
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      title: "Next-Gen Data Center Cooling Architectures",
      excerpt: "Building high-availability server hubs with advanced liquid cooling and zero-emission power redundancy."
    }
  ];

  // L'Path dyal l'Berrg (ZigZag)
  const lightningPath = "M0,50 L20,80 L40,20 L60,90 L80,30 L100,80 L120,10 L140,70 L160,20 L180,90 L200,40 L220,80 L240,10 L260,90 L280,30 L300,80 L320,20 L340,90 L360,40 L380,80 L400,10 L420,90 L440,30 L460,80 L480,20 L500,90 L520,40 L540,80 L560,10 L580,90 L600,30 L620,80 L640,20 L660,90 L680,40 L700,80 L720,10 L740,90 L760,30 L780,80 L800,20 L820,90 L840,40 L860,80 L880,10 L900,90 L920,30 L940,80 L960,20 L980,90 L1000,50";

  return (
    <section className={styles.blogSection} ref={sectionRef}>
      
      {/* ========================================================= */}
      {/* L'HBAAL: DUAL PLASMA STRIKE (LTR & RTL) F LFO9 */}
      {/* ========================================================= */}
      <div className={styles.lightningContainer}>
        {/* L'Berrg LTR (Kijri mn lisser l limn) */}
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={styles.lightningSvgLTR}>
          <path d={lightningPath} className={styles.lightningGlowLTR} />
          <path d={lightningPath} className={styles.lightningCoreLTR} />
        </svg>
        {/* L'Berrg RTL (Kijri mn limn l lisser) */}
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={styles.lightningSvgRTL}>
          <path d={lightningPath} className={styles.lightningGlowRTL} />
          <path d={lightningPath} className={styles.lightningCoreRTL} />
        </svg>
      </div>

      <div className={styles.gradientBg}></div>

      {/* FLOATING IDEAS & DATA STREAMS */}
      <div className={styles.neuralNetworkContainer}>
        <div className={styles.floatingIdea1}></div>
        <div className={styles.floatingIdea2}></div>
        <div className={styles.floatingIdea3}></div>
        <div className={styles.dataStreamsWrapper}>
          <div className={styles.dataLine} style={{ left: '10%', animationDelay: '0s' }}></div>
          <div className={styles.dataLine} style={{ left: '30%', animationDelay: '2s' }}></div>
          <div className={styles.dataLine} style={{ left: '50%', animationDelay: '1s' }}></div>
          <div className={styles.dataLine} style={{ left: '70%', animationDelay: '3.5s' }}></div>
          <div className={styles.dataLine} style={{ left: '90%', animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <motion.div className={styles.badge} initial={{ opacity: 0, y: 20 }} animate={isSectionInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}>
            Insights
          </motion.div>

          <h2 className={styles.title}>
            <span className={styles.shimmerWrapper}>
              <CyberTextReveal text="Our Latest" delayOffset={0.2} className={styles.shimmerHighlight} inView={isSectionInView} />
            </span>
            <br />
            <CyberTextReveal text="Thinking." delayOffset={0.5} inView={isSectionInView} />
          </h2>

          <p className={styles.subtitle}>
            <CyberTextReveal text="Industry perspectives, technical deep-dives, and news from the Kyntus ecosystem." delayOffset={0.7} inView={isSectionInView} />
          </p>
        </div>

        {/* BLOG GRID */}
        <div className={styles.blogGrid}>
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} inView={isSectionInView} />
          ))}
        </div>

        {/* BUTTON TO ALL BLOGS */}
        <motion.div 
          className={styles.actionContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link href="/blog" className={styles.viewAllBtn}>
            <span className={styles.btnText}>Explore All Articles</span>
            <div className={styles.btnGlow}></div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}