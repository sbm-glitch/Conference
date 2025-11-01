import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config({ path: "../../.env" });

sendEmail("debasissadhu629@gmail.com", "Test Email", "<h1>It works 🎉</h1>");
