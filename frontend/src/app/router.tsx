import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routes/public.routes';
import { privateRoutes } from './routes/private.routes';

export const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);
