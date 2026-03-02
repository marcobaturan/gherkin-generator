import { useState } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

/**
 * Calls the /api/generate endpoint with the user description.
 * Returns the generated Gherkin text.
 *
 * @param {string} description - The functional description from the user.
 * @returns {Promise<string>} The generated Gherkin output.
 * @throws {Error} If the response is not ok.
 */
async function fetchGherkin(description) {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.result;
}

/**
 * Root application component.
 * Manages the input, output, loading, and error states,
 * and orchestrates the call to the generation API.
 */
export default function App() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /** Triggers generation of Gherkin test cases from the user input. */
    const handleGenerate = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError('');
        setOutput('');

        try {
            const result = await fetchGherkin(input);
            setOutput(result);
        } catch (err) {
            setError(err.message || 'Failed to connect to the API.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20">
                        G
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Gherkin Test Case Generator
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            AI-powered BDD test case generation
                        </p>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
                <InputPanel
                    value={input}
                    onChange={setInput}
                    onGenerate={handleGenerate}
                    loading={loading}
                />

                {error && (
                    <div
                        id="error-banner"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {output && <OutputPanel output={output} />}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
                Built with React &amp; Google Gemini AI &bull; Powered by BDD best practices
            </footer>
        </div>
    );
}
