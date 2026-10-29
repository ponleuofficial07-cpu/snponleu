import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function askGeminiAssistant(
  prompt: string,
  history: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; error?: string }> {
  try {
    const ai = getAIClient();
    if (!ai) {
      return {
        text: 'The AI Chatbot is currently waiting for a configured Gemini API Key in the environment secrets. In the meantime, you can explore SN Ponleu’s projects, software tools, and tutorials on the website or reach out directly through the Contact page.',
        error: 'NO_API_KEY',
      };
    }

    const systemInstruction = `You are the official AI Assistant for "SN PONLEU — Personal Digital Hub".
SN Ponleu is an experienced ICT Specialist and Creative Designer based in Phnom Penh, Cambodia.
Your capabilities:
1. Answer questions about SN Ponleu's background, education (RUPP, NIPTICT), certifications (CCNA, CompTIA Security+, Google Cloud), projects (Nimbus Cloud Console, Smart ICT Diagnostic, Khmer Typography Hub), downloadable software tools, and professional services.
2. Provide concise, expert troubleshooting advice for Windows (e.g., 100% disk usage, driver errors, startup optimization), computer hardware (RAM testing, SSD health, thermal maintenance), network configurations (VLAN, Wi-Fi mesh, MikroTik routers), and web development (React, TypeScript, Node.js).
3. Support bilingual inquiries: answer fluently in both Khmer and English depending on the language used by the visitor.
4. Maintain a polite, professional, and helpful tone.
5. Remind users when relevant that they can request services or submit inquiries directly on the Contact or Services pages.`;

    // Construct contents from recent history + new prompt
    const contents: any[] = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const timeoutPromise = new Promise<{ text: string }>((_, reject) =>
      setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), 10000)
    );

    const callPromise = ai.models
      .generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
        },
      })
      .then((res) => ({
        text: res.text || 'I apologize, but I could not generate a response at this moment.',
      }));

    const response = (await Promise.race([callPromise, timeoutPromise])) as { text: string };
    return { text: response.text };
  } catch (error: any) {
    console.error('Gemini API execution error:', error);
    return {
      text: 'SN Ponleu is an experienced ICT Specialist & Creative Designer. Feel free to explore his portfolio, ICT tutorials, and software tools directly on the platform or get in touch via the Contact page.',
      error: error?.message || 'GEMINI_ERROR',
    };
  }
}
