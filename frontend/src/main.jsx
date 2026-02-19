import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import './index.css'
// import App from './App.jsx'
import ErrorBoundary from './components/Common/ErrorBoundary.jsx'
import { LoadingSpinner } from './components/ui'
import { ThemeProvider } from './hooks/useTheme'

const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner size="lg" /></div>}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
