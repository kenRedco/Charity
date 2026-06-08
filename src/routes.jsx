import { lazy, Suspense } from 'react';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import LoadingFallback from './components/LoadingFallback';

// Wrap lazy component in Suspense for code-splitting
const s = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const Home         = lazy(() => import('./pages/Home'));
const Donate       = lazy(() => import('./pages/Donate'));
const About        = lazy(() => import('./pages/About'));
const Impact       = lazy(() => import('./pages/Impact'));
const Contact      = lazy(() => import('./pages/Contact'));
const PrivacyPolicy   = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService  = lazy(() => import('./pages/TermsOfService'));
const HowItWorks   = lazy(() => import('./pages/HowItWorks'));

// ScrollToTop is moved inside App's route so it has router context.
// We inline it here so vite-react-ssg's RouterProvider wraps it correctly.
const AppWithScroll = () => (
  <>
    <ScrollToTop />
    <App />
  </>
);

const routes = [
  {
    path: '/',
    element: <AppWithScroll />,
    children: [
      { index: true,          element: s(Home) },
      { path: 'donate',       element: s(Donate) },
      { path: 'about',        element: s(About) },
      { path: 'impact',       element: s(Impact) },
      { path: 'contact',      element: s(Contact) },
      { path: 'privacy',      element: s(PrivacyPolicy) },
      { path: 'terms',        element: s(TermsOfService) },
      { path: 'process',      element: s(HowItWorks) },
    ],
  },
];

export default routes;
