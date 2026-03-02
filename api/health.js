/**
 * Vercel Serverless Function: /api/health
 *
 * Diagnostic endpoint to verify the deployment
 * and check if environment variables are configured.
 */
export default function handler(req, res) {
    const hasKey = !!process.env.Gherking_API_KEY;

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        envCheck: {
            Gherking_API_KEY: hasKey ? 'set' : 'MISSING',
        },
    });
}
