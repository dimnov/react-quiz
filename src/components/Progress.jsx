function Progress({ numQuestions, points, totalPoints, questionsAnswered }) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={questionsAnswered} />
      <p>
        Question <strong>{questionsAnswered}</strong>/{numQuestions}
      </p>

      <p>
        <strong>{points}</strong>/{totalPoints}
      </p>
    </header>
  );
}

export default Progress;
