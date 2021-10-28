import { executeQuery } from "../database/database.js";

const addQuestion = async (userId, title, question_text) => {
  await executeQuery(
    `INSERT INTO questions
      (user_id, title, question_text)
        VALUES ($1, $2, $3)`,
    userId,
    title,
    question_text,
  );
};
//Old name: listQuestions
const getQuestionInfoByUserId = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM questions WHERE user_id = $1`,
    id,
  );

  return res.rows;
};
//Old name: showQuestion
const getQuestionInfoById = async (id) => {
  const res = await executeQuery(`SELECT * FROM questions WHERE id = $1`, id);
  return res.rows[0];
};
const addOption = async (question_id, option_text, is_correct) => {
  await executeQuery(
    `INSERT INTO question_answer_options 
      (question_id , option_text , is_correct )
        VALUES ($1, $2, $3)`,
    question_id,
    option_text,
    is_correct,
  );
};
//Old name: listOptions
const getAnswerOptionsByQuestionId = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options  WHERE question_id = $1`,
    id,
  );
  return res.rows;
};
//Old name: listOption
const getAnswerOptionById = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options  WHERE id = $1`,
    id,
  );
  return res.rows[0];
};
const listCorrectOption = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options WHERE question_id = $1 AND is_correct = true`,
    id,
  );
  return res.rows[0];
};
const deleteOption = async (id) => {
  await executeQuery(
    `DELETE FROM question_answer_options WHERE id =$1`,
    id,
  );
};
const deleteQuestion = async (id) => {
  await executeQuery(
    `DELETE FROM questions WHERE id =$1`,
    id,
  );
};
export {
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  getAnswerOptionById,
  getAnswerOptionsByQuestionId,
  getQuestionInfoById,
  getQuestionInfoByUserId,
  //getQuestionListByUserId,
  listCorrectOption,
};
