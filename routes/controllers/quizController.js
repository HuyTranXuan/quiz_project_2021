import * as quizService from "../../services/quizService.js";
import * as questionService from "../../services/questionService.js";

const selectQuestions = async ({ response }) => {
  const questions = await quizService.listQuestions();
  const random = Math.floor(Math.random() * questions.length);
  response.redirect(`/quiz/${questions[random].id}`);
};

const listQuestion = async ({ request, render }) => {
  const id = request.url.pathname.split("/")[2];
  const questions = await quizService.listQuestion(id);
  render("quiz.eta", {
    question: questions,
    options: await questionService.getAnswerOptionsByQuestionId(id),
  });
};

const saveOption = async ({ request, response, user }) => {
  const questionId = request.url.pathname.split("/")[2];
  const optionId = request.url.pathname.split("/")[4];
  const correct = await questionService.getAnswerOptionById(optionId);
  await quizService.saveOption(
    user.id,
    questionId,
    optionId,
    correct.is_correct,
  );
  if (correct.is_correct) {
    response.redirect(`/quiz/${questionId}/correct`);
  } else {
    response.redirect(`/quiz/${questionId}/incorrect`);
  }
};

const chooseCorrectly = ({ render }) => {
  render("correct.eta");
};
const chooseIncorrectly = async ({ request, render }) => {
  const questionId = request.url.pathname.split("/")[2];
  const correctOption = await questionService.listCorrectOption(questionId);
  render("incorrect.eta", { option: correctOption });
};

export {
  chooseCorrectly,
  chooseIncorrectly,
  listQuestion,
  saveOption,
  selectQuestions,
};
