import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space, Popconfirm } from "antd";
import { ActionsColumnProps } from "./service";

const ActionsColumn: React.FC<ActionsColumnProps> = ({
  task,
  handleEditTask,
  handleDelete,
  saveEdit,
  cancelEdit,
  isEditing,
}) => {
  const editable = isEditing(task);

  return (
    <Space>
      {editable ? (
        <span>
          <Space wrap align="center">
            <Button
              size="middle"
              type="primary"
              onClick={() => saveEdit(task.key)}
            >
              Save
            </Button>
            <Popconfirm
              title="Are you sure want to cancel?"
              onConfirm={cancelEdit}
            >
              <Button size="middle">Cancel</Button>
            </Popconfirm>
          </Space>
        </span>
      ) : (
        <Tooltip title="Edit">
          <Button
            type="primary"
            onClick={() => handleEditTask(task)}
            icon={<EditOutlined />}
          ></Button>
        </Tooltip>
      )}
      <Popconfirm
        title="Are you sure want to delete?"
        onConfirm={() => handleDelete(task)}
      >
        <Tooltip title="Delete">
          <Button danger icon={<DeleteOutlined />} disabled={editable} />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export default ActionsColumn;
