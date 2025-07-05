export async function translateText(text: string, target: 'es' | 'en') {
  try {
    const response = await fetch('https://libretranslate/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: target === 'en' ? 'es' : 'en',
        target,
        format: 'text',
      }),
    });
    const data = await response.json();
    return data.translatedText as string;
  } catch (error) {
    console.log(`Error traduciendo: `, error);
    return text;
  }
}
