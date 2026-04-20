import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { Chatbot } from '@/components/common/Chatbot';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
        <Chatbot />
        <Toaster position="top-right" expand={true} richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
