# PRD: Gherkin Test Case Generator

## Objetivo
Aplicación web que recibe una descripción funcional en texto libre y genera casos de prueba en formato Gherkin (happy path, negativos y edge cases) usando la API de Gemini. Proyecto de portafolio comercial que demuestra integración de QA + IA.

---

## Stack técnico

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | React (Vite) | Mínimo, sin overhead de Next.js |
| IA | Google Gemini API (gemini-1.5-flash) | Gratuito, suficiente |
| Hosting | Vercel | Gratuito, despliegue automático desde GitHub |
| Repo | GitHub | Control de versiones + GitHub Pages para perfil |
| Estilos | Tailwind CSS CDN | Sin build step adicional |

---

## Arquitectura

```
[React App - Vercel]
       |
       | fetch POST
       v
[Vercel Serverless Function /api/generate]
       |
       | API call
       v
[Google Gemini API]
```

La API key de Gemini vive en Vercel como variable de entorno. Nunca expuesta en el frontend.

---

## Estructura de archivos

```
gherkin-generator/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # Componente principal
│   ├── components/
│   │   ├── InputPanel.jsx    # Textarea de input
│   │   └── OutputPanel.jsx   # Display de Gherkin generado
│   └── main.jsx
├── api/
│   └── generate.js      # Serverless function Vercel
├── .env.local           # GEMINI_API_KEY (local, no subir)
├── .gitignore
├── package.json
└── vite.config.js
```

---

## Funcionalidad exacta

### Input
- Textarea de texto libre
- Placeholder: "Describe la funcionalidad que quieres testear. Ejemplo: El usuario puede iniciar sesión con email y contraseña."
- Botón "Generar casos de prueba"
- Estado de carga visible mientras espera respuesta

### Output
- 3 a 5 casos de prueba en formato Gherkin puro
- Tipos: happy path + casos negativos + edge cases
- Idioma: inglés
- Botón "Copiar al portapapeles"

### Formato Gherkin esperado en output
```gherkin
Feature: [nombre derivado del input]

  Scenario: [happy path]
    Given ...
    When ...
    Then ...

  Scenario: [caso negativo]
    Given ...
    When ...
    Then ...

  Scenario: [edge case]
    Given ...
    When ...
    Then ...
```

---

## Prompt a Gemini (en la serverless function)

```
You are a QA engineer expert in BDD and Gherkin syntax.
Given the following functional description, generate between 3 and 5 test cases in Gherkin format.
Include: at least one happy path, one negative case, and one edge case.
Output only valid Gherkin. No explanations, no markdown fences, no extra text.

Functional description:
{userInput}
```

---

## Serverless function: /api/generate.js

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'No input provided' });

  const prompt = `You are a QA engineer expert in BDD and Gherkin syntax.
Given the following functional description, generate between 3 and 5 test cases in Gherkin format.
Include: at least one happy path, one negative case, and one edge case.
Output only valid Gherkin. No explanations, no markdown fences, no extra text.

Functional description:
${description}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  res.status(200).json({ result: text });
}
```

---

## Componente App.jsx (estructura)

```jsx
import { useState } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input })
      });
      const data = await res.json();
      setOutput(data.result);
    } catch {
      setError('Error al conectar con la API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Gherkin Test Case Generator</h1>
      <InputPanel value={input} onChange={setInput} onGenerate={handleGenerate} loading={loading} />
      {error && <p>{error}</p>}
      {output && <OutputPanel output={output} />}
    </main>
  );
}
```

---

## Pasos de despliegue

1. `npm create vite@latest gherkin-generator -- --template react`
2. Crear estructura de archivos según árbol anterior
3. Crear repo en GitHub y subir
4. Conectar repo a Vercel (import project)
5. En Vercel > Settings > Environment Variables: añadir `GEMINI_API_KEY`
6. Deploy automático

---

## Perfil GitHub

- Repo público con README que explica el proyecto, stack y enlace a demo en Vercel
- README incluye captura de pantalla y ejemplo de output
- Enlace a demo en bio de GitHub

---

## Lo que este proyecto demuestra al cliente

| Capacidad | Evidencia |
|---|---|
| Integración de IA en producto real | Gemini API funcionando |
| QA y conocimiento de Gherkin/BDD | Output válido y útil |
| Fullstack React | Frontend funcional desplegado |
| Buenas prácticas de seguridad | API key en servidor, nunca en cliente |
| Capacidad de despliegue | Demo pública funcional en Vercel |
