const bcrypt = require('bcrypt'); // Для хеширования паролей
const jwt = require('jsonwebtoken'); // Для создания токена
const userModel = require('../models/user'); // Модель пользователя
const UserValidationError = require('../errors/UserValidationError');
const UserNotValidId = require('../errors/UserNotValidId');
const BusyEmail = require('../errors/BusyEmail');
const InvalidLogin = require('../errors/InvalidLogin');

// Получить всех пользователей;
module.exports.getUsers = (req, res, next) => {
  userModel.find()
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

// Получить пользователя по ID;
module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  userModel.findById(id)
    .orFail(new Error('notValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UserValidationError('Переданы некорректные данные'));
      } else if (err.message === 'notValidId') {
        next(new UserNotValidId('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

// Получить информацию о пользователе
module.exports.getMeInfo = (req, res) => {
  const { _id } = req.user;

  userModel.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw Promise.reject(new Error('Не удалось получить пользователя'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(444).send({ err });
    });
};

// Регистрация;
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserValidationError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new BusyEmail('Пользователь с таким Email уже существует'));
      }
      next(err);
    });
};

// Обновление профиля;
module.exports.changeUserProfile = (req, res, next) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('notValidId'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserValidationError('Переданы некорректные данные'));
      } else if (err.message === 'notValidId') {
        next(new UserNotValidId('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

// Обновление аватара;
module.exports.changeUserAvatar = (req, res, next) => {
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('notValidId'))
    .then((user) => {
      console.log(user.avatar);
      return res.status(200).send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserValidationError('Переданы некорректные данные'));
      } else if (err.message === 'notValidId') {
        next(new UserNotValidId('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

// Логин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new InvalidLogin('Неправильный email или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new InvalidLogin('Неправильный email или пароль');
        }

        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ jwt: token, users: user });
    })
    .catch(next);
};
