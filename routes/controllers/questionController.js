import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  title: [validasaur.required, validasaur.minLength(1)],
  text: [validasaur.required, validasaur.minLength(1)],
};
const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    title: params.get("title"),
    text: params.get("question_text"),
  };
};
const addQuestion = async ({ request, response, render, user }) => {
  const questionData = await getQuestionData(request);
  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );
  if (!passes) {
    questionData.validationErrors = errors;
    questionData.questions = await questionService.getQuestionInfoByUserId(
      user.id,
    );
    render("questions.eta", questionData);
  } else {
    await questionService.addQuestion(
      user.id,
      questionData.title,
      questionData.text,
    );
    response.redirect("/questions");
  }
};
const showQuestionForm = ({ render }) => {
  render("main.eta");
};
const listQuestions = async ({ render, user }) => {
  render("questions.eta", {
    questions: await questionService.getQuestionInfoByUserId(user.id),
  });
};
const showQuestion = async ({ request, response, render, user }) => {
  const id = request.url.pathname.split("/")[2];
  const senderQuestionsPool = await questionService.getQuestionInfoByUserId(
    user.id,
  );
  let ok = false;
  senderQuestionsPool.forEach((ele) => {
    if (ele.id == id) ok = true;
  });
  if (!ok) response.status = 401;
  else {
    render("question.eta", {
      question: await questionService.getQuestionInfoById(id),
      options: await questionService.getAnswerOptionsByQuestionId(id),
    });
  }
};
const deleteQuestion = async ({ response, request, user }) => {
  const id = request.url.pathname.split("/")[2];
  const senderQuestionsPool = await questionService.getQuestionInfoByUserId(
    user.id,
  );
  let ok = false;
  senderQuestionsPool.forEach((ele) => {
    if (ele.id == id) ok = true;
  });
  if (!ok) response.status = 401;
  else {
    await questionService.deleteQuestion(id);
    response.redirect(`/questions`);
  }
};
export {
  addQuestion,
  deleteQuestion,
  listQuestions,
  showQuestion,
  showQuestionForm,
};
