const cardModel = require('../models/card'); // Модель карты

// Получить карточки;
module.exports.getCards = (req, res) => {
  cardModel.find()
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка по умолчанию ${err.name}` });
    });
};

// Создать карточку;
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel.create({ name, link, owner: req.user._id }, { new: true, runValidators: true })
    .then((card) => {
      console.log(card);
      res.status(201).send({ id: card._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// Удалить карточку;
module.exports.deleteCard = async (req, res) => {
  cardModel.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным айди не найдена' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id карточки' });
      }
      return res.satatus(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// Поставить лайк;
module.exports.likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(201).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// Удалит лайк карточки;
module.exports.unlikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
