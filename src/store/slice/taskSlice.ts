import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TasksState } from '../../components/service';

const initialState: TasksState = {
    tasks: [],
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        editTask: (state, action: PayloadAction<{ taskId: string; updatedTask: Partial<Task> }>) => {
            const { taskId, updatedTask } = action.payload;
            const existingTask = state.tasks.find(task => task.key === taskId);
            if (existingTask) {
                Object.assign(existingTask, updatedTask);
                localStorage.setItem('tasks', JSON.stringify(state.tasks));
            }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            const updatedTasks = state.tasks.filter(task => task.key !== action.payload);
            state.tasks = updatedTasks;
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        },
        loadTasks: (state) => {
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                state.tasks = JSON.parse(tasks);
            }
        },
    }
});

export const { addTask, editTask, deleteTask, loadTasks } = tasksSlice.actions;
export default tasksSlice.reducer;