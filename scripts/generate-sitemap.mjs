// scripts/generate-sitemap.mjs
import { writeFileSync, existsSync, readFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || "https://sleepsupportguide.com";

// Seed routes (expand later). Never include /contact.
const seedRoutes = [
  "/", 
  "/privacy", 
  "/terms", 
  "/editorial-policy", 
  "/affiliate-disclosure",
  "/sleep/supplements/",
  "/sleep/non-pill-solutions/"
];

// Optional: pull extra routes from routes.json if present.
let extra = [];
try {
  if (existsSync("routes.json")) {
    extra = JSON.parse(readFileSync("routes.json", "utf8"));
  }
} catch { extra = []; }

// Merge, de-dupe, and hard-filter out any accidental /contact
const routes = Array.from(new Set([...seedRoutes, ...extra]))
  .filter(r => typeof r === "string" && r.trim().length > 0 && !r.startsWith("/contact"));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(r => `  <url><loc>${BASE}${r}</loc><changefreq>${r === "/" ? "daily" : "weekly"}</changefreq><priority>${r === "/" ? "1.0" : "0.7"}</priority></url>`).join("\n") +
  `\n</urlset>\n`;

if (!existsSync("public")) mkdirSync("public");
writeFileSync("sitemap.xml", xml);
writeFileSync("robots.txt",
`User-agent: *
Allow: /
Sitemap: ${BASE}/sitemap.xml
`);
console.log("✔ Generated sitemap.xml and robots.txt (no /contact).");