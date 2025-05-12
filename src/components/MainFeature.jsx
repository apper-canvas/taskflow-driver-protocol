import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature({ onTasksChange }) {
  // Icons
  const PlusCircle = getIcon('PlusCircle');
  const Edit = getIcon('Edit');
  const Trash2 = getIcon('Trash2');
  const CheckCircle = getIcon('CheckCircle');
  const Clock = getIcon('Clock');
  const AlertCircle = getIcon('AlertCircle');
  const ListTodo = getIcon('ListTodo');
  const X = getIcon('X');
  const Save = getIcon('Save');
  const Menu = getIcon('Menu');
  const Filter = getIcon('Filter');
  const AlertTriangle = getIcon('AlertTriangle');
  const Search = getIcon('Search');

  // Task state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: '1',
        title: 'Create project plan',
        description: 'Outline the key milestones and deliverables',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        priority: 'high',
        status: 'todo',
        created: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Research competitors',
        description: 'Analyze top 5 competitors in the market',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        priority: 'medium',
        status: 'in-progress',
        created: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Design homepage',
        description: 'Create wireframes for the new homepage',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        priority: 'high',
        status: 'completed',
        created: new Date().toISOString()
      }
    ];
  });

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    priority: 'medium',
    status: 'todo'
  });

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // View options
  const [viewStyle, setViewStyle] = useState('board'); // 'board' or 'list'

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Reset form to default values
  const resetForm = () => {
    setFormValues({
      title: '',
      description: '',
      dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      priority: 'medium',
      status: 'todo'
    });
    setEditingTask(null);
  };

  // Open form for creating a new task
  const openNewTaskForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing an existing task
  const openEditForm = (task) => {
    setFormValues({
      title: task.title,
      description: task.description,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      priority: task.priority,
      status: task.status
    });
    setEditingTask(task.id);
    setIsFormOpen(true);
  };

  // Close the form
  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Save a task (create or update)
  const saveTask = (e) => {
    e.preventDefault();
    
    if (!formValues.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask ? {
          ...task,
          title: formValues.title,
          description: formValues.description,
          dueDate: new Date(formValues.dueDate).toISOString(),
          priority: formValues.priority,
          status: formValues.status
        } : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
    } else {
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        title: formValues.title,
        description: formValues.description,
        dueDate: new Date(formValues.dueDate).toISOString(),
        priority: formValues.priority,
        status: formValues.status,
        created: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    }
    
    closeForm();
  };

  // Delete a task
  const deleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.info("Task deleted");
    }
  };

  // Update task status
  const updateTaskStatus = (id, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    
    // Search filter
    if (filters.search && 
        !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group tasks by status for board view
  const groupedTasks = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium task-priority-high flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium task-priority-medium flex items-center">
            <AlertCircle size={12} className="mr-1" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium task-priority-low flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Low
          </span>
        );
      default:
        return null;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'todo':
        return <ListTodo size={16} className="text-amber-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  // Task card component
  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 p-4 mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{task.title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => openEditForm(task)}
            className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary transition-colors"
            aria-label="Edit task"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-500 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">
          {task.description}
        </p>
      )}
      
      <div className="flex flex-wrap justify-between items-center mt-2">
        <div className="flex items-center space-x-2 text-xs text-surface-500 dark:text-surface-400">
          <div className="flex items-center">
            <span className="mr-1">{getStatusIcon(task.status)}</span>
            <span className="capitalize">{task.status.replace('-', ' ')}</span>
          </div>
          <span>•</span>
          <div>
            {new Date(task.dueDate) < new Date() && task.status !== 'completed' ? (
              <span className="text-red-500 dark:text-red-400">
                Overdue: {format(new Date(task.dueDate), 'MMM d')}
              </span>
            ) : (
              <span>Due: {format(new Date(task.dueDate), 'MMM d')}</span>
            )}
          </div>
        </div>
        
        <div className="mt-2 sm:mt-0">
          {getPriorityBadge(task.priority)}
        </div>
      </div>

      {task.status !== 'completed' && (
        <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700 flex justify-end space-x-2">
          {task.status === 'todo' && (
            <button
              onClick={() => updateTaskStatus(task.id, 'in-progress')}
              className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors flex items-center"
            >
              <Clock size={12} className="mr-1" />
              Start
            </button>
          )}
          
          {task.status === 'in-progress' && (
            <button
              onClick={() => updateTaskStatus(task.id, 'completed')}
              className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors flex items-center"
            >
              <CheckCircle size={12} className="mr-1" />
              Complete
            </button>
          )}
        </div>
      )}
    </motion.div>
  );

  // Task list item component for list view
  const TaskListItem = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-3 mb-2 flex flex-col sm:flex-row sm:items-center"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-medium truncate mr-2">{task.title}</h3>
          <div className="flex-shrink-0 ml-2 hidden sm:block">
            {getPriorityBadge(task.priority)}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center mt-1 text-xs text-surface-500 dark:text-surface-400">
          <div className="flex items-center mr-3">
            <span className="mr-1">{getStatusIcon(task.status)}</span>
            <span className="capitalize">{task.status.replace('-', ' ')}</span>
          </div>
          
          <div className="mr-3">
            {new Date(task.dueDate) < new Date() && task.status !== 'completed' ? (
              <span className="text-red-500 dark:text-red-400">
                Overdue: {format(new Date(task.dueDate), 'MMM d')}
              </span>
            ) : (
              <span>Due: {format(new Date(task.dueDate), 'MMM d')}</span>
            )}
          </div>
          
          <div className="sm:hidden mt-1 flex-shrink-0">
            {getPriorityBadge(task.priority)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-3 sm:mt-0">
        {task.status === 'todo' && (
          <button
            onClick={() => updateTaskStatus(task.id, 'in-progress')}
            className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors flex items-center"
          >
            <Clock size={12} className="mr-1" />
            Start
          </button>
        )}
        
        {task.status === 'in-progress' && (
          <button
            onClick={() => updateTaskStatus(task.id, 'completed')}
            className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors flex items-center"
          >
            <CheckCircle size={12} className="mr-1" />
            Complete
          </button>
        )}
        
        <button
          onClick={() => openEditForm(task)}
          className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary transition-colors"
          aria-label="Edit task"
        >
          <Edit size={16} />
        </button>
        
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div>
      {/* Task Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold flex items-center">
          <Menu className="mr-2 text-primary" />
          Task Board
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-9 pr-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-surface-400" size={16} />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center transition-colors ${
                (filters.status !== 'all' || filters.priority !== 'all') 
                  ? 'bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:border-primary/40' 
                  : 'border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <Filter size={16} className="mr-1.5" />
              Filters
              {(filters.status !== 'all' || filters.priority !== 'all') && (
                <span className="ml-1.5 flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-white">
                  {(filters.status !== 'all' ? 1 : 0) + (filters.priority !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>
            
            <div className="flex rounded-lg overflow-hidden border border-surface-300 dark:border-surface-600">
              <button
                onClick={() => setViewStyle('board')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewStyle === 'board' 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setViewStyle('list')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewStyle === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                List
              </button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openNewTaskForm}
              className="px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark shadow-sm transition-colors flex items-center"
            >
              <PlusCircle size={18} className="mr-1.5" />
              Add Task
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Filter panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2 flex items-end">
                  <button
                    onClick={() => setFilters({ status: 'all', priority: 'all', search: '' })}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Board View */}
      {viewStyle === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Todo Column */}
          <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20">
            <div className="flex items-center mb-4">
              <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 mr-2">
                <ListTodo className="text-amber-600 dark:text-amber-400" size={18} />
              </div>
              <h3 className="font-semibold text-lg">To Do</h3>
              <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                {groupedTasks.todo.length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[100px]">
              <AnimatePresence>
                {groupedTasks.todo.length > 0 ? (
                  groupedTasks.todo.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 text-center text-surface-500 dark:text-surface-400"
                  >
                    <ListTodo className="mb-2 opacity-30" size={24} />
                    <p className="text-sm">No tasks to do</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* In Progress Column */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/20">
            <div className="flex items-center mb-4">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 mr-2">
                <Clock className="text-blue-600 dark:text-blue-400" size={18} />
              </div>
              <h3 className="font-semibold text-lg">In Progress</h3>
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {groupedTasks['in-progress'].length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[100px]">
              <AnimatePresence>
                {groupedTasks['in-progress'].length > 0 ? (
                  groupedTasks['in-progress'].map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 text-center text-surface-500 dark:text-surface-400"
                  >
                    <Clock className="mb-2 opacity-30" size={24} />
                    <p className="text-sm">No tasks in progress</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Completed Column */}
          <div className="bg-green-50/50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900/20">
            <div className="flex items-center mb-4">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 mr-2">
                <CheckCircle className="text-green-600 dark:text-green-400" size={18} />
              </div>
              <h3 className="font-semibold text-lg">Completed</h3>
              <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                {groupedTasks.completed.length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[100px]">
              <AnimatePresence>
                {groupedTasks.completed.length > 0 ? (
                  groupedTasks.completed.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 text-center text-surface-500 dark:text-surface-400"
                  >
                    <CheckCircle className="mb-2 opacity-30" size={24} />
                    <p className="text-sm">No completed tasks</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
      
      {/* List View */}
      {viewStyle === 'list' && (
        <div className="space-y-4 mb-8">
          {/* Todo Section */}
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 mr-2">
                <ListTodo className="text-amber-600 dark:text-amber-400" size={18} />
              </div>
              <h3 className="font-semibold">To Do</h3>
              <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                {groupedTasks.todo.length}
              </span>
            </div>
            
            <div className="ml-2 border-l-2 border-amber-200 dark:border-amber-800 pl-4 py-1">
              <AnimatePresence>
                {groupedTasks.todo.length > 0 ? (
                  groupedTasks.todo.map(task => (
                    <TaskListItem key={task.id} task={task} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-4 text-center text-surface-500 dark:text-surface-400"
                  >
                    <p className="text-sm">No tasks to do</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* In Progress Section */}
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 mr-2">
                <Clock className="text-blue-600 dark:text-blue-400" size={18} />
              </div>
              <h3 className="font-semibold">In Progress</h3>
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {groupedTasks['in-progress'].length}
              </span>
            </div>
            
            <div className="ml-2 border-l-2 border-blue-200 dark:border-blue-800 pl-4 py-1">
              <AnimatePresence>
                {groupedTasks['in-progress'].length > 0 ? (
                  groupedTasks['in-progress'].map(task => (
                    <TaskListItem key={task.id} task={task} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-4 text-center text-surface-500 dark:text-surface-400"
                  >
                    <p className="text-sm">No tasks in progress</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Completed Section */}
          <div>
            <div className="flex items-center mb-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 mr-2">
                <CheckCircle className="text-green-600 dark:text-green-400" size={18} />
              </div>
              <h3 className="font-semibold">Completed</h3>
              <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                {groupedTasks.completed.length}
              </span>
            </div>
            
            <div className="ml-2 border-l-2 border-green-200 dark:border-green-800 pl-4 py-1">
              <AnimatePresence>
                {groupedTasks.completed.length > 0 ? (
                  groupedTasks.completed.map(task => (
                    <TaskListItem key={task.id} task={task} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-4 text-center text-surface-500 dark:text-surface-400"
                  >
                    <p className="text-sm">No completed tasks</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-dashed border-surface-300 dark:border-surface-700"
        >
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-3">
            <ListTodo className="text-amber-500" size={32} />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          
          <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-4">
            {filters.status !== 'all' || filters.priority !== 'all' || filters.search
              ? "No tasks match your current filters. Try adjusting your search criteria."
              : "You haven't created any tasks yet. Add your first task to get started."}
          </p>
          
          {(filters.status !== 'all' || filters.priority !== 'all' || filters.search) ? (
            <button
              onClick={() => setFilters({ status: 'all', priority: 'all', search: '' })}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={openNewTaskForm}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center mx-auto"
            >
              <PlusCircle size={16} className="mr-1.5" />
              Add Your First Task
            </button>
          )}
        </motion.div>
      )}

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-lg shadow-lg max-w-md w-full mx-auto"
            >
              <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
                <h3 className="text-lg font-semibold">
                  {editingTask ? "Edit Task" : "New Task"}
                </h3>
                <button 
                  onClick={closeForm}
                  className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={saveTask} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formValues.title}
                      onChange={handleInputChange}
                      placeholder="Enter task title"
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formValues.description}
                      onChange={handleInputChange}
                      placeholder="Enter task details"
                      className="input"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formValues.dueDate}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formValues.priority}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formValues.status}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
                  >
                    <Save size={18} className="mr-1.5" />
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}