/**
 * Vercel Serverless Function: /api/generate
 *
 * Receives a POST request with { description },
 * calls the Google Gemini API with a BDD/Gherkin prompt,
 * and returns the generated test cases.
 *
 * Environment variable required:
 *   GEMINI_API_KEY — Google Generative AI API key
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Builds the BDD prompt for Gemini.
 *
 * @param {string} description - The user-provided functional description.
 * @returns {string} The full prompt sent to the model.
 */
function buildPrompt(description) {
    return [
        'You are a QA engineer expert in BDD and Gherkin syntax.',
        'Given the following functional description, generate between 3 and 5 test cases in Gherkin format.',
        'Include: at least one happy path, one negative case, and one edge case.',
        'Output only valid Gherkin. No explanations, no markdown fences, no extra text.',
        '',
        'Functional description:',
        description,
    ].join('\n');
}

/**
 * Calls the Gemini API and extracts the generated text.
 *
 * @param {string} prompt  - The full prompt to send.
 * @param {string} apiKey  - The Gemini API key.
 * @returns {Promise<string>} The model-generated text.
 */
async function callGemini(prompt, apiKey) {
    const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
    }

    try {
        const prompt = buildPrompt(description);
        const result = await callGemini(prompt, apiKey);
        return res.status(200).json({ result });
    } catch (err) {
        console.error('Generation failed:', err);
        return res.status(502).json({ error: 'Failed to generate test cases. Please try again.' });
    }
}
