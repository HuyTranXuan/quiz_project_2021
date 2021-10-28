import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as optionController from "./controllers/optionController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as quizApi from "./apis/quizApi.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/questions", questionController.listQuestions);
router.post("/questions", questionController.addQuestion);
router.get("/questions/:id", questionController.showQuestion);
router.post("/questions/:id/options", optionController.addOption);
router.post(
  "/questions/:id/options/:optionId/delete",
  optionController.deleteOption,
);
router.post("/questions/:id/delete", questionController.deleteQuestion);
router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);
router.get("/quiz", quizController.selectQuestions);
router.get("/quiz/:id", quizController.listQuestion);
router.post(
  "/quiz/:id/options/:optionId",
  quizController.saveOption,
);
router.get("/quiz/:id/incorrect", quizController.chooseIncorrectly);
router.get("/quiz/:id/correct", quizController.chooseCorrectly);
router.get("/statistics", statisticsController.showUserStatistics);

router.get("/api/questions/random", quizApi.listQuestion);
router.post("/api/questions/answer", quizApi.checkAnswer);

export { router };
