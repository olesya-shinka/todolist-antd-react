import React, { useEffect, useState } from "react";
import { TablePaginationConfig } from "antd/es/table/interface";
import { TableCurrentDataSource } from "antd/lib/table/interface";
import { SorterResult } from "antd/lib/table/interface";
import { FilterValue } from "antd/lib/table/interface";
import {
  Row,
  Table,
  Tag,
  Popconfirm,
  Button,
  Tooltip,
  Space,
  Form,
  Input,
  Select,
} from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table/interface";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FolderOpenOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { deleteTask, editTask, loadTasks } from "../../store/slice/taskSlice";
import { useDispatch } from "react-redux";
import {
  CustomColumnType,
  EditableCellProps,
  Task,
  TaskListProps,
} from "../service";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const { Option } = Select;
const { Search } = Input;

const TaskList: React.FC<TaskListProps> = ({ data, setData }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks) || [];
  const [form] = Form.useForm();
  const [searchInfo, setSearchInfo] = useState(tasks);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey?: string | undefined;
    order?: "descend" | "ascend" | undefined;
    sortOrder?: "descend" | "ascend" | undefined;
  }>({});
  const [searchText, setSearchText] = useState("");
  const [chooseData, setChooseData] = useState(true);

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  useEffect(() => {
    setSearchInfo(data);
  }, [data]);

  useEffect(() => {
    if (searchText === "") {
      setChooseData(true);
    }
  }, [searchText]);

  const columns: CustomColumnType<Task>[] = [
    // номер
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_, task, index) => index + 1,
    },
    // дата создания
    {
      key: "timestamp",
      title: "Time stamp",
      dataIndex: "timestamp",
      sorter: (a: Task, b: Task) => {
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      },
      sortDirections: ["ascend", "descend"],
      sortOrder:
        sortedInfo.columnKey === "timestamp" ? sortedInfo.order : undefined,
    },
    // заголовок
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      editable: true,
      sorter: (a: Task, b: Task) => a.title.length - b.title.length,
      sortDirections: ["ascend", "descend"],
      sortOrder:
        sortedInfo.columnKey === "title" ? sortedInfo.order : undefined,
    },
    // описание
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      sorter: (a: Task, b: Task) => a.description.length - b.title.length,
      sortDirections: ["ascend", "descend"],
      sortOrder:
        sortedInfo.columnKey === "description" ? sortedInfo.order : undefined,
    },
    // срок выполнения
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      editable: true,
      sorter: (a: Task, b: Task) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      },
      sortDirections: ["ascend", "descend"],
      sortOrder:
        sortedInfo.columnKey === "dueDate" ? sortedInfo.order : undefined,
    },
    // теги
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      editable: true,
      filters: [
        { text: "Crucial", value: "Crucial" },
        { text: "High Prority", value: "High Priority" },
        { text: "Low Prority", value: "Low Priority" },
        { text: "Usual", value: "Usual" },
      ],
      onFilter: (value: string, task: Task) => task.tags.indexOf(value) === 0,
      render: ({ tags }: { tags: string[] }) => (
        <>
          {tags &&
            tags.map((tag: string) => {
              let color = tag.length > 4 ? "blue" : "purple";
              return (
                <Space wrap direction="horizontal" align="center">
                  <Tag
                    color={color}
                    style={{ margin: "2px" }}
                    bordered={false}
                    key={tag}
                  >
                    {tag.toUpperCase()}
                  </Tag>
                </Space>
              );
            })}
        </>
      ),
    },
    // статус
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "WORKING", value: "WORKING" },
        { text: "DONE", value: "DONE" },
        { text: "OVERDUE", value: "Overdue" },
      ],
      render: (status) => {
        let color = "red";
        let icon;
        if (status === "DONE") {
          color = "success";
          icon = <CheckCircleOutlined />;
        } else if (status === "WORKING") {
          color = "processing";
          icon = <SyncOutlined spin />;
        } else if (status === "OVERDUE") {
          color = "error";
          icon = <ClockCircleOutlined />;
        } else {
          color = "warning";
          icon = <FolderOpenOutlined />;
        }
        return (
          <>
            <Tag icon={icon} color={color} bordered={false} key={status}>
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
      onFilter: (value, task) => task.status.indexOf(value) === 0,
    },
    // редактирование и удаление
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (task: Task) => {
        const editable = isEditing(task);
        return tasks.length >= 1 ? (
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
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={editable}
                ></Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : null;
      },
    },
  ];

  const handleDelete = (task: Task) => {
    if (task && task.key) {
      dispatch(deleteTask(task.key));
    }
  };

  const loadData = () => {
    setData(tasks);
  };

  const statusList = ["OPEN", "WORKING", "DONE", "OVERDUE"];
  const tagList = ["Crucial", "High Priority", "Low Priority", "Usual"];

  const isEditing = (task: Task) => {
    return task && task.key === editRowKey;
  };

  const handleEditTask = (task: Task) => {
    console.log("Editing task:", task);
    if (task) {
      const { title, description, dueDate, tags, status } = task;
      form.setFieldsValue({
        ...{ title, description, dueDate, tags, status },
      });
      setEditRowKey(task.key);
    }
  };

  const saveEdit = async (key: string) => {
    try {
      const row = await form.validateFields();
      dispatch(editTask({ taskId: key, updatedTask: row }));
      setEditRowKey("");
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setEditRowKey("");
  };

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    task,
    index,
    children,
    ...restProps
  }) => {
    let input = <Input />;
    if (inputType === "status") {
      input = (
        <Select placeholder="Set Status">
          {statusList.map((status, index) => {
            return (
              <Option key={index} value={status}>
                {status}
              </Option>
            );
          })}
        </Select>
      );
    } else if (inputType === "tags") {
      input = (
        <Select mode="tags" placeholder="Tags" allowClear>
          {tagList.map((tag, index) => {
            return (
              <Option key={index} value={tag}>
                {tag}
              </Option>
            );
          })}
        </Select>
      );
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[{ required: true, message: `Please enter ${title}` }]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const alteredColumns: ColumnsType<Task> = columns.map((col) => {
    if (!col.editable) {
      return col as ColumnType<Task>;
    }

    return {
      ...col,
      onCell: (task: Task) => ({
        task,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(task),
      }),
    } as ColumnType<Task>;
  });

  //сортировка
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Task> | SorterResult<Task>[],
    extra: TableCurrentDataSource<Task>
  ) => {
    if (Array.isArray(sorter)) {
      sorter.forEach((s) => {
        const { order, field } = s;
        const columnKey = field ? (field as string) : "undefined";
        const sortOrder = order
          ? (order as "ascend" | "descend" | undefined)
          : undefined;
        setSortedInfo({ columnKey, order: sortOrder });
      });
    } else {
      const { order, field } = sorter;
      const columnKey = field ? (field as string) : "undefined";
      const sortOrder = order
        ? (order as "ascend" | "descend" | undefined)
        : undefined;
      setSortedInfo({ columnKey, order: sortOrder });
    }
  };

  //поиск
  const reset = () => {
    setChooseData(true);
    setSearchText("");
    loadData();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setChooseData(true);
    }
  };

  const onSearch = (value: string) => {
    let filteredData = searchInfo.filter(
      (text) =>
        text.title.toLowerCase().includes(value.toLowerCase()) ||
        text.description.toLowerCase().includes(value.toLowerCase()) ||
        text.dueDate.toString().includes(value.toLowerCase()) ||
        text.timestamp.toString().includes(value.toLowerCase())
    );

    setSearchInfo(filteredData);
    setChooseData(false);
  };

  return (
    <>
      <Row style={{ marginBottom: "20px" }} align={"middle"}>
        <Space align="center">
          <Search
            allowClear
            placeholder="Search"
            onChange={handleSearch}
            value={searchText}
            enterButton
            onSearch={onSearch}
            style={{
              width: 412,
              color: "#222222",
            }}
          />
          <Button onClick={reset}>Reset</Button>
        </Space>
      </Row>

      <Row>
        <Form form={form} component={false}>
          <Table
            tableLayout="fixed"
            columns={alteredColumns}
            components={{ body: { cell: EditableCell } }}
            dataSource={chooseData ? tasks : searchInfo}
            style={{ position: "absolute", top: "100%", fontSize: "14px" }}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            onChange={handleTableChange}
          />
        </Form>
      </Row>
    </>
  );
};

export default TaskList;
