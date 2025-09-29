const express = require("express");
const path = require("path");
const app = express();

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route for SPA (React Router, etc.)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
