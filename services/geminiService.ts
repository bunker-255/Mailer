import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not defined in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEmailSubject = async (context: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Не удалось подключиться к AI";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Создай привлекательную, короткую тему письма (subject line) для email-рассылки на тему: "${context}". Ответ должен содержать только текст темы, без кавычек и лишних слов.`,
    });
    return response.text?.trim() || "Новая рассылка";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Новая рассылка";
  }
};

export const improveText = async (currentText: string, tone: 'professional' | 'friendly' | 'sales'): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return currentText;

  let promptTone = "";
  switch (tone) {
    case 'professional': promptTone = "деловой и профессиональный"; break;
    case 'friendly': promptTone = "дружелюбный и теплый"; break;
    case 'sales': promptTone = "продающий и убедительный"; break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Перепиши следующий текст для email-рассылки, сделав его более ${promptTone}. Сохрани HTML форматирование (если есть <br> или <b>). Текст: "${currentText}"`,
    });
    return response.text?.trim() || currentText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return currentText;
  }
};

export const generateImagePrompt = async (description: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "https://picsum.photos/600/300";

  // Note: For this demo, we use Gemini to create a keyword for picsum or placeholder.
  // In a real scenario with image generation capabilities, we would call generateImages.
  // Here we just ask Gemini for a relevant keyword to append to a placeholder URL.
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me a single English keyword representing this concept for a stock photo search: "${description}". No explanations.`,
    });
    const keyword = response.text?.trim().toLowerCase().replace(/\s+/g, '-') || "business";
    // Using a reliable placeholder service with the keyword implies random image
    // Since picsum doesn't support keywords directly in the simple URL, we just return a standard placeholder
    // But realistically we would use the keyword for Unsplash API or similar.
    // For this strict environment, we stick to standard picsum.
    return `https://picsum.photos/seed/${keyword}/600/300`;
  } catch (error) {
    return "https://picsum.photos/600/300";
  }
};
