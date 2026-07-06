import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, BarChart2, Settings, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload',    icon: Upload,          label: 'New Analysis' },
  { to: '/results',   icon: BarChart2,       label: 'Results' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
];

export default function Sidebar() {
  const { theme, user, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <>
      <button className={`${styles.hamburger} ${isDark ? styles.hamburgerDark : styles.hamburgerLight}`}
        onClick={() => setMobileOpen(true)}>
        <Menu size={22} />
      </button>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <div className={`${styles.sidebarWrapper} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={`${styles.sidebar} ${isDark ? styles.dark : styles.light}`}>

          <div className={styles.logo}>
            <span className={styles.logoText}>ANALYZEX</span>
            <button className={styles.closeBtn} onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {user && (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>{user.full_name?.[0]?.toUpperCase() || 'U'}</div>
              <div className={styles.userText}>
                <span className={styles.userName}>{user.full_name}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
            </div>
          )}

          <hr className={styles.divider} />

          <nav className={styles.nav}>
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''} ${isDark ? styles.navDark : styles.navLight}`
                }
                onClick={() => setMobileOpen(false)}>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log Out</span>
          </button>

        </div>
      </div>
    </>
  );
}