const express = require('express');
const router = express.Router();

//  Middleware
const authenticator = require('../middlewares/authenticator');
const authenticateRole = require('../middlewares/authenticateRole');
const rateLimiter = require('../middlewares/rateLimiter');

/* Controllers */
const post = require('../controllers/post');

router.use(rateLimiter(10, 100))

/* Add post. */
router.post('/v1/add', authenticator, function (req, res, next) {
    let data = req.body;
    data.authUser = req.authUser;
    post.addPost(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});

/* Get post. */
router.get('/v1/all', authenticator, function (req, res, next) {
    let data = req.query;
    data.authUser = req.authUser;
    post.getAllPostList(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});

/* Get post. */
router.get('/v1/:postId', authenticator, function (req, res, next) {
    let data = req.params;
    data.authUser = req.authUser;
    post.getSpecifcPostDetails(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});

/* Comment on a post. */
router.post('/v1/comment', authenticator, function (req, res, next) {
    let data = req.body;
    data.authUser = req.authUser;
    post.addComment(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});

/* Edit a post. */
router.patch('/v1/edit', authenticator, function (req, res, next) {
    let data = req.body;
    data.authUser = req.authUser;
    post.updatePost(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});

/* Delete a post. */
router.patch('/v1/delete', [authenticator, authenticateRole(["ADMIN"])], function (req, res, next) {
    let data = req.body;
    data.authUser = req.authUser;
    data.delete = true;
    post.updatePost(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});

/* Edit a post. */
router.patch('/v1/admin/edit', [authenticator, authenticateRole(["ADMIN"])], function (req, res, next) {
    let data = req.body;
    data.authUser = req.authUser;
    post.updatePostByAdmin(data, function (err, response) {
        let status = 0;
        if (err) {
            console.log(err);
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    });
});
module.exports = router;