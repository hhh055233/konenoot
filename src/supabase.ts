import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient("https://idicusqbptilkywujwcd.supabase.co","sb_publishable_NFNvTAM13C_hOtuer23DhA_bz4tdcxb",{auth:{storage:AsyncStorage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}});
