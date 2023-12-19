const userModel = require('../models/user'); // Модель пользователя

// Получить всех пользователей;
module.exports.getUsers = (req, res) => {
  userModel.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Получить пользователя по ID;
module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  userModel.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

// Создать пользователя;
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Oops: Ошибка на стороне сервера' });
    });
};

// Обновление профиля;
module.exports.changeUserProfile = (req, res) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// Обновление аватара;
module.exports.changeUserAvatar = (req, res) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      console.log(user.avatar);
      return res.status(200).send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
