import { useState } from 'react';
import styles from './Register.module.css';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';

export default function Register({ theme = 'dark', onSignUp, onLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const isDark = theme === 'dark';

    return (
        <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
            <div className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}>

                {/* اللوغو الخلفي */}
                <img src={isDark ? logoDark : logoLight} alt="" className={styles.bgLogo} />

                <h2 className={`${styles.title} ${isDark ? styles.titleDark : styles.titleLight}`}>
                    Create Account
                </h2>

                <label className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}>Full name</label>
                <input className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    type="text" placeholder="Enter your name"
                    value={name} onChange={e => setName(e.target.value)} />

                <label className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}>Email</label>
                <input className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    type="email" placeholder="Enter your email"
                    value={email} onChange={e => setEmail(e.target.value)} />

                <label className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}>Password</label>
                <input className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    type="password" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} />

                <label className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}>Confirm password</label>
                <input className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
                    type="password" placeholder="Confirm your password"
                    value={confirm} onChange={e => setConfirm(e.target.value)} />

                <button className={styles.signUpBtn}
                    onClick={() => onSignUp?.({ name, email, password })}>
                    Sign Up
                </button>

                <p className={`${styles.footer} ${isDark ? styles.footerDark : styles.footerLight}`}>
                    Already have an account?{' '}
                    <span className={styles.loginLink} onClick={onLogin}>Log In</span>
                </p>
            </div>
        </div>
    );
}