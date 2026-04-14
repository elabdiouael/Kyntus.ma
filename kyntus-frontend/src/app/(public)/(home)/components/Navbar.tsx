"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import MagneticElement from "../framemotionandgsap/MagneticElement";
import styles from "./navbar.module.css";

// ========================================================
// 🚨 L'UPDATE L'MOHEM HNA: 
// 1. Zedt "Careers" (href: "/job")
// 2. Reddit les liens kaybdaw b "/" (/#about, /#services...) 
//    bach ykhedmo mzyan 7ta ila knti f page jdida!
// ========================================================
const navLinks = [
  { name: "About us", href: "/#about" },
  { name: "Commitments", href: "/#commitments" },
  { name: "Services", href: "/#services" },
  { name: "News", href: "/#news" },
  { name: "Careers", href: "/Careers" }, // <--- HADI HIYA L'PAGE JDIDA!
];

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const peekInterval = setInterval(() => {
      if (!isHovered && !isMobileMenuOpen) {
        setIsPeeking(true);
        setTimeout(() => setIsPeeking(false), 1200);
      }
    }, 4000);
    return () => clearInterval(peekInterval);
  }, [isHovered, isMobileMenuOpen]);

  return (
    <>
      <div className={styles.navWrapper}>
        <motion.div
          className={`${styles.navContainer} ${isScrolled ? styles.scrolled : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          layout
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.contentWrapper}>
            
            {/* LOGO */}
            <motion.div layout className={styles.logoGroup}>
              <Link href="/" className={styles.logoLink}>
                <img src="/HomeImages/kyntuslogo.png" alt="Kyntus Logo" className={styles.logoImage} />
                <span className={styles.logoText}>
                  kyntus Morocco<span className={styles.dot}>.</span>
                </span>
              </Link>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {isHovered ? (
                /* EXPANDED MENU */
                <motion.div
                  key="expanded"
                  className={styles.expandedMenu}
                  initial={{ opacity: 0, width: 0, paddingLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", paddingLeft: "3rem" }}
                  exit={{ opacity: 0, width: 0, paddingLeft: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={styles.linksWrapper}>
                    {navLinks.map((link, i) => (
                      <Link key={link.name} href={link.href} className={styles.linkGroup}>
                        <motion.div 
                          className={styles.linkInner} 
                          whileHover="hover"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                        >
                          <motion.span 
                            className={styles.linkTextPrimary}
                            variants={{ hover: { y: "-100%", opacity: 0 } }}
                            transition={{ type: "tween", ease: "circInOut", duration: 0.35 }}
                          >
                            {link.name}
                          </motion.span>
                          <motion.span 
                            className={styles.linkTextSecondary}
                            variants={{ hover: { y: "0%", opacity: 1 } }}
                            initial={{ y: "100%", opacity: 0 }}
                            transition={{ type: "tween", ease: "circInOut", duration: 0.35 }}
                          >
                            {link.name}
                          </motion.span>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  <MagneticElement>
                    {/* HNA TANI ZEDNA L' "/" 9bel "#contact" */}
                    <Link href="/#contact" className={styles.premiumBtn}>
                      <span className={styles.btnText}>Let's Talk</span>
                      <div className={styles.btnHoverBg}></div>
                    </Link>
                  </MagneticElement>
                </motion.div>
              ) : (
                /* COLLAPSED MENU (Peeking) */
                <motion.div
                  key="collapsed"
                  className={styles.collapsedMenu}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div 
                    className={styles.peekBox}
                    animate={{ 
                      width: isPeeking ? 90 : 40,
                      backgroundColor: isPeeking ? "rgba(46, 237, 46, 0.15)" : "rgba(255, 255, 255, 0.05)",
                      borderColor: isPeeking ? "rgba(46, 237, 46, 0.3)" : "rgba(255, 255, 255, 0.1)"
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                  >
                    <Menu size={16} className={styles.peekIcon} />
                    <AnimatePresence>
                      {isPeeking && (
                        <motion.span 
                          className={styles.peekText}
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(4px)" }}
                          transition={{ duration: 0.3 }}
                        >
                          Menu
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* MOBILE TRIGGER */}
      <button 
        className={`${styles.mobileMenuBtn} ${isScrolled ? styles.scrolledBtn : ""}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {isMobileMenuOpen ? <X size={24} className={styles.iconLuxe} /> : <Menu size={24} className={styles.iconLuxe} />}
        </motion.div>
      </button>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { delay: 0.3 } }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.mobileMenuContent}>
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", bounce: 0 }}
                >
                  <Link href={link.href} className={styles.mobileLink} onClick={() => setIsMobileMenuOpen(false)}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ delay: navLinks.length * 0.1, type: "spring", bounce: 0 }}
                style={{ marginTop: "2rem" }}
              >
                {/* ZEDNA L' "/" L'MOBILE 7TA HOWA */}
                <Link href="/#contact" className={styles.mobileContactBtn} onClick={() => setIsMobileMenuOpen(false)}>
                  Let's Talk <ChevronRight size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}