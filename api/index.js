import handler from "../backend/index.js";

// Vercel will call the default export as the handler for incoming requests
export default async function (req, res) {
  return handler(req, res);
}
