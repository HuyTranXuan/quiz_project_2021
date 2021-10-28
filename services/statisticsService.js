import { executeQuery } from "../database/database.js";

const getInfoByUserId = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answers WHERE user_id = $1`,
    id,
  );

  return res.rows;
};
const getInfoByQuestionId = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answers WHERE question_id = $1`,
    id,
  );

  return res.rows;
};
const getFrequency = async () => {
  const res = await executeQuery(
    `SELECT COUNT(id),question_id
    FROM question_answers GROUP By question_id 
    ORDER BY COUNT(id) DESC`,
  );

  return res.rows;
};
export { getFrequency, getInfoByQuestionId, getInfoByUserId };
