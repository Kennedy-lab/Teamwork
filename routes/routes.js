const express = require('express');
const router = express.Router();


const auth = require('../authorization/auth');
const routeController = require('../controllers/controllers');
const upload = require('../filehandler/multer-config');
//const multerUploads = require('../filehandler/multer-config');

router.post('/auth/create-user', auth, routeController.createUser);
router.post('/auth/signin', routeController.userSignin);
router.post('/gifs', routeController.postGif);
router.post('/articles', routeController.postArticles);
router.get('/articles/:articleID', routeController.getOneArticle);
router.get('/gifs/:gifID', routeController.getOneGif);
router.post('/articles/:articleID/comment', routeController.commentOnArticle);
router.post('/gifs/:gifID/comment', routeController.commentOnGif);
router.patch('/articles/:articleID', routeController.updateArticle);
router.delete('/articles/:articleID', routeController.deleteArticle);
router.delete('/gifs/:gifID', routeController.deleteGif);
router.get('/feed', routeController.getFeed);
router.get('/feed/articles', routeController.getArticles);
router.get('/feed/gifs', routeController.getGifs);

module.exports = router;