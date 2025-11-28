import { GoogleGenAI } from "@google/genai";
import { NewsItem, SourceLink, GroundingChunk } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Ensure process.env.API_KEY is set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const fetchDailyNews = async (): Promise<NewsItem[]> => {
  const today = new Date().toLocaleDateString('no-NO', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const sources = [
    "vg.no", "dagbladet.no", "nettavisen.no", 
    "nrk.no", "tv2.no", "document.no", 
    "inyheter.no", "aftenposten.no"
  ].join(", ");

  const prompt = `
    Jeg vil at du skal fungere som en objektiv nyhetsredaktør for en norsk nyhetstjeneste.
    
    Oppgave:
    1. Søk etter dagens viktigste nyheter (${today}) fra følgende kilder: ${sources}.
    2. Velg ut de 6-8 viktigste og mest aktuelle sakene.
    3. For hver sak:
       - Skriv en kort, fengende tittel.
       - Skriv en konsis oppsummering på 2-3 setninger.
       - Identifiser hovedkilden(e) og finn URL-en til saken hvis mulig.
       - Prøv å finne en direkte URL til et hovedbilde for saken (søk etter open graph image eller main article image). URLen må være absolutt (starte med http).
    
    4. Du MÅ formatere svaret NØYAKTIG slik for hver sak (plaintext, ingen markdown formatting i headers):
       
       ### NYSAK
       TITEL: [Skriv tittelen her]
       OPPSUMMERING: [Skriv oppsummeringen her]
       KILDE: [Navn på avis] | [URL til saken]
       BILDE: [URL til bilde]
       
       (Hvis det er flere kilder, legg til flere "KILDE:" linjer).
       (Hvis du ikke finner bilde, la BILDE stå tomt eller skriv "Ingen").
    
    Vær nøytral og saklig. Skriv på norsk (bokmål).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Parse the structured response
    const articlesRaw = text.split("### NYSAK").filter(item => item.trim().length > 0);
    
    const parsedNews: NewsItem[] = articlesRaw.map(raw => {
      const lines = raw.trim().split("\n");
      let title = "";
      let content = "";
      let imageUrl = "";
      const itemSources: SourceLink[] = [];
      
      let currentSection = "";
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.startsWith("TITEL:")) {
          title = trimmedLine.replace("TITEL:", "").trim();
          currentSection = "title";
        } else if (trimmedLine.startsWith("OPPSUMMERING:")) {
          content = trimmedLine.replace("OPPSUMMERING:", "").trim();
          currentSection = "content";
        } else if (trimmedLine.startsWith("BILDE:")) {
          const possibleUrl = trimmedLine.replace("BILDE:", "").trim();
          if (possibleUrl && possibleUrl.toLowerCase() !== "ingen" && possibleUrl.startsWith("http")) {
             imageUrl = possibleUrl;
          }
          currentSection = "image";
        } else if (trimmedLine.startsWith("KILDE:")) {
          // Parse source format: Name | URL
          const sourceRaw = trimmedLine.replace("KILDE:", "").trim();
          const parts = sourceRaw.split("|");
          
          if (parts.length >= 2) {
            itemSources.push({
              title: parts[0].trim(),
              uri: parts[1].trim()
            });
          } else if (parts.length === 1 && parts[0].startsWith("http")) {
            // Fallback if only URL is provided
            try {
              const url = new URL(parts[0].trim());
              itemSources.push({
                title: url.hostname.replace('www.', ''),
                uri: parts[0].trim()
              });
            } catch (e) {
              // Invalid URL, skip
            }
          }
          currentSection = "source";
        } else {
          // Append to content if we are in the content section and it's not a new header
          if (currentSection === "content" && !trimmedLine.startsWith("TITEL:") && !trimmedLine.startsWith("KILDE:") && !trimmedLine.startsWith("BILDE:")) {
            content += " " + trimmedLine;
          }
        }
      });
      
      return {
        title,
        content,
        sources: itemSources,
        imageUrl: imageUrl || undefined
      };
    });

    return parsedNews;

  } catch (error) {
    console.error("Feil ved henting av nyheter:", error);
    throw error;
  }
};