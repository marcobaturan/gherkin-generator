/**
 * InputPanel component.
 * Provides a textarea for the user to describe the feature
 * and a button to trigger Gherkin generation.
 *
 * @param {Object}   props
 * @param {string}   props.value      - Current textarea content.
 * @param {Function} props.onChange    - Callback invoked with the new text value.
 * @param {Function} props.onGenerate - Callback invoked when the user clicks Generate.
 * @param {boolean}  props.loading    - Whether a generation request is in progress.
 */
export default function InputPanel({ value, onChange, onGenerate, loading }) {
    return (
        <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 shadow-xl shadow-black/20">
            <label
                htmlFor="description-input"
                className="block text-sm font-semibold text-gray-300 mb-2"
            >
                Functional Description
            </label>

            <textarea
                id="description-input"
                className="w-full h-36 rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition resize-none"
                placeholder="Describe the feature you want to test. Example: The user can log in with email and password."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500">
                    The AI will generate 3–5 Gherkin scenarios (happy path, negative &amp; edge cases).
                </p>

                <button
                    id="generate-button"
                    onClick={onGenerate}
                    disabled={loading || !value.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {loading ? <LoadingSpinner /> : <GenerateIcon />}
                    {loading ? 'Generating…' : 'Generate Test Cases'}
                </button>
            </div>
        </section>
    );
}

/** Small spinning indicator shown while the API call is in progress. */
function LoadingSpinner() {
    return (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

/** Sparkle icon shown on the generate button in its idle state. */
function GenerateIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" />
        </svg>
    );
}
