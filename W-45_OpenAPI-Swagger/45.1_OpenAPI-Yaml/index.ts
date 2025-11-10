import swaggerUi from "swagger-ui-express";
import express from "express";
import { YAML } from "bun";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

const yamlFile = fs.readFileSync("./spec.yml", "utf-8");
const swaggerDocument = YAML.parse(yamlFile) as any;

app.use(cors());

app.use("/api-docs", swaggerUi.serve);
app.use("/api-docs", swaggerUi.setup(swaggerDocument));

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  res.send("User signed up successfully!");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  res.json({
    message: "User signed in successfully!",
    token: "dummy-token-1984798",
  });
});

app.post("/todo", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send("Title and description are required");
  }
  res.json({
    message: "Todo created successfully!",
    id: "1",
  });
});

app.get("/todos", (req, res) => {
  res.json([
    {
      id: "1",
      title: "Sample Todo",
      description: "This is a sample todo item.",
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});