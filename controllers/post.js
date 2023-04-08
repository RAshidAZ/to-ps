const async = require('async');

const Comment = require("../models/comment");
const Post = require("../models/post");

const { sendResponse } = require("../helpers/common")

const addPost = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.content) {
        return cb(sendResponse(400, "Provide content lists", "addPost", null));
    }
    
    let insertPost = {
        content: data.content,
        postedBy: data.authUser.id
    }
    
    Post.create(insertPost, (err, result) => {
        if (err) {
            console.log('----Error in adding post: ' + err)
            return cb(sendResponse(500, null, "addPost", null));
        }
        console.log('------------------------------------------------------', result);
        return cb(null, sendResponse(200, "Post added successfully!", "addPost", null))
    })
}
exports.addPost = addPost;

const getAllPostList = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    let findPost = {
        isDelete: false
    }
    let limit = parseInt(process.env.pageLimit);
    let skip = 0;
    if (data.currentPage) {
        skip = data.currentPage > 0 ? ((data.currentPage - 1) * limit) : 0;
    }
    Post.countDocuments(findPost, (errC, count)=>{
        if (errC) {
            return cb(sendResponse(500, null, "getAllPostList", null));
        }
        if(count >0) {
            Post.find(findPost).sort({ createdAt: -1 }).skip(skip).limit(limit).exec((err, posts) => {
                if (err) {
                    return cb(sendResponse(500, null, "getAllPostList", null));
                }
                // console.log('-----ß-------------------------------------------------', result);
                
                return cb(null, sendResponse(200, "Post found", "getAllPostList", { posts, count, limit }))
            })
        }else{
            return cb(null, sendResponse(200, "No Post found", "getAllPostList", []))
        }
    })
    
}
exports.getAllPostList = getAllPostList;

const updatePost = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.postId) {
        return cb(sendResponse(400, "Provide post id", "updatePost", null));
    }
    let message = "";
    
    let findPost = {
        _id: data.postId,
        addedBy: data.authUser.id,
        isDelete: false
    }

    let updatepost = {}

    if(data.delete){
        updatepost.isDelete = true
        message = "Post deleted successfully!"
    }
    if(data.content){
        updatepost.content = data.content
    }

    Post.findOneAndUpdate(findPost, updatepost, (err, result) => {
        if (err) {
            return cb(sendResponse(500, null, "updatePost", null));
        }
        // console.log('-----ß-------------------------------------------------', result);
        return cb(null, sendResponse(200, message, "updatePost", null))
    })
}
exports.updatePost = updatePost;

const addComment = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.postId || !data.comment) {
        return cb(sendResponse(400, "Provide post id and comment!", "addComment", null));
    }

    let waterfallFunction = [];

    waterfallFunction.push(async.apply(insertCommentInDB, data));
    waterfallFunction.push(async.apply(addCommentInPost, data));
    async.waterfall(waterfallFunction, cb);
}
exports.addComment = addComment;


const insertCommentInDB = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.comment) {
        return cb(sendResponse(400, "Provide comment", "insertCommentInDB", null));
    }
    
    let insertComment = {
        comment: data.comment,
    }

    Comment.create(insertComment, (err, result) => {
        if (err) {
            return cb(sendResponse(500, null, "insertCommentInDB", null));
        }
        // console.log('-----ß-------------------------------------------------', result);
        return cb(null, sendResponse(200, "Comment insert in DB", "insertCommentInDB", result))
    })
}
exports.insertCommentInDB = insertCommentInDB;


const addCommentInPost = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.postId) {
        return cb(sendResponse(400, "Provide post id", "addCommentInPost", null));
    }
    
    let findPost = {
        _id: data.postId,
        isDelete: false
    }

    let updatepost = {
        $push: { comments: response.data._id }
    }

    Post.findOneAndUpdate(findPost, updatepost, (err, result) => {
        if (err) {
            return cb(sendResponse(500, null, "addCommentInPost", null));
        }
        // console.log('-----ß-------------------------------------------------', result);
        return cb(null, sendResponse(200, "Comment added successfully!", "addCommentInPost", null))
    })
}
exports.addCommentInPost = addCommentInPost;