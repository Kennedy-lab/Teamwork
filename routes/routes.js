const express = require('express');
const router = express.Router();


const auth = require('../authorization/auth');
const routeController = require('../controllers/controllers');
const upload = require('../filehandler/multer-config');
//const multerUploads = require('../filehandler/multer-config');

router.post('/auth/create-user', auth, routeController.createUser);
router.post('/auth/signin', routeController.userSignin);
router.post('/gifs', auth, routeController.postGif);
router.post('/articles', auth, routeController.postArticles);
router.get('/articles/:articleID', auth, routeController.getOneArticle);
router.get('/gifs/:gifID', auth, routeController.getOneGif);
router.post('/articles/:articleID/comment', auth, routeController.commentOnArticle);
router.post('/gifs/:gifID/comment', auth, routeController.commentOnGif);
router.patch('/articles/:articleID', auth, routeController.updateArticle);
router.delete('/articles/:articleID', auth, routeController.deleteArticle);
router.delete('/gifs/:gifID', auth, routeController.deleteGif);
router.get('/feed', auth, routeController.getFeed);
router.get('/feed/articles', auth, routeController.getArticles);
router.get('/feed/gifs', auth, routeController.getGifs);

module.exports = router;
