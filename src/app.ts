import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
const corsOptions = {
  origin: [
    "https://9d27-2a0e-9cc0-23f4-d00-d824-6183-c845-2759.ngrok.io",
    "https://api.monday.com/v2",
    "https://api.monday.com/v2/file",
    "https://esl-monday-for-outlook-portal.herokuapp.com",
    "https://esl-subscription-services.herokuapp.com",
    "https://a74851e61fef69a2.cdn2.monday.app",
  ],
  methods: ["GET", "PUT", "POST", "HEAD", "DELETE", "OPTIONS"],
  preflightContinue: false,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(routes);
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);

export default app;
