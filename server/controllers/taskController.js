const Task = require('../models/Task');
const createBreaker = require('../breaker');

// Wrap DB operations with circuit breaker
const getTasksBreaker = createBreaker(() => Task.find().sort({ createdAt: -1 }));
const createTaskBreaker = createBreaker((data) => Task.create(data));
const deleteTaskBreaker = createBreaker((id) => Task.findByIdAndDelete(id));

// Get all tasks
const getAllTasks = async (req, res) => {
  const result = await getTasksBreaker.fire();

  if (result.success === false) {
    return res.status(503).json(result);
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
};

// Create a new task
const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required',
    });
  }

  const result = await createTaskBreaker.fire({
    title: title.trim(),
    description: description.trim(),
  });

  if (result.success === false) {
    return res.status(503).json(result);
  }

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: result,
  });
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const result = await deleteTaskBreaker.fire(id);

  if (result.success === false) {
    return res.status(503).json(result);
  }

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
};