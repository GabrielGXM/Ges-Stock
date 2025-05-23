import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// --- Mantenha estes CONSOLE.LOGS para depuração! ---
console.log('DEBUG SUPABASE CLIENT - URL:', supabaseUrl);
console.log('DEBUG SUPABASE CLIENT - Anon Key Loaded:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO CRÍTICO SUPABASE: Supabase URL ou Anon Key NÃO ESTÃO DEFINIDOS! Verifique .env e utils/supabase.ts.');
  // REMOVA OU COMENTE QUALQUER LINHA 'return;' OU 'throw new Error(...);' AQUI
  // Exemplo: // throw new Error('Supabase credentials missing');
}
// --------------------------------------------------

export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      storage: undefined, // Clerk gerencia o storage
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);