/**
 * Client for Google Gemini API (Google Generative AI / Gemini API)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest'];
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiGenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
}

export async function generateWithGemini(
  prompt: string,
  options: GeminiGenerateOptions = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY non configurata nelle variabili d\'ambiente.');
  }

  const primaryModel = options.model || DEFAULT_MODEL;
  const modelsToTry = [
    primaryModel,
    ...FALLBACK_MODELS.filter((m) => m !== primaryModel),
  ];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;

      const payload: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxOutputTokens ?? 1000,
        },
      };

      if (options.systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Errore chiamata Gemini (${model} HTTP ${response.status}): ${errorBody}`);
      }

      const data = (await response.json()) as any;
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return generatedText.trim();
      }
    } catch (err: any) {
      lastError = err;
      // Continue to next fallback model
    }
  }

  throw lastError || new Error('Nessun contenuto restituito da Gemini.');
}

/**
 * Genera una motivazione divertente per le paste (penalità pasticcini)
 */
export async function generatePasteReason(playerName?: string, customHint?: string): Promise<string> {
  const systemInstruction = 
    "Sei l'assistente ufficiale dello spogliatoio di una squadra di pallavolo italiana (VolleyStack). " +
    "Il tuo compito è inventare motivazioni divertenti, goliardiche ma mai offensive per assegnare la 'tassa delle paste' " +
    "(il giocatore multato deve portare paste/pasticcini al prossimo allenamento). " +
    "Sii conciso (1 o 2 frasi al massimo), spiritoso e usa termini di pallavolo (bagher, muro, pipe, rete, cartellino, invasione, battuta). " +
    "Rispondi SOLO con la motivazione generata, senza virgolette o introduzioni.";

  let prompt = "Genera una motivazione simpatica per cui un giocatore deve portare le paste.";
  if (playerName) prompt += ` Nome giocatore: ${playerName}.`;
  if (customHint) prompt += ` Spunto/episodio: ${customHint}.`;

  try {
    return await generateWithGemini(prompt, { systemInstruction, temperature: 0.8, maxOutputTokens: 200 });
  } catch {
    const fallbackReasons = [
      `Schiacciata finita dritta sull'asta con fischio arbitrale: ${playerName ? playerName + ' porta' : 'tocca portare'} le paste per farsi perdonare dallo spogliatoio!`,
      `Battuta al salto finita in tribuna tra i seggiolini: colazione offerta al prossimo allenamento per riconquistare la fiducia del mister!`,
      `Invasione netta a rete a mani basse: la commissione tecnica decreta 1kg di paste fresche per la squadra!`,
      `Palla d'attacco lisciata in pipe sotto lo sguardo allibito del coach: debito paste confermato!`
    ];
    return fallbackReasons[Math.floor(Math.random() * fallbackReasons.length)];
  }
}

/**
 * Genera una bozza di annuncio per la squadra
 */
export async function generateAnnouncementDraft(topic: string, details?: string): Promise<{ title: string; content: string }> {
  const systemInstruction = 
    "Sei il capitano o dirigente di una squadra di pallavolo su VolleyStack. " +
    "Genera un annuncio chiaro, coinvolgente e amichevole per la bacheca di squadra. " +
    "Restituisci ESCLUSIVAMENTE un JSON valido con questo formato: {\"title\": \"...\", \"content\": \"...\"}. Non aggiungere markdown code fence.";

  let prompt = `Argomento dell'annuncio: ${topic}.`;
  if (details) prompt += ` Dettagli aggiuntivi: ${details}.`;

  try {
    const raw = await generateWithGemini(prompt, { systemInstruction, temperature: 0.6, maxOutputTokens: 600 });
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      title: topic,
      content: details || `Comunicazione importante per tutta la squadra: ${topic}. Si prega di prenderne visione!`
    };
  }
}

/**
 * Genera un discorso motivazionale o consiglio del Coach
 */
export async function generateCoachSpeech(context: {
  teamName?: string;
  eventType: 'MATCH' | 'TRAINING' | 'SOCIAL';
  opponent?: string;
  notes?: string;
}): Promise<string> {
  const systemInstruction = 
    "Sei un allenatore di pallavolo carismatico, empatico ed energico (stile Velasco o De Giorgi). " +
    "Scrivi un breve discorso motivazionale pre-partita o promemoria pre-allenamento per la squadra (3-5 frasi brevi, grande impatto). " +
    "Focalizzati su concentrazione, spirito di squadra e grinta su ogni pallone.";

  const prompt = `Tipo di evento: ${context.eventType}. Squadra: ${context.teamName || 'Volley Team'}. ` +
    (context.opponent ? `Avversario: ${context.opponent}. ` : '') +
    (context.notes ? `Note/focus tattico: ${context.notes}` : '');

  try {
    return await generateWithGemini(prompt, { systemInstruction, temperature: 0.8, maxOutputTokens: 350 });
  } catch {
    return context.eventType === 'MATCH'
      ? `Ragazzi, oggi si entra in campo a testa alta e con gli occhi di chi ha fame. Ogni palla che tocca terra dal nostro lato è una palla persa solo se non ci abbiamo creduto fino all'ultimo tuffo. Copertura a muro, battuta aggressiva e voce: facciamo vedere chi siamo!`
      : `Massima concentrazione fin dal riscaldamento! Gli automatismi che proviamo oggi sono i punti che faremo sabato in partita. Intensità, grinta e supporto reciproco su ogni scambio!`;
  }
}
