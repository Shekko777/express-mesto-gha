const cardModel = require('../models/card'); // Модель карты
const {
  cardValidationError,
  cardCastError,
  cardNotValidId,
  defaultError,
} = require('../utils/constants');

// Получить карточки;
module.exports.getCards = (req, res) => {
  cardModel.find()
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch((err) => {
      res.status(defaultError.statusCode).send({ message: `${defaultError.message} ${err.name}` });
    });
};

// Создать карточку;
module.exports.createCard = (req, res) => {
  cardModel.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ _id: card._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(cardValidationError.statusCode).send(
          { message: cardValidationError.message },
        );
      }
      return res.status(defaultError.statusCode).send({ message: defaultError.message });
    });
};

// Удалить карточку;
module.exports.deleteCard = async (req, res) => {
  cardModel.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(cardCastError.statusCode).send({ message: cardCastError.message });
      } else if (err.message === 'notValidId') {
        res.status(cardNotValidId.statusCode).send({ message: cardNotValidId.message });
      } else {
        res.satatus(defaultError.statusCode).send({ message: defaultError.message });
      }
    });
};

// Поставить лайк;
module.exports.likeCard = (req, res) => {
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
        res.status(cardCastError.statusCode).send({ message: cardCastError.message });
      } else if (err.message === 'notValidId') {
        res.status(cardNotValidId.statusCode).send({ message: cardNotValidId.message });
      } else {
        res.status(defaultError.statusCode).send({ message: defaultError.message });
      }
    });
};

// Удалит лайк карточки;
module.exports.unlikeCard = (req, res) => {
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
        res.status(cardCastError.statusCode).send({ message: cardCastError.message });
      } else if (err.message === 'notValidId') {
        res.status(cardNotValidId.statusCode).send({ message: cardNotValidId.message });
      } else {
        res.status(defaultError.statusCode).send({ message: defaultError.message });
      }
    });
};
