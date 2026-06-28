import { useAuth } from '../context/AuthContext'
import { TRANSLATIONS } from './translations'

export function useTranslation() {
  const { language } = useAuth()
  
  const t = (text) => {
    // Basic translation function
    // Matches the exact english string to the translated string
    if (!TRANSLATIONS[text]) return text
    return TRANSLATIONS[text][language] || TRANSLATIONS[text]['en'] || text
  }
  
  return { t, language }
}
