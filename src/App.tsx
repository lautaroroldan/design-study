import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ContentErrorScreen } from './components/ContentErrorScreen';
import { contentError } from './content';
import { Home } from './pages/Home';
import { Mixed } from './pages/Mixed';
import { NotFound } from './pages/NotFound';
import { Progress } from './pages/Progress';
import { Section } from './pages/Section';
import { Session } from './pages/Session';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'gof', element: <Section topic="gof" /> },
      { path: 'solid', element: <Section topic="solid" /> },
      { path: 'grasp', element: <Section topic="grasp" /> },
      { path: 'mixto', element: <Mixed /> },
      { path: 'progreso', element: <Progress /> },
      { path: 'sesion', element: <Session /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  if (contentError) {
    return <ContentErrorScreen error={contentError} />;
  }

  return <RouterProvider router={router} />;
}
