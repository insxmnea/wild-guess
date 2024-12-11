import { FC, useState } from "react";
import styles from "./HomePage.module.scss";
import axios from "axios";

export const HomePage: FC = () => {
  const [question, setQuestion] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [newAnimal, setNewAnimal] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [distinguishingFeature, setDistinguishingFeature] =
    useState<string>("");

  const startGame = async () => {
    const response = await axios.get("http://localhost:5000/start");
    setQuestion(response.data.question);
    setPath([]);
    setResult(null);
    setAnswer(null);
  };

  const handleAnswer = async (answer: string) => {
    const response = await axios.post("http://localhost:5000/next", {
      path,
      answer,
    });
    if (response.data.result) {
      setResult(response.data.result);
    } else {
      setQuestion(response.data.question);
      setPath([...path, answer]);
    }
  };

  const addAnimal = async () => {
    await axios.post("http://localhost:5000/add", {
      path,
      newAnimal,
      newQuestion,
      distinguishingFeature,
    });
    alert("Животное добавлено!");
    startGame();
  };

  return (
    <div className={styles.wrapper}>
      {!question && !result && <button onClick={startGame}>Начать игру</button>}

      {!result && question && (
        <div className={styles.container}>
          <p>{question}</p>
          <div className={styles.answers}>
            <button onClick={() => handleAnswer("yes")}>Да</button>
            <button onClick={() => handleAnswer("no")}>Нет</button>
          </div>
        </div>
      )}

      {result && (
        <div>
          <p>Ваше животное: {result}</p>
          <button onClick={startGame}>Заново</button>
          <button
            onClick={() => setQuestion("Введите новое животное и вопрос")}
          >
            Загадали другое животное?
          </button>
        </div>
      )}

      {question === "Введите новое животное и вопрос" && (
        <div>
          <input
            type="text"
            placeholder="Животное"
            value={newAnimal}
            onChange={(e) => setNewAnimal(e.target.value)}
          />
          <input
            type="text"
            placeholder="Отличие"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button onClick={addAnimal}>Добавить</button>
        </div>
      )}
    </div>
  );
};
