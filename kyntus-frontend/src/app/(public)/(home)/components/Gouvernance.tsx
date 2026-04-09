"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import styles from "./gouvernance.module.css";

// ========================================================
// ENGINE x2000: TYPEWRITER (T9IIL W N9I)
// ========================================================
const TypewriterText = ({ text, delayOffset = 0, className = "", inView, speed = 0.04 }: { text: string; delayOffset?: number; className?: string; inView: boolean; speed?: number }) => {
  const characters = text.split("");
  return (
    <span className={styles.typewriterWrapper}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className={className}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.01, delay: delayOffset + i * speed }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span 
        className={styles.kyntusCursor}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [1, 0, 1] } : {}}
        transition={{ delay: delayOffset + characters.length * speed, duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        |
      </motion.span>
    </span>
  );
};

// ========================================================
// THE x10000 CARD: HOLOGRAPHIC GLASS REFRACTION
// ========================================================
function ExecutiveCard({ member, index, inView }: { member: any, index: number, inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["15deg", "-15deg"]), { damping: 30, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-15deg", "15deg"]), { damping: 30, stiffness: 150 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const bgGlow = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(0, 100, 255, 0.15), transparent 80%)`;
  const glassGlare = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.2), transparent 60%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => { setIsHovered(false); x.set(0); y.set(0); };

  return (
    <div className={styles.perspectiveWrapper}>
      <motion.div 
        className={styles.executiveCard}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 100, scale: 0.85 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 80, damping: 20 }}
      >
        <motion.div className={styles.spotlight} style={{ background: bgGlow }} />
        <motion.div className={styles.glassGlare} style={{ background: glassGlare }} />
        <div className={styles.cardBorderScanner}></div>

        <div className={styles.avatarStage}>
          <div className={styles.hologramRing}></div>
          <div className={styles.imageWrapper}>
            <img src={`/Orga/${member.img}.png`} alt={member.name} className={styles.portrait} onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + member.name + '&background=020612&color=2EED2E&size=200'; }} />
          </div>
        </div>

        <div className={styles.infoPanel}>
          <h4 className={styles.memberName}>
            <TypewriterText text={member.name} delayOffset={0.8 + index * 0.15} speed={0.07} inView={inView} />
          </h4>
          
          <div className={styles.roleContainer}>
            <p className={styles.memberRole}>
              <TypewriterText text={member.role1} delayOffset={1.8 + index * 0.15} speed={0.05} inView={inView} />
            </p>
            {member.role2 && (
              <p className={styles.memberRoleSecondary}>
                <TypewriterText text={member.role2} delayOffset={2.5 + index * 0.15} speed={0.05} inView={inView} />
              </p>
            )}
          </div>

          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedinBtn}>
            <span className={styles.linkedinText}>Connect on</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.linkedinIcon}>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// ========================================================
// MAIN COMPONENT
// ========================================================
export default function Gouvernance() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-15%" });
  
  // L'STATE JDID: Ykhtar l'branch 9bel ma ychouf l'équipe
  const [selectedBranch, setSelectedBranch] = useState<"france" | "morocco" | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgAura = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(0, 100, 255, 0.05), transparent 80%)`;

  const handleGlobalMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const franceTeam = [
    { name: "Fabrice de SEZE", role1: "Chairman", role2: "", img: "Kyntus_Fabriece-de-SEZE", linkedin: "https://www.linkedin.com/in/fabrice-d-98597aa/" },
    { name: "Franck BOUETARD", role1: "Chief Executive Officer", role2: "", img: "Photo-Franck-Bouetard", linkedin: "https://www.linkedin.com/in/franck-bouetard/" },
    { name: "Abderrahim SADIK", role1: "General Manager", role2: "Technical Manager", img: "Kyntus_Abder", linkedin: "https://www.linkedin.com/in/sadik-abderrahim-a31365160/" },
    { name: "Younès HERRAS", role1: "General Manager", role2: "Purchasing Manager", img: "Kyntus_Younes-HERRAS", linkedin: "https://www.linkedin.com/in/younes-herras-9b2244360/" },
    { name: "Laurent TRICARD", role1: "General Manager", role2: "Sales Manager", img: "Kyntus_Laurent-TRICARD", linkedin: "https://www.linkedin.com/in/laurent-tricard-b53352134/" },
    { name: "Vincent TOSTAIN", role1: "General Manager, ATS", role2: "", img: "Kyntus_Vincent-Tostain", linkedin: "https://www.linkedin.com/in/vincent-tostain-4ab905114/" },
    { name: "Fintan SHORTALL", role1: "Chairman of Entegro", role2: "", img: "Fintan", linkedin: "https://www.linkedin.com/in/fintan-shortall-44958a1a/" },
  ];

  const moroccoTeam = [
    { name: "Younès HERRAS", role1: "General Manager", role2: "Purchasing Manager", img: "Kyntus_Younes-HERRAS", linkedin: "https://www.linkedin.com/in/younes-herras-9b2244360/" },
  ];

  const activeTeam = selectedBranch === "france" ? franceTeam : moroccoTeam;

  // Animation dyal choix
  const choiceVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1, y: 0, transition: { delay: custom * 0.2, duration: 0.6, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }
    })
  };

  return (
    <section className={styles.gouvernanceSection} ref={sectionRef} onMouseMove={handleGlobalMouseMove}>
      
      <div className={styles.gradientBg}></div>
      <motion.div className={styles.interactiveBgGlow} style={{ background: bgAura }} />
      <div className={styles.particlesGrid}></div>

      <div className={styles.container}>
        
        <div className={styles.header}>
          <motion.div className={styles.badge} initial={{ opacity: 0, y: 20 }} animate={isSectionInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}>
            Leadership
          </motion.div>

          <h2 className={styles.title}>
            <TypewriterText text="Gouvernance." delayOffset={0.2} speed={0.06} className={styles.typewriterText} inView={isSectionInView} />
          </h2>

          <p className={styles.subtitle}>
            <TypewriterText text="Meet the visionaries driving Kyntus forward. Select a branch to explore our executive boards." delayOffset={1.2} speed={0.03} className={styles.typewriterSubText} inView={isSectionInView} />
          </p>
        </div>

        {/* L'CHOIX DYAL L'BRANCH */}
        {!selectedBranch ? (
          <div className={styles.branchSelection}>
            <motion.div 
              className={styles.branchCard}
              variants={choiceVariants}
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              custom={1}
              onClick={() => setSelectedBranch("france")}
              whileHover={{ scale: 1.05, y: -10, borderColor: "rgba(0, 68, 255, 0.8)" }}
            >
              <div className={styles.branchIcon}>🇫🇷</div>
              <h3>Kyntus France</h3>
              <p>Explore the headquarters leadership team.</p>
              <div className={styles.glowBlue}></div>
            </motion.div>

            <motion.div 
              className={styles.branchCard}
              variants={choiceVariants}
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              custom={2}
              onClick={() => setSelectedBranch("morocco")}
              whileHover={{ scale: 1.05, y: -10, borderColor: "rgba(46, 237, 46, 0.8)" }}
            >
              <div className={styles.branchIcon}>🇲🇦</div>
              <h3>Kyntus Morocco</h3>
              <p>Meet the regional experts and innovators.</p>
              <div className={styles.glowGreen}></div>
            </motion.div>
          </div>
        ) : (
          /* L'GRID DYAL L'EQUIPE B'RETOUR BOUTON */
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className={styles.backButtonContainer}>
              <button className={styles.backButton} onClick={() => setSelectedBranch(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Branches
              </button>
            </div>
            <div className={styles.membersGrid}>
              {activeTeam.map((member, index) => (
                <div key={`${selectedBranch}-${index}`} className={styles.cardContainer}>
                  <ExecutiveCard member={member} index={index} inView={true} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      {/* ========================================================= */}
      {/* L'HBAAL HNA: DUAL ELECTRICITY BORDER (BOTTOM LTR & RTL) */}
      {/* ========================================================= */}
      <div className={styles.electricBorderBottom}>
        <div className={styles.sparkFastLTR}></div>
        <div className={styles.sparkSlowLTR}></div>
        <div className={styles.sparkFastRTL}></div>
        <div className={styles.sparkSlowRTL}></div>
      </div>

    </section>
  );
}