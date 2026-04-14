"use client";

import React from 'react';
import styles from './job.module.css';

import Navbar from '../(home)/components/Navbar';
import CustomCursor from '../(home)/ux/CustomCursor';

import JobHero from './components/JobHero';
import ApplicationForm from './components/ApplicationForm';
// IMPORTINA L'BACKGROUND 2D L'JDID
import JobBackground2D from './threejs/JobBackground2D'; 

export default function JobPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className={styles.jobPageContainer}>
        
        {/* ========================================= */}
        {/* 1. THREE.JS 2D SCHEMATIC (Westani) */}
        {/* ========================================= */}
        <JobBackground2D />

        {/* ========================================= */}
        {/* 2. LES 3 ZONES DYAL L'CSS (Luxe Layout) */}
        {/* ========================================= */}
        
        {/* Zone 1: Royal Blue (Rzana lfo9) */}
        <div className={styles.bgZone1}></div>

        {/* Zone 2: Matte Overlay bach tb9a Three.js bayna b rzana */}
        <div className={styles.bgZone2}></div>

        {/* Zone 3: Dark Gradient lta7t */}
        <div className={styles.bgZone3}></div>

        {/* Matte Noise (Premium) */}
        <div className={styles.premiumNoise}></div>

        {/* ========================================= */}
        {/* 3. L'CONTENU */}
        {/* ========================================= */}
        <div className={styles.contentZIndex}>
          <JobHero />
          <ApplicationForm />
        </div>
        
      </main>
    </>
  );
}