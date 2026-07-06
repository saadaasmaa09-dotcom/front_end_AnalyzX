import { useState } from 'react';
import styles from './SignIn.module.css';
import googleIcon from '../../assets/google-icon.svg';
import appleIcon from '../../assets/apple-icon.svg';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';

export default function SignIn({ theme = 'dark', onLogin, onCreateAccount }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isDark = theme === 'dark';

    return (
        <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
            <div className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}>

                <img src={isDark ? logoDark : logoLight} alt="" className={styles.bgLogo} />
                <img src={isDark ? logoDark : logoLight} alt="AnalyzeX" className={styles.topLogo} />

                <button className={`${styles.socialBtn} ${isDark ? styles.socialDark : styles.socialLight}`}>
                    <img src={googleIcon} alt="Google" width={21} height={21} />
                    Continue with Google
                </button>

                <button className={`${styles.socialBtn} ${isDark ? styles.appleBtn : styles.appleBtnLight}`}>
                    <img src={appleIcon} alt="Apple" width={18} height={21} />
                    Continue with Apple
                </button>

                <div className={styles.divider}>
                    <span className={styles.line} />
                    <span className={`${styles.orText} ${isDark ? styles.orDark : styles.orLight}`}>Or</span>
                    <span className={styles.line} />
                </div>

                <label className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}>Email</label>
                <input className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    type="email" placeholder="Enter your email"
                    value={email} onChange={e => setEmail(e.target.value)} />

                <label className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}>Password</label>
                <input className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    type="password" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} />

                <button className={styles.loginBtn} onClick={() => onLogin?.(email, password)}>
                    Log In
                </button>

                <p className={`${styles.footer} ${isDark ? styles.footerDark : styles.footerLight}`}>
                    Don't have an account?{' '}
                    <span className={styles.createLink} onClick={onCreateAccount}>
                        Create a new account.
                    </span>
                </p>
            </div>
        </div>
    );
}