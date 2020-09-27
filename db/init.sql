CREATE TABLE articles (
  id serial PRIMARY KEY,
  title varchar (355) NOT NULL,
  lead varchar (355),
  body varchar NOT NULL,
  image_url varchar,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  modified_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (60) UNIQUE
);

CREATE TABLE articles_categories (
  article_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR (60) UNIQUE NOT NULL,
  password VARCHAR (60),
  email varchar (100) NOT NULL,
  first_name VARCHAR (60),
  last_name VARCHAR (60)
);

CREATE TABLE articles_users (
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content VARCHAR NOT NULL,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE articles_comments (
  article_id INTEGER NOT NULL,
  comment_id INTEGER NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (comment_id) REFERENCES comments(id)
)
