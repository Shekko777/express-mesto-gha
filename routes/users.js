const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  changeUserProfile,
  changeUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', changeUserProfile);
router.patch('/users/me/avatar', changeUserAvatar);

module.exports = router;
