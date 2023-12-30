const cardModel = require('../models/card'); // Модель карты
const CardValidationError = require('../errors/CardValidationError');
const CardCastError = require('../errors/CardCastError');
const CardNotValidId = require('../errors/CardNotValidId');

// Получить карточки;
module.exports.getCards = (req, res, next) => {
  cardModel.find()
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch(next);
};

// Создать карточку;
module.exports.createCard = (req, res, next) => {
  cardModel.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ _id: card._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CardValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удалить карточку;
module.exports.deleteCard = async (req, res, next) => {
  cardModel.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CardCastError('Невалидный id карточки'));
      } else if (err.message === 'notValidId') {
        next(new CardNotValidId('Карточка с указанным айди не найдена'));
      } else {
        next(err);
      }
    });
};

// Поставить лайк;
module.exports.likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CardCastError('Невалидный id карточки'));
      } else if (err.message === 'notValidId') {
        next(new CardNotValidId('Карточка с указанным айди не найдена'));
      } else {
        next(err);
      }
    });
};

// Удалит лайк карточки;
module.exports.unlikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CardCastError('Невалидный id карточки'));
      } else if (err.message === 'notValidId') {
        next(new CardNotValidId('Карточка с указанным айди не найдена'));
      } else {
        next(err);
      }
    });
};
