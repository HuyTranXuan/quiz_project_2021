import { executeQuery } from "../database/database.js";

const listQuestions = async () => {
  const res = await executeQuery(
    `SELECT * FROM questions `,
  );

  return res.rows;
};
const listQuestion = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM questions WHERE id = $1`,
    id,
  );

  return res.rows[0];
};
const saveOption = async (userId, questionId, optionId, correct) => {
  await executeQuery(
    `INSERT INTO question_answers  
      (user_id, question_id, question_answer_option_id, correct)
        VALUES ($1, $2, $3, $4)`,
    userId,
    questionId,
    optionId,
    correct,
  );
};
const deleteAnswer = async (id) => {
  await executeQuery(
    `DELETE FROM question_answers WHERE question_answer_option_id =$1`,
    id,
  );
};
export { deleteAnswer, listQuestion, listQuestions, saveOption };
