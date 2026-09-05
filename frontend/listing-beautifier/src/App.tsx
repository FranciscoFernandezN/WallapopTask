import { Routes, Route } from 'react-router-dom';
import { BeautifyScreen } from './screens/BeautifyScreen.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BeautifyScreen />} />
    </Routes>
  );
}

export default App;
