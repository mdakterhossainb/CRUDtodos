const express = require("express");
const router = express.Router();
const Todo = require("../models/todoModel");
const { validateTodo } = require("../middleware/validator");

// 1. POST /todos — নতুন Task তৈরি (ভ্যালিডেশন সহ)
router.post("/", validateTodo, async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const newTodo = new Todo({ title, description, completed });
    const savedTodo = await newTodo.save();
    res.status(201).json({ success: true, data: savedTodo });
  } catch (error) {
    next(error);
  }
});

// 2. GET /todos — সব Task দেখানো
router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
});

// 3. GET /todos/:id — নির্দিষ্ট Task দেখানো
router.get("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
});

// 4. PUT /todos/:id — Task আপডেট করা (ভ্যালিডেশন সহ)
router.put("/:id", validateTodo, async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true, runValidators: true },
    );
    if (!updatedTodo) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /todos/:id — Task ডিলিট করা
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      res.status(404);
      throw new Error("Task not found");
    }
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
