const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

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

app.use((req, res, next) => {
  req.user = {
    _id: '65806c6b10112c0d85bed55b',
  };

  next();
});
app.use(appRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен'); // Проверка работы сервера при обновлении;
});
