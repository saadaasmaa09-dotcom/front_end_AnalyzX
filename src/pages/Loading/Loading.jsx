import { useEffect, useRef, useState } from 'react';
import styles from './Loading.module.css';
import { Menu, CheckCircle, Circle } from 'lucide-react';
import analysisService from '../../api/analysisService';
import logoIcon from '../../assets/logo-icon.png';
import loadingPic from '../../assets/loading-pic.png';
import icon2 from '../../assets/icon2.png';

const steps = [
    { title: 'Reading file', desc: 'CSV file detected and loaded successfully' },
    { title: 'Detecting patterns', desc: 'Analyzing data structure and relationships' },
    { title: 'Cleaning data', desc: 'Handling missing values and duplicates' },
    { title: 'Creating charts', desc: 'Generating visualizations and graphs' },
    { title: 'Generating report', desc: 'Compiling insights and recommendations' },
];

const POLL_INTERVAL_MS = 3000;

// حالات الفشل المحتملة القادمة من الباك إند
const FAILED_STATES = ['failed', 'error'];
const COMPLETED_STATES = ['completed', 'done', 'success'];

export default function Loading({ theme = 'dark', analysisId, onFinish, onError }) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [statusText, setStatusText] = useState(null);
    const isDark = theme === 'dark';
    const pollTimer = useRef(null);
    const stopped = useRef(false);

    useEffect(() => {
        stopped.current = false;

        // شريط التقدم البصري (تقريبي) يتحرك بشكل تدريجي أثناء الانتظار،
        // فقط عشان تجربة المستخدم، وما يوصل 100% إلا لما السيرفر يرجع completed فعلياً
        const visualTick = setInterval(() => {
            setProgress(prev => {
                const next = prev < 90 ? prev + 1 : prev;
                setCurrentStep(Math.floor((next / 100) * steps.length));
                return next;
            });
        }, 150);

        // نظام التحقق الدوري (Polling): يسأل السيرفر كل 3 ثواني عن حالة الملف
        // لأن المعالجة تتم في الخلفية عبر Queue (processing -> completed)
        const poll = async () => {
            if (stopped.current || !analysisId) return;
            try {
                const status = await analysisService.getStatus(analysisId);
                const state = (status?.status || status?.analysis_status || '').toLowerCase();
                setStatusText(state);

                if (COMPLETED_STATES.includes(state)) {
                    stopped.current = true;
                    clearInterval(visualTick);
                    setProgress(100);
                    setCurrentStep(steps.length);
                    // نجيب النتيجة الكاملة بعد التأكد من اكتمال المعالجة
                    const results = await analysisService.getResults(analysisId);
                    setTimeout(() => onFinish?.(results), 400);
                    return;
                }

                if (FAILED_STATES.includes(state)) {
                    stopped.current = true;
                    clearInterval(visualTick);
                    onError?.(status?.message || 'فشلت معالجة الملف، حاول مرة أخرى.');
                    return;
                }

                // لسه processing/pending... نكمل الاستعلام
                pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
            } catch (err) {
                stopped.current = true;
                clearInterval(visualTick);
                onError?.(err.userMessage || 'تعذر التحقق من حالة التحليل.');
            }
        };

        pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);

        return () => {
            stopped.current = true;
            clearInterval(visualTick);
            clearTimeout(pollTimer.current);
        };
    }, [analysisId, onFinish, onError]);

    return (
        <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>

            {/* Navbar */}
            <nav className={`${styles.navbar} ${isDark ? styles.navDark : styles.navLight}`}>
                <div className={styles.navLogo}>
                    <img src={logoIcon} alt="logo" className={styles.navIcon} />
                    <span className={`${styles.navText} ${isDark ? styles.textWhite : styles.textDark}`}>
                        ANALYZEX
                    </span>
                </div>
                <Menu color={isDark ? "#FFF9F9" : "#060F21"} size={20} />
            </nav>

            {/* Loading Image */}
            <div className={styles.imageWrap}>
                <div className={`${styles.ring} ${styles.ringOuter}`} />
                <div className={`${styles.ring} ${styles.ringInner}`} />
                <img src={loadingPic} alt="analyzing" className={styles.loadingPic} />
            </div>

            {/* Title */}
            <h2 className={`${styles.title} ${isDark ? styles.textWhite : styles.textDark}`}>
                Analyzing your dataset...
            </h2>
            <p className={styles.subtitle}>
                Please wait while AnalyzeX processes your data and generates powerful insights.
            </p>

            {/* Progress Bar */}
            <div className={styles.progressWrap}>
                <div className={`${styles.progressTrack} ${isDark ? styles.trackDark : styles.trackLight}`}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className={`${styles.progressText} ${isDark ? styles.textWhite : styles.textDark}`}>
                    {progress}%
                </span>
            </div>

            {/* Steps */}
            <div className={styles.section}>
                <div className={`${styles.stepsCard} ${isDark ? styles.stepsDark : styles.stepsLight}`}>
                    {steps.map((s, i) => (
                        <div key={i}>
                            <div className={styles.stepRow}>
                                <div className={styles.stepIcon}>
                                    {i < currentStep ? (
                                        <CheckCircle size={26} color="#2F90BD" fill="#6D6FB9" strokeWidth={1.5} />
                                    ) : (
                                        <Circle size={26} color={isDark ? '#122441' : 'rgba(149,162,185,0.5)'} strokeWidth={1.5} />
                                    )}
                                </div>
                                <div className={styles.stepInfo}>
                                    <span className={`${styles.stepTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                        {s.title}
                                    </span>
                                    <span className={styles.stepDesc}>{s.desc}</span>
                                </div>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`${styles.stepLine} ${isDark ? styles.lineDark : styles.lineLight}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className={styles.section}>
                <div className={`${styles.warningCard} ${isDark ? styles.warningDark : styles.warningLight}`}>
                    <div className={`${styles.warningIcon} ${isDark ? styles.warningIconDark : styles.warningIconLight}`}>
                        <img src={icon2} alt="" width={22} height={28} />
                    </div>
                    <div>
                        <p className={styles.warningTitle}>This may take a few moments</p>
                        <p className={styles.warningSub}>
                            Large datasets can take longer to analyze. You will be redirected automatically
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}