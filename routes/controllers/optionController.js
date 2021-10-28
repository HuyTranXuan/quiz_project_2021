import * as questionService from "../../services/questionService.js";
import * as quizService from "../../services/quizService.js";
import { validasaur } from "../../deps.js";
const optionValidationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};
const getOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const id = request.url.pathname.split("/")[2];

  return {
    id: id,
    correct: params.has("is_correct"),
    text: params.get("option_text"),
  };
};
const addOption = async ({ request, response, render, user }) => {
  const optionData = await getOptionData(request);
  const senderQuestionsPool = await questionService.getQuestionInfoByUserId(
    user.id,
  );
  let ok = false;
  senderQuestionsPool.forEach((ele) => {
    if (ele.id == optionData.id) ok = true;
  });
  if (!ok) response.status = 401;
  else {
    const [passes, errors] = await validasaur.validate(
      optionData,
      optionValidationRules,
    );
    if (!passes) {
      optionData.validationErrors = errors;
      optionData.options = await questionService.getAnswerOptionsByQuestionId(
        optionData.id,
      );
      optionData.question = await questionService.getQuestionInfoById(
        optionData.id,
      );
      render("question.eta", optionData);
    } else {
      await questionService.addOption(
        optionData.id,
        optionData.text,
        optionData.correct,
      );
      response.redirect(`/questions/${optionData.id}`);
    }
  }
};
const deleteOption = async ({ response, request, user }) => {
  const id = request.url.pathname.split("/")[4];
  const questionId = request.url.pathname.split("/")[2];
  const senderQuestionsPool = await questionService.getQuestionInfoByUserId(
    user.id,
  );
  let ok = false;
  senderQuestionsPool.forEach((ele) => {
    if (ele.id == questionId) ok = true;
  });
  if (!ok) response.status = 401;
  else {
    await quizService.deleteAnswer(id);
    await questionService.deleteOption(id);
    response.redirect(`/questions/${request.url.pathname.split("/")[2]}`);
  }
};

export { addOption, deleteOption };
