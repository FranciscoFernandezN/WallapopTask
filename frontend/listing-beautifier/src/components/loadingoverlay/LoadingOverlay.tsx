import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Blocks, Comment, Radio } from 'react-loader-spinner';
import './LoadingOverlay.css';

const SPINNER_KEYS = ['loading.spinner1', 'loading.spinner2', 'loading.spinner3'];
const SPINNER_COMPONENTS = [Blocks, Comment, Radio];

export function LoadingOverlay() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * 3));

  useEffect(() => {
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPINNER_COMPONENTS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CurrentSpinner = SPINNER_COMPONENTS[currentIndex];
  const currentText = t(SPINNER_KEYS[currentIndex]);

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <CurrentSpinner
          height="80"
          width="80"
          colors={['#13C1AC', '#0fa896', '#16e6ce']}
          ariaLabel="loading"
        />
        <p className="loading-text">{currentText}</p>
      </div>
    </div>
  );
}
