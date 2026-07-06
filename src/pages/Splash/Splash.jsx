import { useEffect } from 'react';
import styles from './Splash.module.css';
import logoDark from '../../assets/logo-dark.png';

export default function Splash({ theme = 'dark', onFinish }) {
    useEffect(() => {
        const t = setTimeout(onFinish, 3000);
        return () => clearTimeout(t);
    }, [onFinish]);

    return (
        <div className={`${styles.splash} ${theme === 'dark' ? styles.dark : styles.light}`}>
            <img
                src={logoDark}
                className={styles.logo}
                alt="AnalyzeX"
            />
        </div>
    );
}