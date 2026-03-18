import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { Chatbot } from '@/components/common/Chatbot';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
        <Chatbot />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
