import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import MouseParallax from "./MouseParallax.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MouseParallax />
  </StrictMode>,
)
