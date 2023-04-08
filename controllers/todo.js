const Todo = require("../models/todo");

const { sendResponse } = require("../helpers/common")

const addTodo = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.todos || !data.todos.length) {
        return cb(sendResponse(400, "Provide todo lists", "addTodo", null));
    }
    if(data.todos.length > 10){
        return cb(sendResponse(400, "Not allowed to add more than 10 todo at a time", "addTodo", null));
    }
    let insertTodoLists = [];

    for(let i in data.todos) {
        let todo = data.todos[i];
        if(!todo.title){
            return cb(sendResponse(400, "Provide todo lists", "addTodo", null));
        }
        todo.addedBy = data.authUser.id
        insertTodoLists.push(todo);
    }
    
    Todo.create(insertTodoLists, (err, result) => {
        if (err) {
            console.log('----Error in adding todo: ' + err)
            return cb(sendResponse(500, null, "addTodo", null));
        }
        console.log('------------------------------------------------------', result);
        return cb(null, sendResponse(200, "Todo added successfully!", "addTodo", null))
    })
}
exports.addTodo = addTodo;

const getAllTodoList = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    let findTodo = {
        isDelete: false,
        addedBy: data.authUser.id
    }
    let limit = parseInt(process.env.pageLimit);
    let skip = 0;
    if (data.currentPage) {
        skip = data.currentPage > 0 ? ((data.currentPage - 1) * limit) : 0;
    }
    Todo.countDocuments(findTodo, (errC, count)=>{
        if (errC) {
            return cb(sendResponse(500, null, "getAllTodoList", null));
        }
        if(count >0) {
            Todo.find(findTodo).sort({ createdAt: -1 }).skip(skip).limit(limit).exec((err, todos) => {
                if (err) {
                    return cb(sendResponse(500, null, "getAllTodoList", null));
                }
                // console.log('-----ß-------------------------------------------------', result);
                
                return cb(null, sendResponse(200, "Todo found", "getAllTodoList", { todos, count, limit }))
            })
        }else{
            return cb(null, sendResponse(200, "No Todo found", "getAllTodoList", []))
        }
    });
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