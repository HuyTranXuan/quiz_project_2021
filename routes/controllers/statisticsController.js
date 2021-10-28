import * as statisticsService from "../../services/statisticsService.js";
import * as questionService from "../../services/questionService.js";
import * as userService from "../../services/userService.js";

const countCorrectAnswers = async (id) => {
  const answersGiven = await statisticsService.getInfoByUserId(id);
  let correctAnswersCount = 0;
  answersGiven.forEach((answer) => {
    //Did I answer? and if I did, is it a correct one?
    if (answer && answer.correct) {
      correctAnswersCount++;
    }
  });
  return correctAnswersCount;
};

const countAnswersRecived = async (id) => {
  const myQuestions = await questionService.getQuestionInfoByUserId(id);
  let answersRecivedCount = 0;
  for (const question of myQuestions) {
    const answers = await statisticsService.getInfoByQuestionId(question.id);
    if (answers && answers.length > 0) answersRecivedCount += answers.length;
  }
  return answersRecivedCount;
};

const topFiveMostAnsweredQuestions = async () => {
  const mostAnsweredQuestions = await statisticsService.getFrequency();
  const topFiveUserId = new Set();
  const topFiveUser = [];
  let count = 0;
  for (const question of mostAnsweredQuestions) {
    const info = await questionService.getQuestionInfoById(
      question.question_id,
    );
    if (count < 5 && !topFiveUserId.has(info.user_id)) {
      count++;
      topFiveUserId.add(info.user_id);
      const tmp = await userService.findUserById(info.user_id);
      tmp.count = question.count;
      topFiveUser.push(tmp);
    }
  }

  return topFiveUser;
};

const showUserStatistics = async ({ render, user }) => {
  const myID = user.id;
  const answersGiven = await statisticsService.getInfoByUserId(myID);
  const correctAnswersCount = await countCorrectAnswers(myID);
  const answersRecivedCount = await countAnswersRecived(myID);
  const topUsers = await topFiveMostAnsweredQuestions();

  //-----Top 5 Most Answered Questions-----{

  //-----Top 5 Most Answered Questions-----}

  render("statistics.eta", {
    answersGiven: answersGiven,
    correctAnswersCount: correctAnswersCount,
    answersRecivedCount: answersRecivedCount,
    topUsers: topUsers,
  });
};
export { showUserStatistics };
