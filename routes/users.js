const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  changeUserProfile,
  changeUserAvatar,
  getMeInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), getUserById);
router.get('/users/me', getMeInfo);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUserProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(www\.)?.+#?/),
  }),
}), changeUserAvatar);

module.exports = router;
