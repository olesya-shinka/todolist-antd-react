import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TaskItem from "../taskItem";


const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
