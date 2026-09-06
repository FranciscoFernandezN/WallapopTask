import { Routes, Route } from 'react-router-dom';
import { BeautifyScreen } from './screens/beautifyscreen/BeautifyScreen.tsx';
import { Header } from './components/header/Header.tsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<BeautifyScreen />} />
      </Routes>
    </>
  );
}

export default App;
