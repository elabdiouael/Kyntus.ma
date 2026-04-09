import React from 'react';
import styles from './heroSection.module.css';
import HeroButton from '../typesofbutton/HeroButton';

export default function HeroSection() {
  return (
    <section className={styles.heroContainer}>
      <h1 className={styles.mainTitle}>
        BÂTIR L'AVENIR<br />CONNECTÉ.
      </h1>
      <p className={styles.subTitle}>
        Kyntus Morocco redéfinit les infrastructures de télécommunication et d'énergie avec une précision d'ingénierie.
      </p>
      
      <div className={styles.actions}>
        {/* Fix: Zedna l'prop 'href' li knti nssiti bach TypeScript mayb9ach ybki */}
        <HeroButton href="/#about" text="Découvrir Kyntus" />
      </div>
    </section>
  );
}