export interface CustomColumnType<T> {
    title: string;
    dataIndex: string;
    key: string;
    editable?: boolean;
    render?: (value: any, task: T, index: number) => React.ReactNode;
    sorter?: (a: T, b: T) => number;
    filters?: { text: string; value: string }[];
    onFilter?: (value: string, task: T) => boolean;
    sortDirections?: ("ascend" | "descend")[];
    sortOrder?: "descend" | "ascend" | undefined;
}

export interface TaskListProps {
    data: Task[];
    setData: React.Dispatch<React.SetStateAction<Task[]>>;
}

export interface EditableCellProps {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: string;
    task: Task[];
    index: number;
    children: React.ReactNode;
    [key: string]: any;
}

export interface Task {
    key: string;
    timestamp: string;
    title: string;
    description: string;
    dueDate: string;
    tags: string[];
    status: string;
}

export interface TasksState {
    tasks: Task[];
}