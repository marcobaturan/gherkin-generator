import { readFileSync } from 'fs';
import { createServer } from 'http';
import handler from './api/generate.js';

/**
 * Local development API server.
 *
 * Loads environment variables from .env.local and serves
 * the /api/generate endpoint on port 3001, so the Vite
 * dev proxy can forward requests to it.
 *
 * Usage: node dev-server.js
 */

/** Loads key=value pairs from .env.local into process.env. */
function loadEnvFile() {
    try {
        const content = readFileSync('.env.local', 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.slice(0, eqIndex);
            const value = trimmed.slice(eqIndex + 1);
            process.env[key] = value;
        }
        console.log('✓ Loaded .env.local');
    } catch {
        console.error('✗ Could not read .env.local');
    }
}

/**
 * Parses the JSON body from an incoming request.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<Object>}
 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch { reject(new Error('Invalid JSON')); }
        });
    });
}

loadEnvFile();

const PORT = 3001;

const server = createServer(async (req, res) => {
    /* CORS headers for local dev */
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    if (req.url === '/api/generate' && req.method === 'POST') {
        try {
            req.body = await parseBody(req);
        } catch {
            req.body = {};
        }

        /* Minimal Vercel-like response wrapper */
        const fakeRes = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; },
            json(data) {
                res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            },
            end() { res.writeHead(this.statusCode); res.end(); },
        };

        return handler(req, fakeRes);
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`✓ Local API server running on http://localhost:${PORT}`);
    console.log(`  Gherking_API_KEY: ${process.env.Gherking_API_KEY ? '✓ loaded' : '✗ MISSING'}`);
});
