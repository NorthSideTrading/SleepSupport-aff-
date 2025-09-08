import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files (CSS, JS, JSON, images)
  app.use('/assets', express.static(path.resolve(import.meta.dirname, '..', 'assets')));
  app.use('/data', express.static(path.resolve(import.meta.dirname, '..', 'data')));

  // Serve the static HTML pages
  const rootDir = path.resolve(import.meta.dirname, '..');

  // Serve robots.txt and sitemap.xml from root
  app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(rootDir, 'robots.txt'));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(rootDir, 'sitemap.xml'));
  });

  // Development affiliate redirects (mirrors netlify.toml)
  app.get('/go/sleeplean', (req, res) => {
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const targetUrl = `https://cf5ebf3dm3ebet5fu7lly4ni33.hop.clickbank.net/?tid=ssgsleeplean${queryString ? '&' + queryString : ''}`;
    res.redirect(302, targetUrl);
  });

  app.get('/go/yu-sleep', (req, res) => {
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const targetUrl = `https://1472fk1mi-gfcr5uzm-7iobsf8.hop.clickbank.net/?tid=ssgyusleep${queryString ? '&' + queryString : ''}`;
    res.redirect(302, targetUrl);
  });

  app.get('/go/pitch-black', (req, res) => {
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const targetUrl = `https://9009080lm5n6fm9iqp6nyo5zaz.hop.clickbank.net/?tid=ssgpitchblack${queryString ? '&' + queryString : ''}`;
    res.redirect(302, targetUrl);
  });

  // Serve specific page routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
  });

  app.get('/sleep/devices/', (req, res) => {
    res.sendFile(path.join(rootDir, 'sleep', 'devices', 'index.html'));
  });

  app.get('/sleep/supplements/', (req, res) => {
    res.sendFile(path.join(rootDir, 'sleep', 'supplements', 'index.html'));
  });

  // Fallback to home page for unmatched routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
