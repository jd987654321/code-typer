import { createClient } from "@supabase/supabase-js";
import { Database } from "./database/types";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

export { supabase };
