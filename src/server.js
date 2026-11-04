import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db.js";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 3000;

connectDB()

app.listen(PORT, () => {
  console.log(`The server is listening at http://localhost:${PORT}`);
});
