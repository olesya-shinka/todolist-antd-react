import { useEffect, useState } from "react";
import AddTaskForm from "./components/addTaskForm";
import { addTask } from "./store/slice/taskSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [taskAdded, setTaskAdded] = useState(false);

  useEffect(() => {
    if (!taskAdded) {
      const initialTask = {
        key: "1",
        timestamp: "24.04.2024",
        title: "Встреча",
        description: "Встреча с клиентом",
        dueDate: "25.04.2024",
        tags: ["Usual"],
        status: "Working",
      };
      dispatch(addTask(initialTask));
      setTaskAdded(true);
    }
  }, [dispatch, taskAdded]);

  return <AddTaskForm />;
}

export default App;
