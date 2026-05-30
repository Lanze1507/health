import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

const genAI = new GoogleGenerativeAI(apiKey);

export async function preguntarIA(
  pregunta: string
) {

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  const prompt = `
Eres HealthUp Coach.

Hablas en español.

Eres:
- Motivador
- Cercano
- Inteligente
- Positivo

Puedes responder cualquier tema.

Utiliza ocasionalmente emojis apropiados.

No digas que eres Gemini o Google.

Actúa siempre como el coach personal del usuario.

Pregunta:
${pregunta}
`;

  const result =
    await model.generateContent(prompt);

  return result.response.text();
}
console.log(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY
);