CREATE DATABASE perntodo OWNER postgres;

CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255)
);