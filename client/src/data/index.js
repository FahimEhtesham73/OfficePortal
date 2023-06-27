import moment from "moment/moment";



// * tasks
export const boardData = {
  columns: [
    {
      id: 1,
      title: "Backlog",
      cards: [
        {
          id: 1,
          title: "Database Setup",
          description: "Firebase Integration",
        },
        {
          id: 2,
          title: "Data Flow",
          description: "Setup Diagram with other developers",
        },
      ],
    },
    {
      id: 2,
      title: "TODO",
      cards: [
        {
          id: 9,
          title: "Data Table Page",
          description: "Server side Pagination",
        },
      ],
    },
    {
      id: 3,
      title: "Doing",
      cards: [
        {
          id: 10,
          title: "Full Calendar Extension",
          description: "Make new events and store in global states",
        },
        {
          id: 11,
          title: "Custom Kanban Board",
          description:
            "Setup react-kanban dep within Dashboard as seperate page",
        },
      ],
    },
    {
      id: 4,
      title: "Completed",
      cards: [
        {
          id: 12,
          title: "Vite Server Setup",
          description: "Configure required modules and starters",
        },
        {
          id: 13,
          title: "Modular structre",
          description:
            "Write css in form of modules to reduce the naming conflicts",
        },
      ],
    },
  ],
};
