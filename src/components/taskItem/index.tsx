import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, Task } from "../../store/slice/taskSlice";

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TaskItem;
