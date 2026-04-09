"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./heroButton.module.css";

interface HeroButtonProps {
  href: string;
  text: string;
}

export default function HeroButton({ href, text }: HeroButtonProps) {
  return (
    <Link href={href} className={styles.buttonWrapper}>
      <motion.div 
        className={styles.buttonInner}
        whileHover="hover"
        initial="initial"
      >
        <span className={styles.text}>{text}</span>
        <span className={styles.iconWrapper}>
          <ArrowRight size={18} className={styles.icon} />
        </span>
        <motion.div 
          className={styles.fill}
          variants={{
            initial: { scaleY: 0, originY: 1 },
            hover: { scaleY: 1, originY: 1 }
          }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        />
      </motion.div>
    </Link>
  );
}