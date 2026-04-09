'use client'; // Hit ghan-khedmou b usePathname bach n3rfou ina page 7na fiha
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Vue d\'ensemble', path: '/dashboard', icon: '📊' },
    { name: 'Services', path: '/dashboard/services', icon: '⚙️' },
    { name: 'Actualités', path: '/dashboard/articles', icon: '📰' },
    { name: 'Offres d\'emploi', path: '/dashboard/jobs', icon: '💼' },
    { name: 'Messages & Leads', path: '/dashboard/messages', icon: '✉️' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        Kyntus<span className={styles.logoAccent}>.</span>Admin
      </div>
      <nav className={styles.navLinks}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}