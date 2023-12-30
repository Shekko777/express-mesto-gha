const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const appRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

// Коннект к серверу;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('mongod connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json()); // Перевод данных в JSON через express;
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(appRouter);
app.use(errors());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || 'Ошибка на сервере по умолчанию';
  res.status(statusCode).send({ message: errMessage });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен'); // Проверка работы сервера при обновлении;
});
