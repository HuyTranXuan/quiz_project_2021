import { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
import { app } from ".././app.js";
import { executeQuery } from "../database/database.js";

let testQuestionId = 0;
let testOptionId = 0;
Deno.test({
  name: "Test 1:GET request to /questions is redirected to /auth/login",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/questions")
      .expect(302).expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Test 2:GET request to /quiz is redirected to /auth/login",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/quiz")
      .expect(302).expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Test 3:GET request to /statistics is redirected to /auth/login",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/statistics")
      .expect(302).expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Test 4:GET request to /api/questions/random return a JSON object",
  fn: async () => {
    const testClient = await superoak(app);
    const a = await testClient.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
    testQuestionId = a.body.questionId;
    testOptionId = a.body.answerOptions[0].optionId;
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Test 5:POST request to /api/questions/answer return a JSON object",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({ questionId: testQuestionId, optionId: testOptionId })
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Test 6:POST request to /auth/register with email and password <4 char",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.post("/auth/register")
      .send(`email=${Math.floor(1000 * Math.random())}`)
      .send(`password=${Math.floor(1000 * Math.random())}`)
      .expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name:
    "Test 7:POST request to /auth/register is redirected to /auth/login, indicate successful registration.",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.post("/auth/register")
      .send(`email=test@email`)
      .send(`password=test-password`)
      .expect(302).expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name:
    "Test 8:POST request to /auth/register with already use email address is not redirected to /auth/login, got status 200, indicate unsuccessful registration.",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.post("/auth/register")
      .send(`email=test@email`)
      .send(`password=test-password`)
      .expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name:
    "Test 9:POST request to /auth/login with legitimate info is redirected to /question, indicate successful login.",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.post("/auth/login")
      .send(`email=test@email`)
      .send(`password=test-password`)
      .expect(302).expect("Redirecting to /questions.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name:
    "Test 10:POST request to /auth/login with wrong is not redirected to /question, got status 200, indicate unsuccessful login.",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.post("/auth/login")
      .send(`email=${Math.floor(1000 * Math.random())}`)
      .send(`password=${Math.floor(1000 * Math.random())}`)
      .expect(200);
    //clean up the database
    await executeQuery(
      "DELETE FROM users WHERE email ='test@email'",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
