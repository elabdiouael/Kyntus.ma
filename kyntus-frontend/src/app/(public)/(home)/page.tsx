"use client";

import SmoothScroll from "./layouts/SmoothScroll";
import CustomCursor from "./ux/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Gouvernance from "./components/Gouvernance";
import Partners from "./components/Partners";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import styles from "./home.module.css";

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <main className={styles.mainContainer}>
        <Navbar />
        
        {/* Section 1: Hero - M-fixer f blasto 100% */}
        <div className={styles.fixedHero}>
          <Hero />
        </div>

        {/* Section 2: L'Rido li kaytjer mn ta7t */}
        <div className={styles.curtainWrapper}>
          <About />
          <Partners />
          <Services />
          <Gouvernance />
          <Blog />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}