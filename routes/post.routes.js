// routes/post.routes.js

const { Router } = require('express');
const router = new Router();
// const bcryptjs = require('bcryptjs');
// const saltRounds = 10;
// const User = require('../models/User.model');
const Post = require('../models/Post.model');
const mongoose = require('mongoose');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const routeGuard = require('../configs/route-guard.config');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});

const upload = multer({ storage });

////////////////////////////////////////////////////////////////////////
///////////////////////////// CREATE //////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/create', routeGuard, (request, response) => {
  response.render('post/create');
});

router.post('/create', routeGuard, upload.single('contentPicture'), (request, response, next) => {
  const { content } = request.body;
  //const url =
  // const filename = request.file.filename;
  const userId = request.session.currentUser._id;

  if (request.file) {
    Post.create({
      content,
      creatorId: userId,
      picPath: request.file.path,
      picName: request.file.filename
    })
      .then(post => {
        response.redirect('/');
      })
      .catch(error => {
        next(error);
      });
  } else {
    Post.create({
      content,
      creatorId: userId
    })
      .then(post => {
        response.redirect('/');
      })
      .catch(error => {
        next(error);
      });
  }
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// DISPLAY //////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/posts', (request, response, next) => {
  Post.find()
    .populate('creatorId')
    .then(posts => {
      console.log(posts);
      response.render('post/display', { posts });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/posts/:id', (request, response, next) => {
  const id = request.params.id;

  Post.findById(id)
    .populate('creatorId')
    .then(post => {
      if (post) {
        response.render('post/single', { post: post });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
