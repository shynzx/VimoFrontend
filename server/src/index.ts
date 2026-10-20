import { createApp } from './app';
import { DatabaseService } from './config/database';

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválido.');
const server = createApp().listen(port, process.env.HOST || '127.0.0.1', () => {
  console.log(`VIMO API iniciada en puerto ${port}; modo ${process.env.DATA_MODE || 'postgres'}.`);
});
let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  server.close(() => {
    void DatabaseService.getInstance().close().then(() => {
      clearTimeout(timeout);
      process.exitCode = 0;
    }).catch(() => { process.exitCode = 1; });
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
