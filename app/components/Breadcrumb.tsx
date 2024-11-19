"use client"; // Marks this as a Client Component

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';

const Breadcrumb = () => {
  const pathname = usePathname(); // Get the current path
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <nav className={styles.breadcrumb}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const href = '/' + pathnames.slice(0, index + 1).join('/');
          const isLast = index === pathnames.length - 1;
          return (
            <li key={href}>
              {/* Separator */}
              <span className={styles.separator}>&gt;</span>
              {!isLast ? (
                <Link href={href}>{value}</Link>
              ) : (
                <span>{value}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;

