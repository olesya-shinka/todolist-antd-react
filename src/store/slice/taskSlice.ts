import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
    id: string;
    title: string;
    description: string;
    children: Task[];
}

interface TasksState {
    tasks: Task[];
}

const initialState: TasksState = {
    tasks: [{ id: '1', title: 'Sample Task', description: 'This is a sample task', children: [] }]
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        editTask: (state, action: PayloadAction<{ taskId: string; updatedTask: Partial<Task> }>) => {
            const { taskId, updatedTask } = action.payload;
            const existingTask = state.tasks.find(task => task.id === taskId);
            if (existingTask) {
                Object.assign(existingTask, updatedTask);
            }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        }
    }
});

export const { addTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;