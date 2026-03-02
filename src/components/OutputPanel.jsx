import { useState } from 'react';

/**
 * OutputPanel component.
 * Displays the generated Gherkin output and provides
 * a "Copy to clipboard" button with visual feedback.
 *
 * @param {Object} props
 * @param {string} props.output - The generated Gherkin text to display.
 */
export default function OutputPanel({ output }) {
    const [copied, setCopied] = useState(false);

    /** Copies the Gherkin output to the system clipboard. */
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* Fallback: silently fail if clipboard API is unavailable */
        }
    };

    return (
        <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 shadow-xl shadow-black/20 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-300">
                    Generated Test Cases
                </h2>

                <button
                    id="copy-button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-700 bg-gray-800 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
            </div>

            <pre className="whitespace-pre-wrap break-words rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-4 text-sm text-green-300 font-mono leading-relaxed overflow-x-auto">
                {output}
            </pre>
        </section>
    );
}

/** Clipboard icon shown before copying. */
function CopyIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    );
}

/** Checkmark icon shown after a successful copy. */
function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
