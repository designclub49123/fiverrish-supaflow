
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import RazorpayInit from './components/ui/RazorpayInit.tsx'

createRoot(document.getElementById("root")!).render(
  <>
    <RazorpayInit />
    <App />
  </>
);
