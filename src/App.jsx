import { useState } from 'react';
import Splash from './pages/Splash/Splash';
import Login from './pages/Login/Login';
import SignIn from './pages/SignIn/SignIn';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Upload from './pages/Upload/Upload';
import Review from './pages/Review/Review';
import Loading from './pages/Loading/Loading';
import Results from './pages/Results/Results';
import Settings from './pages/Settings/Settings';


export default function App() {
  const [page, setPage] = useState('splash');
  const [theme, setTheme] = useState('dark');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  return (
    <div>
      <button
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        style={{ position: 'fixed', top: 10, right: 10, zIndex: 999, cursor: 'pointer' }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {page === 'splash' && (
        <Splash theme={theme} onFinish={() => setPage('login')} />
      )}
      {page === 'login' && (
        <Login
          theme={theme}
          onSignIn={() => setPage('signin')}
          onCreateAccount={() => setPage('register')}
        />
      )}
      {page === 'signin' && (
        <SignIn
          theme={theme}
          onLogin={() => setPage('dashboard')}
          onCreateAccount={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <Register
          theme={theme}
          onSignUp={() => setPage('dashboard')}
          onLogin={() => setPage('signin')}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard
          theme={theme}
          username="Sara"
          onNewAnalysis={() => setPage('upload')}
          onSettings={() => setPage('settings')}
          onViewAnalysis={(analysis) => {
            setSelectedAnalysis(analysis);
            setPage('results');
          }}
        />
      )}
      {page === 'upload' && (
        <Upload
          theme={theme}
          onContinue={(file, data) => {
            setUploadedFile(file);
            setUploadedData(data);
            setPage('review');
          }}
          onDashboard={() => setPage('dashboard')}
        />
      )}

      {page === 'review' && (
        <Review
          theme={theme}
          file={uploadedFile}
          fileData={uploadedData}
          onBack={() => setPage('upload')}
          onStartAnalysis={() => setPage('loading')}
          onDashboard={() => setPage('dashboard')}
          onUpload={() => setPage('upload')}
        />
      )}
      {page === 'loading' && (
        <Loading
          theme={theme}
          onFinish={() => setPage('results')}
        />
      )}
      {page === 'results' && (
        <Results
          theme={theme}
          analysis={selectedAnalysis}
          onAnalyzeAnother={() => setPage('upload')}
          onDownload={() => alert('Download PDF')}

        />
      )}
      {page === 'settings' && (
        <Settings
          theme={theme}
          onBack={() => setPage('dashboard')}
          onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        />
      )}
    </div>
  );
}