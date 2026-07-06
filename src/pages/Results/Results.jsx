import styles from './Results.module.css';
import {
    Menu,
    RefreshCw,
    Download,
    TrendingUp
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts';

import { safeJsonParse } from '../../utils/analysisData';

import logoIcon from '../../assets/logo-icon.png';
import resultIcon1 from '../../assets/result_icons_1.png';
import resultIcon2 from '../../assets/result_icons_2.png';
import resultIcon3 from '../../assets/result_icons_3.png';
import resultIcon4 from '../../assets/result_icons_4.png';
import recIcon from '../../assets/icon.png';
import icon1 from '../../assets/icon1.png';

const resultIcons = [
    resultIcon1,
    resultIcon2,
    resultIcon3,
    resultIcon4
];

function normalizeText(value, fallback = '') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map((item) => normalizeText(item)).filter(Boolean).join('، ');
    }

    if (typeof value === 'object') {
        return (
            value.description ||
            value.desc ||
            value.text ||
            value.summary ||
            JSON.stringify(value)
        );
    }

    return fallback;
}

function normalizeList(rawItems, defaultTitle) {
    if (!rawItems) {
        return [];
    }

    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items.map((item, index) => {
        if (typeof item === 'string' || typeof item === 'number') {
            return {
                title: `${defaultTitle} ${index + 1}`,
                desc: String(item)
            };
        }

        return {
            title:
                item?.title ||
                item?.name ||
                item?.label ||
                `${defaultTitle} ${index + 1}`,

            desc: normalizeText(
                item?.description ??
                item?.desc ??
                item?.text ??
                item?.value,
                ''
            )
        };
    });
}

function buildStats(parsedResult) {
    const rawStats =
        parsedResult.stats ||
        parsedResult.metrics ||
        parsedResult.kpis ||
        parsedResult.summary_cards ||
        [];

    if (Array.isArray(rawStats) && rawStats.length > 0) {
        return rawStats.slice(0, 4).map((item, index) => ({
            icon: resultIcons[index] || resultIcon1,
            label:
                item?.label ||
                item?.title ||
                item?.name ||
                `Metric ${index + 1}`,
            value: normalizeText(
                item?.value ??
                item?.amount ??
                item?.result,
                'N/A'
            ),
            sub: normalizeText(
                item?.sub ??
                item?.subtitle ??
                item?.description,
                ''
            )
        }));
    }

    return [
        {
            icon: resultIcon1,
            label: 'Analysis Status',
            value: normalizeText(
                parsedResult.status ||
                parsedResult.analysis_status,
                'Completed'
            ),
            sub: 'Latest analysis result'
        },
        {
            icon: resultIcon2,
            label: 'Data Points',
            value: normalizeText(
                parsedResult.total_records ||
                parsedResult.row_count ||
                parsedResult.data_points,
                'N/A'
            ),
            sub: 'Records analyzed'
        },
        {
            icon: resultIcon3,
            label: 'Predictions',
            value: normalizeText(
                Array.isArray(parsedResult.predictions)
                    ? parsedResult.predictions.length
                    : parsedResult.predictions
                        ? 1
                        : 0
            ),
            sub: 'Prediction items'
        },
        {
            icon: resultIcon4,
            label: 'Recommendations',
            value: normalizeText(
                Array.isArray(parsedResult.recommendations)
                    ? parsedResult.recommendations.length
                    : parsedResult.recommendations
                        ? 1
                        : 0
            ),
            sub: 'Recommendation items'
        }
    ];
}

export default function Results({
    theme = 'dark',
    analysis,
    onAnalyzeAnother,
    onDownload
}) {
    const isDark = theme === 'dark';

    const parsedResult =
        safeJsonParse(analysis?.analysis_result) || {};

    const chartSource =
        parsedResult.chart ||
        parsedResult.chart_data ||
        parsedResult.visualization ||
        parsedResult;

    const labels =
        chartSource.labels ||
        chartSource.chart_labels ||
        chartSource.categories ||
        [];

    const rawValues =
        chartSource.values ||
        chartSource.percentages ||
        chartSource.data ||
        [];

    const values = Array.isArray(rawValues)
        ? rawValues
        : [];

    const chartData = Array.isArray(labels)
        ? labels.map((label, index) => {
            const rawValue = values[index];

            const numericValue =
                typeof rawValue === 'object' && rawValue !== null
                    ? rawValue.value ??
                    rawValue.amount ??
                    rawValue.percentage ??
                    0
                    : rawValue;

            return {
                name: String(label),
                value: Number(numericValue ?? 0)
            };
        })
        : [];

    const description = normalizeText(
        parsedResult.description ||
        parsedResult.Description ||
        parsedResult.summary ||
        parsedResult.overview,
        'No description available for this analysis.'
    );

    const predictions = normalizeList(
        parsedResult.predictions ||
        parsedResult.Predictions ||
        parsedResult.forecast ||
        parsedResult.forecasts,
        'Prediction'
    );

    const recommendations = normalizeList(
        parsedResult.recommendations ||
        parsedResult.Recommendations,
        'Recommendation'
    );

    const stats = buildStats(parsedResult);

    const fileName =
        analysis?.file_name ||
        analysis?.filename ||
        analysis?.original_filename ||
        '';

    const sectionStyle = {
        marginTop: '24px',
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: isDark ? '#15162C' : '#FFFFFF',
        border: isDark
            ? '1px solid #2A2B4A'
            : '1px solid #E5E7EB'
    };

    const headingStyle = {
        margin: '0 0 16px',
        color: isDark ? '#FFFFFF' : '#111827'
    };

    const paragraphStyle = {
        margin: 0,
        lineHeight: '1.7',
        color: isDark ? '#B8BAD0' : '#4B5563'
    };

    return (
        <div
            className={`${styles.page} ${isDark ? styles.dark : styles.light
                }`}
        >
            {/* Navbar */}
            <nav
                className={`${styles.navbar} ${isDark ? styles.navDark : styles.navLight
                    }`}
            >
                <div className={styles.navLogo}>
                    <img
                        src={logoIcon}
                        alt="logo"
                        className={styles.navIcon}
                    />

                    <span
                        className={`${styles.navText} ${isDark ? styles.textWhite : styles.textDark
                            }`}
                    >
                        ANALYZEX
                    </span>
                </div>

                <Menu
                    color={isDark ? '#FFF9F9' : '#060F21'}
                    size={20}
                />
            </nav>

            {/* Header */}
            <div className={styles.header}>
                <h2
                    className={`${styles.title} ${isDark ? styles.textWhite : styles.textDark
                        }`}
                >
                    Analysis Results
                </h2>

                <p className={styles.subtitle}>
                    {fileName
                        ? `Results for ${fileName}`
                        : 'Here are the key insights from your dataset.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div
                        key={`${stat.label}-${index}`}
                        className={`${styles.statCard} ${isDark ? styles.cardDark : styles.cardLight
                            }`}
                    >
                        <img
                            src={stat.icon}
                            alt=""
                            width={51}
                            height={50}
                            style={{ objectFit: 'contain' }}
                        />

                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>
                                {stat.label}
                            </span>

                            <span
                                className={`${styles.statValue} ${isDark ? styles.textWhite : styles.textDark
                                    }`}
                            >
                                {stat.value}
                            </span>

                            {stat.sub && (
                                <span className={styles.statSub}>
                                    <TrendingUp
                                        size={10}
                                        color="#1AEE80"
                                    />
                                    {' '}
                                    {stat.sub}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className={styles.section}>
                <div
                    className={`${styles.recCard} ${isDark ? styles.cardDark : styles.cardLight
                        }`}
                    style={{ padding: '20px' }}
                >
                    <h3 style={headingStyle}>
                        Visualization
                    </h3>

                    {chartData.length > 0 ? (
                        <div
                            style={{
                                width: '100%',
                                height: '320px'
                            }}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        fill="#8b5cf6"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={paragraphStyle}>
                            No chart data available.
                        </p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>
                    Description
                </h3>

                <p style={paragraphStyle}>
                    {description}
                </p>
            </div>

            {/* Predictions */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>
                    Predictions
                </h3>

                {predictions.length > 0 ? (
                    predictions.map((prediction, index) => (
                        <div
                            key={`${prediction.title}-${index}`}
                            style={{
                                marginBottom:
                                    index < predictions.length - 1
                                        ? '16px'
                                        : '0'
                            }}
                        >
                            <h4
                                style={{
                                    margin: '0 0 6px',
                                    color: isDark ? '#FFFFFF' : '#111827'
                                }}
                            >
                                {prediction.title}
                            </h4>

                            <p style={paragraphStyle}>
                                {prediction.desc}
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={paragraphStyle}>
                        No predictions available for this analysis.
                    </p>
                )}
            </div>

            {/* Recommendations */}
            <div className={styles.section}>
                <div
                    className={`${styles.recCard} ${isDark ? styles.cardDark : styles.cardLight
                        }`}
                >
                    <div className={styles.recHeader}>
                        <img
                            src={icon1}
                            alt=""
                            width={25}
                            height={24}
                        />

                        <span
                            className={`${styles.recTitle} ${isDark ? styles.textWhite : styles.textDark
                                }`}
                        >
                            Recommendations
                        </span>
                    </div>

                    <hr
                        className={`${styles.recDivider} ${isDark
                                ? styles.dividerDark
                                : styles.dividerLight
                            }`}
                    />

                    {recommendations.length > 0 ? (
                        recommendations.map((recommendation, index) => (
                            <div
                                key={`${recommendation.title}-${index}`}
                            >
                                <div className={styles.recRow}>
                                    <div
                                        className={`${styles.recIconBox} ${isDark
                                                ? styles.recIconDark
                                                : styles.recIconLight
                                            }`}
                                    >
                                        <img
                                            src={recIcon}
                                            alt=""
                                            width={23}
                                            height={29}
                                        />
                                    </div>

                                    <div className={styles.recInfo}>
                                        <span
                                            className={`${styles.recItemTitle} ${isDark
                                                    ? styles.textWhite
                                                    : styles.textDark
                                                }`}
                                        >
                                            {recommendation.title}
                                        </span>

                                        <span className={styles.recDesc}>
                                            {recommendation.desc}
                                        </span>
                                    </div>
                                </div>

                                {index < recommendations.length - 1 && (
                                    <hr
                                        className={`${styles.recDivider} ${isDark
                                                ? styles.dividerDark
                                                : styles.dividerLight
                                            }`}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <p
                            style={{
                                ...paragraphStyle,
                                padding: '16px 0'
                            }}
                        >
                            No recommendations available for this analysis.
                        </p>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className={styles.btnRow}>
                <button
                    className={styles.btn}
                    onClick={onAnalyzeAnother}
                >
                    <RefreshCw
                        size={14}
                        color="#FFFFFF"
                    />
                    Analyze Another File
                </button>

                <button
                    className={styles.btn}
                    onClick={onDownload}
                >
                    <Download
                        size={14}
                        color="#FFFFFF"
                    />
                    Download PDF Report
                </button>
            </div>
        </div>
    );
}
