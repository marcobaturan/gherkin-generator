/**
 * Vercel Serverless Function: /api/health
 *
 * Diagnostic endpoint to verify the deployment
 * and check if environment variables are configured.
 */
export default function handler(req, res) {
    const hasKey = !!process.env.Gherking_API_KEY || !!process.env.Gherkin_API_KEY;
    const envKeys = Object.keys(process.env).sort();

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        envCheck: {
            Gherking_API_KEY: !!process.env.Gherking_API_KEY ? 'set' : 'MISSING',
            Gherkin_API_KEY: !!process.env.Gherkin_API_KEY ? 'set' : 'MISSING',
        },
        availableKeys: envKeys,
    });
}
