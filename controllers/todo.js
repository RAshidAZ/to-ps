const Todo = require("../models/todo");

const { sendResponse } = require("../helpers/common")

const addTodo = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.title) {
        return cb(sendResponse(400, null, "addTodo", null));
    }
    let insertTodo = data
    insertTodo.addedBy = data.authUser.id
    Todo.create(insertTodo, (err, result) => {
        if (err) {
            console.log('----Error in adding todo: ' + err)
            return cb(sendResponse(500, null, "addTodo", null));
        }
        console.log('------------------------------------------------------', result);
        return cb(null, sendResponse(200, "Todo added", "addTodo", null))
    })
}
exports.addTodo = addTodo;

const getAllTodoList = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    let findTodo = {
        isDelete: false,
    }
    Todo.find(findTodo, (err, result) => {
        if (err) {
            return cb(sendResponse(500, null, "getAllTodoList", null));
        }
        // console.log('-----ß-------------------------------------------------', result);
        return cb(null, sendResponse(200, "Todo found", "getAllTodoList", result))
    })
}
exports.getAllTodoList = getAllTodoList;

const updateTodo = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.todoId) {
        return cb(sendResponse(400, "Provide todo id", "updateTodo", null));
    }
    let message = "";
    
    let findTodo = {
        _id: data.todoId,
        addedBy: data.authUser.id,
        isDelete: false
    }

    let updateTodo = {}

    if(data.complete){
        updateTodo.isCompleted = true
        message = "Todo completed"
    }

    if(data.delete){
        updateTodo.isDelete = true
        message = "Todo deleted"
    }

    Todo.findOneAndUpdate(findTodo, updateTodo, (err, result) => {
        if (err) {
            return cb(sendResponse(500, null, "updateTodo", null));
        }
        // console.log('-----ß-------------------------------------------------', result);
        return cb(null, sendResponse(200, message, "updateTodo", null))
    })
}
exports.updateTodo = updateTodo;