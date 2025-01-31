import './utils/webrtc-polyfill';
import 'webrtc-adapter';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
