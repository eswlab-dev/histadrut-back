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
    "https://f46e-2a0e-9cc0-24cb-7e00-115e-fe2d-b1c7-26d3.ngrok.io",
    "https://api.monday.com/v2",
    "https://api.monday.com/v2/file",
    "https://esl-monday-for-outlook-portal.herokuapp.com",
    "https://esl-subscription-services.herokuapp.com",
    "https://73f27810e675a2cb.cdn2.monday.app",
    "https://bcf5c023070d0461.cdn2.monday.app",
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
