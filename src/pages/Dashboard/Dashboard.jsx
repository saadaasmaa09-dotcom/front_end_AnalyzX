import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { Menu, TrendingUp } from 'lucide-react';
import analysisService from '../../api/analysisService';
import {
    safeJsonParse,
    unwrapHistoryResponse
} from '../../utils/analysisData';
import logoIcon from '../../assets/logo-icon.png';
import logoBg from '../../assets/logo__1_.png';
import userPic from '../../assets/user-pic.png';
import uploadIcon from '../../assets/upload-icon.png';
import excelIcon from '../../assets/excel.png';
import csvIcon from '../../assets/Vector__1_.png';
import icon1 from '../../assets/dashboard-icons1.png';
import icon3 from '../../assets/dashboard-icons3.png';
import icon4 from '../../assets/dashboard-icons4.png';
import salesIcon from '../../assets/sales_icon.png';
import highestIcon from '../../assets/highest_icon.png';
import productIcon from '../../assets/product_icon.png';
import salesChart from '../../assets/Sales_increased.svg';
import highestChart from '../../assets/Highest_growth.svg';
import productChart from '../../assets/Product_A.svg';



const insights = [
    { title: 'Sales increased by 15%', desc: 'Total sales are up compared to last month.', icon: salesIcon, chart: salesChart },
    { title: 'Highest growth in North region', desc: 'North region performance is outperforming others.', icon: highestIcon, chart: highestChart },
    { title: 'Product A outperformed', desc: 'Product A has the highest sales and customer satisfaction.', icon: productIcon, chart: productChart },
];

export default function Dashboard(
    { theme = 'dark',
        username = 'Sara',
        onNewAnalysis,
        onSettings,
        onViewAnalysis }) {
    const isDark = theme === 'dark';
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyError, setHistoryError] = useState('');
    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                setHistoryError('');

                const response = await analysisService.getHistory();
                const historyItems = unwrapHistoryResponse(response);

                setHistory(historyItems);
            } catch (error) {
                console.error('Failed to load history:', error);
                setHistoryError('Failed to load analysis history.');
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);
    const sortedHistory = [...history].sort((firstItem, secondItem) => {
        const firstDate = new Date(
            firstItem.created_at || firstItem.createdAt || 0
        );

        const secondDate = new Date(
            secondItem.created_at || secondItem.createdAt || 0
        );

        return secondDate - firstDate;
    });

    const latestAnalysis = sortedHistory[0] || null;

    const latestFileName =
        latestAnalysis?.file_name ||
        latestAnalysis?.filename ||
        latestAnalysis?.name ||
        'No files';

    const latestAnalysisDate =
        latestAnalysis?.created_at || latestAnalysis?.createdAt
            ? new Date(
                latestAnalysis.created_at || latestAnalysis.createdAt
            ).toLocaleString()
            : 'No analysis';

    const reportsGenerated = history.filter((item) => {
        return (
            item.report_url ||
            item.pdf_url ||
            item.report_generated ||
            item.status === 'completed'
        );
    }).length;

    const stats = [
        {
            label: 'Total Analyses',
            value: history.length,
            sub: `${history.length} analyses`,
            bgDark: '#201E51',
            bgLight: '#F3EFFE',
            icon: icon1
        },
        {
            label: 'Uploaded Files',
            value: history.length,
            sub: `${history.length} files`,
            bgDark: '#153155',
            bgLight: '#F0F8FE',
            icon: uploadIcon
        },
        {
            label: 'Reports Generated',
            value: reportsGenerated,
            sub: `${reportsGenerated} reports`,
            bgDark: '#201E51',
            bgLight: '#F3EFFE',
            icon: icon3
        },
        {
            label: 'Last Analysis',
            value: latestAnalysisDate,
            sub: latestFileName,
            bgDark: '#153155',
            bgLight: '#EDFAFD',
            icon: icon4
        }
    ];
    const analyses = sortedHistory.slice(0, 3).map((item) => {
        const fileName =
            item.file_name ||
            item.filename ||
            item.original_filename ||
            'Untitled File';

        const fileExtension =
            fileName.split('.').pop()?.toLowerCase();

        const analysisDate =
            item.created_at || item.createdAt;

        return {
            ...item,
            name: fileName,

            type:
                item.analysis_type ||
                item.type ||
                'Data Analysis',

            time: analysisDate
                ? new Date(analysisDate).toLocaleString()
                : 'Unknown date',

            icon:
                fileExtension === 'csv'
                    ? csvIcon
                    : excelIcon
        };
    });

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
                <Menu
                    color={isDark ? "#FFF9F9" : "#060F21"}
                    size={20}
                    style={{ cursor: 'pointer' }}
                    onClick={onSettings}
                />
            </nav>

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h2 className={`${styles.welcome} ${isDark ? styles.textWhite : styles.textDark}`}>
                        Welcome back {username} 👋
                    </h2>
                    <p className={styles.subtitle}>Ready to analyze your data today?</p>
                </div>
                <img src={userPic} alt="user" className={styles.userPic} />
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((s, i) => (
                    <div key={i} className={`${styles.statCard} ${isDark ? styles.statCardDark : styles.statCardLight}`}>
                        <div
                            className={styles.statCircle}
                            style={{ background: isDark ? s.bgDark : s.bgLight }}
                        >
                            <img src={s.icon} alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{s.label}</span>
                            <span className={`${styles.statValue} ${isDark ? styles.textWhite : styles.textDark}`}>
                                {s.value}
                            </span>
                            <span className={styles.statSub}>
                                <TrendingUp size={10} color="#1AEE80" /> {s.sub}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Analysis */}
            <div className={styles.section}>
                <div className={`${styles.newCard} ${isDark ? styles.newCardDark : styles.newCardLight}`}>
                    <img src={logoBg} alt="" className={styles.cardBgLogo} />
                    <div className={styles.newLeft}>
                        <p className={`${styles.newTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                            Start a New Analysis
                        </p>
                        <p className={styles.newDesc}>
                            Upload your dataset and let AnalyzeX turn it into clear insights, visualization, and recommendations.
                        </p>
                        <button className={styles.newBtn} onClick={onNewAnalysis}>
                            ➜ New Analysis
                        </button>
                    </div>
                    <div className={`${styles.uploadBox} ${isDark ? styles.uploadBoxDark : styles.uploadBoxLight}`}>
                        <img src={uploadIcon} alt="upload" width={52} height={42} />
                        <p className={`${styles.dragText} ${isDark ? styles.textWhite : styles.textDark}`}>
                            Drag & drop your file here
                        </p>
                        <p className={styles.browseText}>or click to browse</p>
                        <p className={styles.formatText}>CSV, Excel (XLSX) up to 50MB</p>
                    </div>
                </div>
            </div>

            {/* Recent Analyses */}
            <div className={styles.section}>
                <p className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                    Recent Analyses
                </p>
                <div className={`${styles.listCard} ${isDark ? styles.listCardDark : styles.listCardLight}`}>
                    <img src={logoBg} alt="" className={styles.cardBgLogo} />
                    {analyses.map((analysis, i) => (
                        <div key={analysis.id || analysis.analysis_id || i}>
                            <div className={styles.listRow}>
                                <img
                                    src={analysis.icon}
                                    alt=""
                                    width={24}
                                    height={24}
                                    style={{ objectFit: 'contain' }}
                                />

                                <div className={styles.listInfo}>
                                    <span
                                        className={`${styles.listName} ${isDark ? styles.textWhite : styles.textDark
                                            }`}
                                    >
                                        {analysis.name}
                                    </span>

                                    <span className={styles.listType}>
                                        {analysis.type}
                                    </span>
                                </div>

                                <span className={styles.listTime}>
                                    {analysis.time}
                                </span>

                                <button
                                    className={`${styles.viewBtn} ${isDark ? styles.viewBtnDark : styles.viewBtnLight
                                        }`}
                                    onClick={() => onViewAnalysis?.(analysis)}
                                >
                                    View
                                </button>
                            </div>

                            {i < analyses.length - 1 && (
                                <hr
                                    className={`${styles.divider} ${isDark ? styles.dividerDark : styles.dividerLight
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Insights */}
            <div className={styles.section}>
                <p className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                    Recent Insights
                </p>
                <div className={styles.insightsGrid}>
                    {insights.map((ins, i) => (
                        <div key={i} className={`${styles.insightCard} ${isDark ? styles.insightCardDark : styles.insightCardLight}`}>
                            <img src={logoBg} alt="" className={styles.insightBgLogo} />
                            <div className={styles.insightHeader}>
                                <img src={ins.icon} alt="" width={32} height={32} style={{ objectFit: 'contain' }} />
                                <p className={`${styles.insightTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                                    {ins.title}
                                </p>
                            </div>
                            <p className={styles.insightDesc}>{ins.desc}</p>
                            <img src={ins.chart} alt="chart" className={styles.insightChart} />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}