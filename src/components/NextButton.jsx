function NextButton({ dispatch, answer, numQuestions, questionsAnswered }) {
  if (answer === null) {
    return null;
  }

  if (questionsAnswered < numQuestions) {
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "nextQuestion" })}>
        Next
      </button>
    );
  }

  if (questionsAnswered === numQuestions) {
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "finish" })}>
        Finish
      </button>
    );
  }
}

export default NextButton;
