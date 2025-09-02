import { createClient } from "@supabase/supabase-js";
import { Database } from "./database/types";

/*
npx supabase gen types --project-id xdbkvtcjyuiuqeitqtqr > src/supabase/database/types.ts
*/

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

export { supabase };
