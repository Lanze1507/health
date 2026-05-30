import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

const genAI = new GoogleGenerativeAI(apiKey);

export async function preguntarIA(
  pregunta: string
) {

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompt = `
Eres un entrenador fitness llamado HealthUp Coach.

Responde de forma breve, amigable y práctica.

Pregunta:
${pregunta}
`;

  const result =
    await model.generateContent(prompt);

  return result.response.text();
}