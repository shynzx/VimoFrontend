import express, { ErrorRequestHandler } from 'express';
import { DatabaseService } from './config/database';
import { CardsController } from './controllers/CardsController';
import { CharactersController } from './controllers/CharactersController';
import { EnemyRepository } from './repositories/EnemyRepository';
import { InfrastructureRepository } from './repositories/InfrastructureRepository';
import { GuideResourceController } from './controllers/GuideResourceController';

export function createApp() {
  if (!['postgres', 'demo'].includes(process.env.DATA_MODE || 'postgres')) {
    throw new Error('DATA_MODE debe ser postgres o demo.');
  }
  if (process.env.NODE_ENV === 'production' && process.env.DATA_MODE === 'demo') {
    throw new Error('El modo demo no está permitido en producción.');
  }
  const app = express();
  app.disable('x-powered-by');
  app.set('query parser', 'simple');
  app.use((_req, res, next) => {
    if (process.env.WEB_ORIGIN) {
      res.setHeader('Access-Control-Allow-Origin', process.env.WEB_ORIGIN);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  const db = DatabaseService.getInstance();
  app.get('/health', async (_req, res) => {
    const demo = process.env.DATA_MODE === 'demo';
    const healthy = demo || await db.checkHealth();
    res.status(healthy ? 200 : 503).json({ success: healthy, data: { mode: demo ? 'demo' : 'postgres', database: demo ? 'disabled' : healthy ? 'up' : 'down' } });
  });
  app.use('/api/v1', (_req, res, next) => {
    res.locals.demo = process.env.DATA_MODE === 'demo' || process.env.CATALOG_STATUS !== 'approved';
    const json = res.json.bind(res);
    res.json = (body) => json({ ...body, meta: { demo: res.locals.demo } });
    next();
  });
  const cards = new CardsController();
  const characters = new CharactersController();
  app.get('/api/v1/cards', cards.getAll);
  app.get('/api/v1/cards/:id', cards.getById);
  app.get('/api/v1/characters', characters.getAll);
  app.get('/api/v1/characters/:id', characters.getById);

  const enemies = new GuideResourceController(new EnemyRepository());
  const infrastructure = new GuideResourceController(new InfrastructureRepository());
  app.get('/api/v1/enemies', enemies.getAll);
  app.get('/api/v1/enemies/:id', enemies.getById);
  app.get('/api/v1/infrastructure', infrastructure.getAll);
  app.get('/api/v1/infrastructure/:id', infrastructure.getById);
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ruta no encontrada.' } });
  });
  const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error('[API]', error);
    res.status(503).json({ success: false, error: { code: 'SERVICE_UNAVAILABLE', message: 'El servicio no está disponible. Inténtalo nuevamente.' } });
  };
  app.use(handleError);
  return app;
}
