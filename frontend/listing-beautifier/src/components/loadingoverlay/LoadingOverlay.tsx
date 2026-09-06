import { useState, useEffect } from 'react';
import { Blocks, Comment, Radio } from 'react-loader-spinner';
import './LoadingOverlay.css';

const SPINNERS = [
  {
    component: Blocks,
    text: 'Downloading the best ideas from the cloud',
  },
  {
    component: Comment,
    text: 'Asking a very complex robot',
  },
  {
    component: Radio,
    text: 'Tuning the channel to the best ideas\' frequency',
  },
];

export function LoadingOverlay() {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * 3));

  useEffect(() => {
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPINNERS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CurrentSpinner = SPINNERS[currentIndex].component;
  const currentText = SPINNERS[currentIndex].text;

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
