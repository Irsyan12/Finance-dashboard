import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Only allow POST requests from Vercel Cron
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify cron secret (optional but recommended)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ping database dengan query sederhana
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase ping error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    console.log("✅ Supabase pinged successfully");

    return res.status(200).json({
      success: true,
      message: "Supabase database pinged successfully",
      timestamp: new Date().toISOString(),
      dataCount: data?.length || 0,
    });
  } catch (error) {
    console.error("Ping error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
