import { useEffect } from 'react';
import { useAppSelector } from './hooks';
import { translateText } from '../lib/translator';
import type { RootState } from '../store/store';

export function useAutoTranslate(
  originalTexts: Record<string, string>,
  apply: (key: string, translated: string) => void
) {
  const idioma = useAppSelector((state: RootState) => state.auth.user?.configuracion.idioma);

  useEffect(() => {
    if (idioma === 'EN') {
        Object.entries(originalTexts).forEach(async ([key, text]) => {
            const tr = await translateText(text, 'en');
            apply(key, tr);
        })
    } else {
        Object.entries(originalTexts).forEach(([key, text]) => apply(key, text))
    }
  }, [idioma])
}
