import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import { useReducer } from "react";
import Loader from "./components/Loader.jsx";
import Error from "./components/Error.jsx";
import StartScreen from "./components/StartScreen.jsx";
import Question from "./components/Question.jsx";
import NextButton from "./components/NextButton.jsx";
import Progress from "./components/Progress.jsx";
import FinishScreen from "./components/FinishScreen.jsx";
import Footer from "./components/Footer.jsx";
import Timer from "./components/Timer.jsx";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "ready",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
  questionsAnswered: 1,
  category: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      // eslint-disable-next-line no-case-declarations
      const shuffledQuestions = action.payload.sort(() => Math.random() - 0.5);
      return {
        ...state,
        questions: shuffledQuestions,
        displayedIndices: [],
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        displayedIndices: [0],
      };
    case "newAnswer":
      // eslint-disable-next-line no-case-declarations
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption ? state.points + question.points : state.points,
        questionsAnswered: state.questionsAnswered + 1, // Increment the number of questions answered
      };
    case "nextQuestion":
      // eslint-disable-next-line no-case-declarations
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * state.questions.length);
      } while (state.displayedIndices.includes(randomIndex));

      // eslint-disable-next-line no-case-declarations
      const newDisplayedIndices = [...state.displayedIndices, randomIndex];

      return {
        ...state,
        index: randomIndex,
        answer: null,
        displayedIndices: newDisplayedIndices,
      };
    case "finish":
      return { ...state, status: "finished", answer: null };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 1 ? "finished" : state.status,
      };
    case "loadingCategory":
      return {
        ...state,
        status: "loading",
        category: action.payload,
      };
    default:
      throw new Error("Action is unknown");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, secondsRemaining, questionsAnswered, category },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const totalPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(() => {
    console.log(category);
    if (category) {
      let url = `http://localhost:4000/questions?category=${category}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "dataReceived", payload: data });
          dispatch({ type: "start" });
        })
        .catch(() => dispatch({ type: "dataFailed" }));
    }
  }, [category]);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
              questionsAnswered={questionsAnswered}
            />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
                questionsAnswered={questionsAnswered}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen points={points} totalPoints={totalPoints} dispatch={dispatch} />
        )}
      </Main>
    </div>
  );
}

export default App;
