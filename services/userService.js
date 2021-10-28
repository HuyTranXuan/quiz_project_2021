import { executeQuery } from "../database/database.js";

const addUser = async (email, password) => {
  await executeQuery(
    `INSERT INTO users
      (email, password)
        VALUES ($1, $2)`,
    email,
    password,
  );
};
const findUserByEmail = async (email) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );

  return result.rows;
};
const findUserById = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE id = $1",
    id,
  );

  return result.rows[0];
};
export { addUser, findUserByEmail, findUserById };
