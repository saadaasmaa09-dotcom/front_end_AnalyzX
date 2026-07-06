import { useState, useRef } from 'react';
import styles from './Upload.module.css';
import { Menu, Home, ChevronRight, ArrowRight, Trash2, CheckCircle } from 'lucide-react';
import analysisService from '../../api/analysisService';
import logoIcon from '../../assets/logo-icon.png';
import uploadPic from '../../assets/upload-pic.png';
import uploadFileIcon from '../../assets/upload-file-icon.svg';
import excelIcon from '../../assets/excel.png';
import reqIcon1 from '../../assets/req-icon1.png';
import reqIcon2 from '../../assets/req-icon2.png';
import reqIcon3 from '../../assets/req-icon3.png';

const MAX_SIZE_MB = 50;
const ALLOWED_EXT = ['csv', 'xlsx', 'xls'];

export default function Upload({ theme = 'dark', onContinue, onDashboard }) {
  const [file, setFile] = useState(null);         // معلومات الملف المحلية (اسم/حجم) لعرضها فقط
  const [analysis, setAnalysis] = useState(null);  // الاستجابة الراجعة من الباك إند بعد الرفع
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const isDark = theme === 'dark';

  // لا يوجد قراءة أو تحقق من محتوى الملف محلياً بعد الآن.
  // الملف يُرسل كما هو للباك إند عبر FormData، والباك إند هو من يقرأه ويبعثه لـ OpenAI.
  const handleFile = async (f) => {
    if (!f) return;
    setError(null);

    const ext = f.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setError('صيغة الملف غير مدعومة. الرجاء رفع CSV أو XLSX.');
      return;
    }
    if (f.size / 1024 / 1024 > MAX_SIZE_MB) {
      setError(`حجم الملف يتجاوز ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    });

    try {
      setUploading(true);
      setProgress(0);
      // POST كـ FormData لـ /analyses/upload/ (يقابل /api/upload عندك)
      // الـ Authorization Header يُضاف تلقائياً عبر axiosInstance interceptor
      const result = await analysisService.uploadFile(f, setProgress);
      setAnalysis(result);
    } catch (err) {
      setError(err.userMessage || 'فشل رفع الملف، حاول مرة أخرى.');
      setFile(null);
      setAnalysis(null);
    } finally {
      setUploading(false);
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
        <span className={styles.breadcrumbActive}>Upload Dataset</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={`${styles.title} ${isDark ? styles.textWhite : styles.textDark}`}>
            Upload Your Dataset
          </h2>
          <p className={styles.subtitle}>Upload a CSV or Excel file to start AI-powered analysis</p>
        </div>
        <img src={uploadPic} alt="" className={styles.headerPic} />
      </div>

      {/* Drag & Drop */}
      <div className={styles.section}>
        <div
          className={`${styles.dropZone} ${isDark ? styles.dropDark : styles.dropLight} ${dragging ? styles.dragging : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <img src={uploadFileIcon} alt="upload" width={37} height={46} />
          <p className={`${styles.dropTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
            Drag & Drop your file here
          </p>
          {isDark && <p className={styles.orText}>or</p>}
          <button className={styles.browseBtn} onClick={() => inputRef.current.click()}>
            Browse Files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>
      </div>

      {/* Uploaded File */}
      {file && (
        <div className={styles.section}>
          <p className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
            Uploaded File
          </p>
          <div className={`${styles.fileCard} ${isDark ? styles.fileCardDark : styles.fileCardLight}`}>
            <div className={styles.fileRow}>
              <img src={excelIcon} alt="excel" width={33} height={33} />
              <div className={styles.fileInfo}>
                <span className={`${styles.fileName} ${isDark ? styles.textWhite : styles.textDark}`}>
                  {file.name}
                </span>
                <span className={styles.fileMeta}>
                  {uploading
                    ? `جاري الرفع... ${progress}%`
                    : `${file.size} · ${analysis?.rows_count ?? analysis?.rows ?? '...'} rows · ${analysis?.columns_count ?? analysis?.columns ?? '...'} columns`}
                </span>
              </div>
              {uploading ? (
                <span className={styles.fileMeta}>{progress}%</span>
              ) : (
                <CheckCircle size={20} color="#1AEE80" />
              )}
            </div>
            {uploading && (
              <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: 'rgba(150,150,150,0.2)' }}>
                <div style={{ width: `${progress}%`, height: '100%', borderRadius: 4, background: '#1AEE80', transition: 'width .2s' }} />
              </div>
            )}
            <div className={styles.removeRow}>
              <Trash2 size={14} color="#CD3956" />
              <span
                className={styles.removeText}
                onClick={() => { setFile(null); setAnalysis(null); setError(null); }}
              >
                Remove File
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.section}>
          <p style={{ color: '#CD3956', fontSize: 13 }}>{error}</p>
        </div>
      )}

      {/* File Requirements */}
      <div className={styles.section}>
        <p className={`${styles.sectionTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
          File Requirements
        </p>
        <div className={`${styles.reqCard} ${isDark ? styles.reqCardDark : styles.reqCardLight}`}>
          {[
            { icon: reqIcon1, bg: isDark ? '#201E51' : '#F3F0FD', title: 'Supported formats: CSV, XLSX', desc: 'Make sure your file is in one of the supported formats.' },
            { icon: reqIcon2, bg: isDark ? '#153155' : '#EEF9FE', title: 'Structured tabular data', desc: 'Your file should contain row and columns with headers.' },
            { icon: reqIcon3, bg: isDark ? '#123035' : '#EDF9F5', title: 'Maximum file size: 50MB', desc: 'Files larger than 50MB are not supported.' },
          ].map((r, i) => (
            <div key={i} className={styles.reqRow}>
              <div className={styles.reqIconBox} style={{ background: r.bg }}>
                <img src={r.icon} alt="" width={19} height={18} />
              </div>
              <div className={styles.reqInfo}>
                <span className={`${styles.reqTitle} ${isDark ? styles.textWhite : styles.textDark}`}>
                  {r.title}
                </span>
                <span className={styles.reqDesc}>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className={styles.section}>
        <button
          className={styles.continueBtn}
          onClick={() => onContinue(analysis, file)}
          disabled={!analysis || uploading}
          style={{ opacity: analysis && !uploading ? 1 : 0.5 }}
        >
          Continue to Review Data
          <ArrowRight size={14} color="#FFFFFF" />
        </button>
      </div>

    </div>
  );
}