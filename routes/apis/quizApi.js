import * as quizService from "../../services/quizService.js";
import * as questionService from "../../services/questionService.js";

const selectQuestions = async () => {
  const questions = await quizService.listQuestions();
  const random = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[random].id;
  return selectedQuestion;
};
const listQuestion = async ({ response }) => {
  const id = await selectQuestions();
  if (id) {
    const questions = await quizService.listQuestion(id);
    const options = await questionService.getAnswerOptionsByQuestionId(id);
    const answerOptions = [];
    options.forEach((ele) => {
      answerOptions.push({ optionId: ele.id, optionText: ele.option_text });
    });
    const data = {
      questionId: questions.id,
      questionTitle: questions.title,
      questionText: questions.question_text,
      answerOptions: answerOptions,
    };
    response.body = data;
  } else response.body = {};
};
const checkAnswer = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const content = await body.value;
  const correct = await questionService.getAnswerOptionById(content.optionId);
  const data = { correct: correct.is_correct };
  response.body = data;
};

export { checkAnswer, listQuestion };
