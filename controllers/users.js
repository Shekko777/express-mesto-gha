const userModel = require('../models/user'); // Модель пользователя
const {
  userValidationError,
  userNotValidId,
  defaultError,
} = require('../utils/constants');

// Получить всех пользователей;
module.exports.getUsers = (req, res) => {
  userModel.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(defaultError.statusCode).send({ message: `${defaultError.message} ${err.name}` }));
};

// Получить пользователя по ID;
module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  userModel.findById(id)
    .orFail(new Error('notValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(userValidationError.statusCode).send({ message: userValidationError.message });
      } else if (err.message === 'notValidId') {
        res.status(userNotValidId.statusCode).send({ message: userNotValidId.message });
      } else {
        res.status(defaultError.statusCode).send({ message: defaultError.message });
      }
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
        return res.status(userValidationError.statusCode).send(
          { message: userValidationError.message },
        );
      }
      return res.status(defaultError.statusCode).send({ message: defaultError.message });
    });
};

// Обновление профиля;
module.exports.changeUserProfile = (req, res) => {
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
        res.status(userValidationError.statusCode).send({ message: userValidationError.message });
      } else if (err.message === 'notValidId') {
        res.status(userNotValidId.statusCode).send({ message: userNotValidId.message });
      } else {
        res.status(defaultError.statusCode).send({ message: defaultError.message });
      }
    });
};

// Обновление аватара;
module.exports.changeUserAvatar = (req, res) => {
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
        res.status(userValidationError.statusCode).send({ message: userValidationError.message });
      } else if (err.message === 'notValidId') {
        res.status(userNotValidId.statusCode).send({ message: userNotValidId.message });
      } else {
        res.status(defaultError.statusCode).send({ message: defaultError.message });
      }
    });
};
