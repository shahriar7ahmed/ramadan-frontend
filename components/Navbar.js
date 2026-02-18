"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
    { href: "/", label: "Home", labelBn: "হোম", icon: "🏠" },
    { href: "/prayer-times", label: "Prayer Times", labelBn: "নামাজের সময়", icon: "🕌" },
    { href: "/quran", label: "Quran", labelBn: "কুরআন", icon: "📖" },
    { href: "/tajweed", label: "Tajweed AI", labelBn: "তাজবীদ", icon: "🎙️" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className={`${styles.navbar} glass-nav`}>
            <div className={`container ${styles.navContainer}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                    <span className={styles.logoIcon}>☪</span>
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>Ramadan</span>
                        <span className={styles.logoSubtitle}>Companion</span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className={styles.navLinks}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""
                                }`}
                        >
                            <span className={styles.navIcon}>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className={styles.hamburger}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    <span className={`${styles.hamburgerLine} ${isOpen ? styles.open : ""}`} />
                    <span className={`${styles.hamburgerLine} ${isOpen ? styles.open : ""}`} />
                    <span className={`${styles.hamburgerLine} ${isOpen ? styles.open : ""}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ""}`}>
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ""
                            }`}
                        onClick={() => setIsOpen(false)}
                    >
                        <span className={styles.mobileIcon}>{link.icon}</span>
                        <div>
                            <span className={styles.mobileLinkLabel}>{link.label}</span>
                            <span className={styles.mobileLinkBn}>{link.labelBn}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)} />
            )}
        </nav>
    );
}
