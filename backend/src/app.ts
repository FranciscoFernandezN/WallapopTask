import express, { type Express } from 'express';
import cors from 'cors';
import { env, getFrontendUrl } from './utils/env.ts';
import beautifierRoutes from './routes/beautifier.routes.ts';

const app: Express = express();

app.use(cors({ origin: getFrontendUrl() }));
app.use(express.json());

app.use(beautifierRoutes);

app.listen(env.backendPort);

export default app;
