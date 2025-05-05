'use client';

import React from 'react';
import Image from 'next/image';
import styles from './UserFooter.module.css';

const UserFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <Image
            src="/hcmut.png"
            alt="HCMUT Logo"
            width={30}
            height={30}
            className={styles.footerLogoImage}
          />
          <span className={styles.footerLogoText}>SSMR - Trường Đại học Bách khoa - ĐHQG TPHCM</span>
        </div>
        <div className={styles.footerCopyright}>
          © 2025 - All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
