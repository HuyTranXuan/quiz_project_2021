======OVERVIEW==========
This is an application where you can add and answer questions. Any logged in user using the
application can add questions, add answer options and take quiz answering
question that everyone contributed.

You can start using the application by registering at /auth/register. Note that email(must be unique) and password must be at least 4 characters long. After that
you can just log in using the link /auth/login. After successful login you will
be redirected to the path /questions where it will show your questions.

In here you can add more question or take a look into each question options. The question title and text must be at least 1 character long. Clicking the question title will lead you to the /questions/:id path where you can add options.

Here you can add options to your question. The option text must be at least 1 character long and you can also set correctness with a check box. There are also button for you to delete the options or in the case of no option left, you can delete the question itself with this button.

You can take the quiz with the button on the navigation bar or following the path /quiz. Here the quiz will randomly give you question that are collected from all the users .

You can take a look at the statistic by using the button on the navigation bar or following the path /statistics.

Take note that all of the function above required registration beforehand.

The application provides an API that allows asking for a random question and for answering that random question.

The API have two end points. First is GET request to the path /api/questions/random and you will get a randomly selected questions back in JSON format. Here is an example:
 {
  "questionId": 1,
  "questionTitle": "Some arithmetics",
  "questionText": "How much is 1+1?",
  "answerOptions": [
    { "optionId": 1, "optionText": "2" },
    { "optionId": 2, "optionText": "4" },
    { "optionId": 3, "optionText": "6" },
  ]
} 
If there are no questions, the returned document is empty.

Second is a POST request to the path /api/questions/answer with a JSON document that contains the id of the question and the id of the answer option. Here is an example:
{
  "questionId": 1,
  "optionId": 3,
} .
This indicate your answer id (3) to the question with the id (1). The respone is a JSON document with a boolean attribute 'correct' that will let you know you are right or wrong.

======DATABASE CONFIGURATION INSTRUCTION==========
The application use a database with the following code:
 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password CHAR(60)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(256) NOT NULL,
  question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false
);

CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  question_answer_option_id INTEGER REFERENCES question_answer_options(id),
  correct BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON users((lower(email)));

======RUN THE APPLICATION LOCALLY INSTRUCTION==========
To run the app locally you need to open the terminal windown, navigate to the root folder of the application and run the line: "deno run --allow-all --unstable run-locally.js" After that you can run the app by accessing the port 7777.

======RUN THE APPLICATION TEST INSTRUCTION==========
To run the app locally you need to open the terminal windown, navigate to the root folder of the application and run the line: "deno test --allow-all --unstable"
