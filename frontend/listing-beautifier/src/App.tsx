import { Routes, Route } from 'react-router-dom';
import { BeautifyScreen } from './screens/beautifyscreen/BeautifyScreen.tsx';
import { Header } from './components/header/Header.tsx';

/**
 * Root application component.
 *
 * Renders the persistent header and a single route (`/`) for the beautifier screen.
 */
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
