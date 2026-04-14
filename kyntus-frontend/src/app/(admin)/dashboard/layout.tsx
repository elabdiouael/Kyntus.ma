import React from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import AdminCursor from './components/ux/AdminCursor';
import styles from './dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardContainer}>
      
      {/* ── THE UPGRADED NEON CURSOR ── */}
      <AdminCursor />
      
      {/* ── THE 3D MOVING GRID (Matrix Vibe) ── */}
      <div className={styles.movingGrid} />

      {/* 3D Ambient Lighting */}
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />

      {/* The Floating Glass Sidebar */}
      <Sidebar />
      
      {/* The Floating Main Content Shell */}
      <div className={styles.mainContent}>
        <Topbar />
        
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
      
    </div>
  );
}