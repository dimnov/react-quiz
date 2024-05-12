function StartScreen({ numQuestions, dispatch }) {
  const handleStart = (category) => {
    dispatch({ type: "loadingCategory", payload: category });
    dispatch({ type: "start" });
  };

  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React knowledge</h3>
      <button className="btn btn-ui" onClick={() => handleStart("easy")}>
        Start Easy
      </button>
      <button className="btn btn-ui" onClick={() => handleStart("medium")}>
        Start Medium
      </button>
      <button className="btn btn-ui" onClick={() => handleStart("hard")}>
        Start Hard
      </button>
      <button className="btn btn-ui" onClick={() => handleStart("")}>
        Start All
      </button>
    </div>
  );
}

export default StartScreen;
