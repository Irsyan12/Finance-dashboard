// File ini untuk generate CRON_SECRET
// Jalankan sekali untuk dapat random secret key

export default function handler(req, res) {
  // Generate random secret (32 characters)
  const secret = Array.from({ length: 32 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");

  res.status(200).json({
    secret,
    message:
      "Copy this secret and add as CRON_SECRET environment variable in Vercel",
    instructions: [
      "1. Copy the secret above",
      "2. Go to Vercel Dashboard > Your Project > Settings",
      "3. Go to Environment Variables tab",
      "4. Add new variable: CRON_SECRET = [paste secret]",
      "5. Redeploy your project",
    ],
  });
}
