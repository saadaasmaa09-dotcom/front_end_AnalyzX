import { useState } from 'react';
import styles from './Review.module.css';
import { Menu, Home, ChevronRight, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import analysisService from '../../api/analysisService';
import logoIcon from '../../assets/logo-icon.png';
import reviewPic from '../../assets/review-pic.png';
import excelIcon from '../../assets/excel.png';
import icon1 from '../../assets/icon1.png';
import icon2 from '../../assets/icon2.png';

const analysisTypes = [
  { icon: icon1, title: 'Auto Analysis',   desc: 'Let AI choose the best analysis for your data' },
  { icon: icon2, title: 'Descriptive',     desc: 'Summarize and describe your data' },
  { icon: icon2, title: 'Auto Predictive', desc: 'Predict future trends and outcomes' },
  { icon: icon2, title: 'Prescriptive',    desc: 'Get recommendation and actions' },
];

// analysis: الاستجابة الراجعة من /analyses/upload/ (تحتوي id + معاينة البيانات من الباك إند)
export default function Review({ theme = 'dark', analysis, file, onBack, onStartAnalysis, onDashboard, onUpload }) {
  const [selectedType, setSelectedType] = useState(0);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const isDark = theme === 'dark';

  // معاينة البيانات الآن تجي من الباك إند (بعد ما قرأ الملف)، مش من parsing محلي
  const preview = analysis?.preview || analysis;
  const headers = preview?.headers || preview?.columns || [];
  const rows = (preview?.rows || preview?.sample_rows || []).slice(0, 5);

  const handleStart = async () => {
    if (!analysis?.id) return;
    setError(null);
    try {
      setStarting(true);
      // بعد الضغط على Start Analysis، نطلب من الباك إند يبدأ المعالجة (تدخل الـ Queue)
      await analysisService.startAnalysis(analysis.id);
      onStartAnalysis?.(analysis.id, selectedType);
    } catch (err) {
      setError(err.userMessage || 'تعذر بدء التحليل، حاول مرة أخرى.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>

      {/* Navbar */}
      <nav className={`${styles.navbar} ${isDark ? styles.navDark : styles.navLight}`}>
        <div className={styles.navLogo}>
          <img src={logoIcon} alt="logo" className={styles.navIcon} />
          <span className={`${styles.navText} ${isDark ? styles.textWhite : styles.textDark}`}>ANALYZEX</span>
        </div>
        <Menu color={isDark ? "#FFF9F9" : "#060F21"} size={20} />
      </nav>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Home size={12} color="#95A2B9" />
        <ChevronRight size={10} color="#95A2B9" />
        <span className={styles.breadcrumbLink} onClick={onDashboard}>Dashboard</span>
        <ChevronRight size={10} color="#95A2B9" />
        <span className={styles.breadcrumbLink} onClick={onUpload}>Upload Dataset</span>
        <ChevronRight size={10} color="#95A2B9" />
        <span className={styles.breadcrumbActive}>Review Dataset</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={`${styles.title} ${isDark ? styles.textWhite : styles.textDark}`}>
            Review Your Dataset
          </h2>
          <p className={styles.subtitle}>
            Check your file and confirm the data looks good before starting the analysis.
          </p>
        </div>
        <img src={reviewPic} alt="" className={styles.headerPic} />
      </div>

      {/* File Info */}
      <div className={styles.section}>
        <div className={`${styles.fileCard} ${isDark ? styles.cardDark : styles.cardLight}`}>
          <div className={styles.fileTop}>
            <div className={styles.fileLeft}>
              <img src={excelIcon} alt="excel" width={29} height={29} />
              <div>
                <span className={`${styles.fileName} ${isDark ? styles.textWhite : styles.textDark}`}>
                  {file?.name || 'No file'}
                </span>
                <span className={styles.fileSuccess}>
                  <CheckCircle size={10} color="#1AEE80" /> Uploaded successfully
                </span>
              </div>
            </div>
            <button className={`${styles.changeBtn} ${isDark ? styles.changeDark : styles.changeLight}`} onClick={onUpload}>
              <ArrowRight size={10} color={isDark ? "#95A2B9" : "#060F21"} />
              <span>Change File</span>
            </button>
          </div>

          <hr className={`${styles.fileDivider} ${isDark ? styles.dividerDark : styles.dividerLight}`} />

          <div className={styles.fileMeta}>
            {[
              { label: 'File Size',  value: file?.size || '-' },
              { label: 'Rows',       value: (analysis?.rows_count ?? analysis?.rows)?.toLocaleString?.() || '-' },
              { label: 'Columns',    value: String(analysis?.columns_count ?? headers?.length ?? '-') },
              { label: 'Uploaded',   value: 'Today' },
            ].map((m, i) => (
              <div key={i} className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.label}</span>
                <span className={`${styles.metaValue} ${isDark ? styles.textWhite : styles.textDark}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div className={styles.section}>
        <div className={`${styles.tableCard} ${isDark ? styles.cardDark : styles.cardLight}`}>
          <div className={styles.tableHeader}>
            <span className={`${styles.tableTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
              Data Preview
            </span>
            <span className={`${styles.showingBadge} ${isDark ? styles.badgeDark : styles.badgeLight}`}>
              Showing first 5 rows
            </span>
          </div>

          {rows.length > 0 ? (
            <div className={`${styles.tableWrap} ${isDark ? styles.tableWrapDark : styles.tableWrapLight}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className={styles.th}>{h}</th>
                    ))}
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={`${styles.tr} ${isDark ? styles.trDark : styles.trLight}`}>
                      {headers.map((h, j) => (
                        <td key={j} className={`${styles.td} ${isDark ? styles.textWhite : styles.textDark}`}>
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                      <td className={styles.td}>
                        <span className={styles.dots}>•••</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.noData}>No data to preview</p>
          )}
        </div>
      </div>

      {/* Data Quality Check */}
      <div className={styles.section}>
        <div className={`${styles.qualityCard} ${isDark ? styles.cardDark : styles.cardLight}`}>
          <span className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
            Data Quality Check
          </span>
          <div className={`${styles.qualityInner} ${isDark ? styles.qualityDark : styles.qualityLight}`}>
            <div className={styles.qualityRow}>
              <CheckCircle size={15} color="#1AEE80" />
              <div>
                <p className={`${styles.qualityMain} ${isDark ? styles.textWhite : styles.textDark}`}>
                  No missing values detected
                </p>
                <p className={styles.qualitySub}>Great! Your dataset is complete.</p>
              </div>
            </div>
            <hr className={`${styles.qualityDivider} ${isDark ? styles.dividerDark : styles.dividerLight}`} />
            <div className={styles.qualityRow}>
              <AlertTriangle size={15} color="#E1B63E" />
              <div style={{ flex: 1 }}>
                <p className={`${styles.qualityMain} ${isDark ? styles.textWhite : styles.textDark}`}>
                  2 duplicate rows found
                </p>
                <p className={styles.qualitySub}>These duplicated will be removed automatically.</p>
              </div>
              <span className={styles.viewDetails}>
                View Details <ChevronRight size={10} color="#AD86E4" />
              </span>
            </div>
            <hr className={`${styles.qualityDivider} ${isDark ? styles.dividerDark : styles.dividerLight}`} />
            <div className={styles.qualityRow}>
              <CheckCircle size={15} color="#1AEE80" />
              <div>
                <p className={`${styles.qualityMain} ${isDark ? styles.textWhite : styles.textDark}`}>
                  Structured data detected
                </p>
                <p className={styles.qualitySub}>Your data is well-structured and ready for analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Analysis Type */}
      <div className={styles.section}>
        <div className={`${styles.analysisCard} ${isDark ? styles.cardDark : styles.cardLight}`}>
          <div className={styles.analysisHeader}>
            <span className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
              Choose Analysis Type
            </span>
            <HelpCircle size={14} color="#95A2B9" />
          </div>
          <div className={styles.analysisGrid}>
            {analysisTypes.map((t, i) => (
              <div
                key={i}
                className={`${styles.typeCard} ${isDark ? styles.typeDark : styles.typeLight} ${selectedType === i ? styles.typeSelected : ''}`}
                onClick={() => setSelectedType(i)}
              >
                <img src={t.icon} alt="" width={14} height={13} />
                <span className={`${styles.typeTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                  {t.title}
                </span>
                <span className={styles.typeDesc}>{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.section}>
          <p style={{ color: '#CD3956', fontSize: 13 }}>{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className={styles.btnRow}>
        <button className={`${styles.backBtn} ${isDark ? styles.backDark : styles.backLight}`} onClick={onBack}>
          <ArrowLeft size={12} color={isDark ? "#FFFFFF" : "#060F21"} />
          <span className={isDark ? styles.textWhite : styles.textDark}>Back</span>
        </button>
        <button className={styles.startBtn} onClick={handleStart} disabled={starting} style={{ opacity: starting ? 0.6 : 1 }}>
          {starting ? 'Starting...' : 'Start Analysis'} <ArrowRight size={12} color="#FFFFFF" />
        </button>
      </div>

    </div>
  );
}