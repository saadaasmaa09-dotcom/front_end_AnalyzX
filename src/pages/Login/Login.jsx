import styles from './Login.module.css';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';

export default function Login({ theme = 'dark', onSignIn, onCreateAccount }) {
    const isDark = theme === 'dark';
    return (
        <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
            <img
                src={isDark ? logoDark : logoLight}
                className={styles.logo}
                alt="AnalyzeX"
            />
            <span className={`${styles.title} ${isDark ? styles.titleDark : styles.titleLight}`}>
                Welcome to AnalyzeX
            </span>
            <span className={`${styles.subtitle} ${isDark ? styles.subtitleDark : styles.subtitleLight}`}>
                Sign in to continue analyzing smarter
            </span>
            <button className={styles.signInBtn} onClick={onSignIn}>Sign In</button>
            <button className={`${styles.createBtn} ${isDark ? styles.createDark : styles.createLight}`} onClick={onCreateAccount}>
                Create Account
            </button>
        </div>
    );
}