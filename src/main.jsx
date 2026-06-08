import { ViteReactSSG } from 'vite-react-ssg';
import routes from './routes';
import './index.css';

export const createRoot = ViteReactSSG(
  { routes, basename: '/Charity' },
  async ({ isClient }) => {
    // AOS uses DOM APIs — only initialise on the client, never during SSG build
    if (isClient) {
      const [{ default: AOS }, aosCss] = await Promise.all([
        import('aos'),
        import('aos/dist/aos.css'),
      ]);
      AOS.init({ duration: 800, once: true });
    }
  }
);
