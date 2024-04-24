import { v4 as uuid } from "uuid";
const constants = [
    {
        key: uuid(),
        timestamp: "4/2/2024, 6:00:10 PM",
        title: "Встреча",
        description: "Meeting with the client",
        dueDate: "2024-12-24",
        tags: ["High Priority"],
        status: "OPEN",
    },
    {
        key: uuid(),
        timestamp: "4/3/2024, 6:12:53 PM",
        title: "Web page",
        description: "Develop first page website",
        dueDate: "2024-12-24",
        tags: ["Usual"],
        status: "WORKING",
    },
];

export default constants;