import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    todo: 0
  });

  const PresentationChartLine = getIcon('BarChart3');
  const CheckCircle = getIcon('CheckCircle');
  const Clock = getIcon('Clock');
  const ListTodo = getIcon('ClipboardList');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome to TaskFlow!");
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Update stats when tasks change
  const updateStats = (tasks) => {
    const newStats = {
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length
    };
    setStats(newStats);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-primary mb-4"
        >
          {getIcon('Loader2')({ size: 40 })}
        </motion.div>
        <p className="text-lg text-surface-600 dark:text-surface-300">
          Loading your tasks...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Your Task Dashboard
        </h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl">
          Organize, manage, and track all your tasks in one place.
          Add new tasks, set priorities, and mark them complete as you go.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="card bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-100 dark:border-green-800/30">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
              <Clock className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">In Progress</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-4">
              <ListTodo className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">To Do</h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.todo}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <MainFeature onTasksChange={updateStats} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card border border-surface-200 dark:border-surface-700 overflow-hidden"
      >
        <div className="flex items-center mb-4">
          <PresentationChartLine className="mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Task Progress</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Completed</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stats.completed} tasks
              </span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${stats.completed > 0 ? 
                    (stats.completed / (stats.completed + stats.inProgress + stats.todo) * 100) : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">In Progress</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {stats.inProgress} tasks
              </span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${stats.inProgress > 0 ? 
                    (stats.inProgress / (stats.completed + stats.inProgress + stats.todo) * 100) : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">To Do</span>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {stats.todo} tasks
              </span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
              <div 
                className="bg-amber-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${stats.todo > 0 ? 
                    (stats.todo / (stats.completed + stats.inProgress + stats.todo) * 100) : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}