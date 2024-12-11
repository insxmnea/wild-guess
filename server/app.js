const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const loadQuestions = () => {
  const filePath = path.join(__dirname, "data.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

let questionsTree = loadQuestions();

app.get("/start", (req, res) => {
  res.json({ question: questionsTree.value });
});

app.post("/next", (req, res) => {
  const { path, answer } = req.body;
  let currentNode = questionsTree;

  for (const direction of path) {
    currentNode = currentNode[direction];

    if (!currentNode) {
      return res.status(400).json({ error: "Invalid path" });
    }
  }

  if (answer === "yes") {
    if (currentNode.yes) {
      res.json({ question: currentNode.yes.value });
    } else {
      res.json({ result: currentNode.value });
    }
  } else if (answer === "no") {
    if (currentNode.no) {
      res.json({ question: currentNode.no.value });
    } else {
      res.json({ result: currentNode.value });
    }
  } else {
    res.status(400).json({ error: "Answer must be yes or no" });
  }
});

app.post("/add", (req, res) => {
  const { newAnimal, newQuestion, distinguishingFeature } = req.body;
  let currentNode = questionsTree;

  for (const direction of req.body.path) {
    currentNode = currentNode[direction];
    if (!currentNode) {
      return res.status(400).json({ error: "Invalid path" });
    }
  }

  const oldAnimal = currentNode.value;
  currentNode.value = newQuestion;
  currentNode.yes = { value: newAnimal, yes: null, no: null };
  currentNode.no = { value: oldAnimal, yes: null, no: null };

  res.json({ message: "New animal and question added successfully" });

  fs.writeFileSync(
    path.join(__dirname, "data.json"),
    JSON.stringify(questionsTree, null, 2),
    "utf-8"
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
