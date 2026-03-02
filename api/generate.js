/**
 * Vercel Serverless Function: /api/generate
 *
 * Receives a POST request with { description },
 * calls the Groq API with a BDD/Gherkin prompt,
 * and returns the generated test cases.
 *
 * Environment variable required:
 *   Gherking_API_KEY — Groq API key
 */

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Builds the BDD system prompt for the model.
 *
 * @returns {string} The system-level instruction.
 */
function buildSystemPrompt() {
    return [
        'You are a QA engineer expert in BDD and Gherkin syntax.',
        'Given a functional description, generate between 3 and 5 test cases in Gherkin format.',
        'Include: at least one happy path, one negative case, and one edge case.',
        'Output only valid Gherkin. No explanations, no markdown fences, no extra text.',
    ].join('\n');
}

/**
 * Calls the Groq API and extracts the generated text.
 *
 * @param {string} description - The user-provided functional description.
 * @param {string} apiKey      - The Groq API key.
 * @returns {Promise<string>}  The model-generated Gherkin text.
 */
async function callGroq(description, apiKey) {
    const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: buildSystemPrompt() },
                { role: 'user', content: `Functional description:\n${description}` },
            ],
            temperature: 0.4,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

/**
 * Main request handler for the /api/generate endpoint.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { description } = req.body || {};

    if (!description || !description.trim()) {
        return res.status(400).json({ error: 'No input provided' });
    }

    const apiKey = process.env.Gherking_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'Server misconfiguration: missing API key. Expected env var: Gherking_API_KEY',
        });
    }

    try {
        const result = await callGroq(description, apiKey);
        return res.status(200).json({ result });
    } catch (err) {
        console.error('Generation failed:', err);
        return res.status(502).json({ error: 'Failed to generate test cases. Please try again.' });
    }
}
