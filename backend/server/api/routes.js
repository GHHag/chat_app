const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/sse', controller.sse);

router.post('/user/register', controller.registerUser);
router.post('/user/login', controller.loginUser);
router.get('/user/login', controller.getLoggedInUser);
router.delete('/user/logout', controller.logoutUser);
router.post('/user/block/:id', controller.blockUser);

router.get('/chats/:id', controller.getChats);

router.post('/chat/create', controller.createChat);
router.post('/chat/invite/:id', controller.inviteToChat);
router.post('/chat/accept-invite/:id', controller.acceptChatInvite);
router.post('/chat/ban/:id', controller.banFromChat);
router.post('/chat/message', controller.sendMessage);
router.get('/chat/messages/:id', controller.getChatMessages);
router.delete('/chat/delete-message/:id', controller.deleteMessage);

module.exports = router;