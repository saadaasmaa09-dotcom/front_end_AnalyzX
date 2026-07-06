import { useState } from 'react';
import styles from './Settings.module.css';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import logoIcon from '../../assets/logo-icon.png';
import profilePic from '../../assets/profile_1.png';
import settingIcon from '../../assets/setting.png';
import darkIcon from '../../assets/dark.png';
import languageIcon from '../../assets/language.png';
import notificationIcon from '../../assets/notification.png';
import securityIcon from '../../assets/security.png';
import passwordIcon from '../../assets/password.png';
import privacyIcon from '../../assets/privacy.png';
import logoutIcon from '../../assets/logout.png';

export default function Settings({ theme = 'dark', onBack, onThemeToggle }) {
    const [darkMode, setDarkMode] = useState(theme === 'dark');
    const [notifications, setNotifications] = useState(true);
    const isDark = theme === 'dark';

    const handleDarkToggle = () => {
        setDarkMode(!darkMode);
        onThemeToggle?.();
    };

    return (
        <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>

            {/* Navbar */}
            <nav className={`${styles.navbar} ${isDark ? styles.navDark : styles.navLight}`}>
                <button className={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={18} color="#95A2B9" />
                </button>
                <div className={styles.navCenter}>
                    <img src={logoIcon} alt="logo" className={styles.navIcon} />
                    <span className={`${styles.navText} ${isDark ? styles.textWhite : styles.textDark}`}>
                        ANALYZEX
                    </span>
                </div>
                <div style={{ width: 18 }} />
            </nav>

            {/* Header */}
            <div className={styles.header}>
                <h2 className={`${styles.title} ${isDark ? styles.textWhite : styles.textDark}`}>Settings</h2>
                <p className={styles.subtitle}>Manage your account and preferences</p>
            </div>

            {/* Profile Card */}
            <div className={styles.section}>
                <div className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}>
                    <div className={styles.profileRow}>
                        <img src={profilePic} alt="profile" className={styles.profilePic} />
                        <div className={styles.profileInfo}>
                            <span className={`${styles.profileName} ${isDark ? styles.textWhite : styles.textDark}`}>
                                Sara Khalil
                            </span>
                            <span className={styles.profileEmail}>Sara@gmail.com</span>
                        </div>
                        <button className={`${styles.editBtn} ${isDark ? styles.editDark : styles.editLight}`}>
                            Edit Profile <ChevronRight size={12} color={isDark ? '#FFFFFF' : '#060F21'} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className={styles.section}>
                <div className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}>
                    <div className={styles.sectionHeader}>
                        <img src={settingIcon} alt="" width={20} height={20} />
                        <span className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                            Preferences
                        </span>
                    </div>
                    <hr className={`${styles.divider} ${isDark ? styles.divDark : styles.divLight}`} />

                    {/* Dark Mode */}
                    <div className={styles.settingRow}>
                        <div className={`${styles.iconCircle} ${isDark ? styles.circle1Dark : styles.circle1Light}`}>
                            <img src={darkIcon} alt="" width={18} height={18} />
                        </div>
                        <div className={styles.settingInfo}>
                            <span className={`${styles.settingTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                Dark Mode
                            </span>
                            <span className={styles.settingDesc}>Enable dark appearance</span>
                        </div>
                        <div
                            className={`${styles.toggle} ${darkMode ? styles.toggleOn : styles.toggleOff}`}
                            onClick={handleDarkToggle}
                        >
                            <div className={`${styles.toggleThumb} ${darkMode ? styles.thumbOn : styles.thumbOff}`} />
                        </div>
                    </div>

                    <hr className={`${styles.divider} ${isDark ? styles.divDark : styles.divLight}`} />

                    {/* Language */}
                    <div className={styles.settingRow}>
                        <div className={`${styles.iconCircle} ${isDark ? styles.circle2Dark : styles.circle2Light}`}>
                            <img src={languageIcon} alt="" width={18} height={18} />
                        </div>
                        <div className={styles.settingInfo}>
                            <span className={`${styles.settingTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                Language
                            </span>
                            <span className={styles.settingDesc}>Choose your language</span>
                        </div>
                    </div>

                    <hr className={`${styles.divider} ${isDark ? styles.divDark : styles.divLight}`} />

                    {/* Notifications */}
                    <div className={styles.settingRow}>
                        <div className={`${styles.iconCircle} ${isDark ? styles.circle3Dark : styles.circle3Light}`}>
                            <img src={notificationIcon} alt="" width={18} height={18} />
                        </div>
                        <div className={styles.settingInfo}>
                            <span className={`${styles.settingTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                Notifications
                            </span>
                            <span className={styles.settingDesc}>Manage your notifications</span>
                        </div>
                        <div
                            className={`${styles.toggle} ${notifications ? styles.toggleOn : styles.toggleOff}`}
                            onClick={() => setNotifications(!notifications)}
                        >
                            <div className={`${styles.toggleThumb} ${notifications ? styles.thumbOn : styles.thumbOff}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className={styles.section}>
                <div className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}>
                    <div className={styles.sectionHeader}>
                        <img src={securityIcon} alt="" width={20} height={20} />
                        <span className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                            Security
                        </span>
                    </div>
                    <hr className={`${styles.divider} ${isDark ? styles.divDark : styles.divLight}`} />

                    <div className={styles.settingRow}>
                        <div className={`${styles.iconCircle} ${isDark ? styles.circle2Dark : styles.circle2Light}`}>
                            <img src={passwordIcon} alt="" width={18} height={18} />
                        </div>
                        <div className={styles.settingInfo}>
                            <span className={`${styles.settingTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                Change Password
                            </span>
                            <span className={styles.settingDesc}>Update your account password</span>
                        </div>
                        <ChevronRight size={16} color="#95A2B9" />
                    </div>

                    <hr className={`${styles.divider} ${isDark ? styles.divDark : styles.divLight}`} />

                    <div className={styles.settingRow}>
                        <div className={`${styles.iconCircle} ${isDark ? styles.circle1Dark : styles.circle1Light}`}>
                            <img src={privacyIcon} alt="" width={18} height={18} />
                        </div>
                        <div className={styles.settingInfo}>
                            <span className={`${styles.settingTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                Privacy Policy
                            </span>
                            <span className={styles.settingDesc}>Read our privacy policy</span>
                        </div>
                        <ChevronRight size={16} color="#95A2B9" />
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className={styles.section}>
                <div className={`${styles.logoutCard} ${isDark ? styles.logoutDark : styles.logoutLight}`}>
                    <div className={styles.settingRow}>
                        <div className={`${styles.iconCircle} ${isDark ? styles.logoutIconDark : styles.logoutIconLight}`}>
                            <img src={logoutIcon} alt="" width={20} height={20} />
                        </div>
                        <div className={styles.settingInfo}>
                            <span className={styles.logoutText}>Log Out</span>
                            <span className={styles.settingDesc}>Sign out from your account</span>
                        </div>
                        <ChevronRight size={16} color="#95A2B9" />
                    </div>
                </div>
            </div>

        </div>
    );
}