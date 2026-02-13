/* src/data/store.ts */

// --- TYPES ---
export type Task = {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: 'Live' | 'In Dev' | 'Pending';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  dueDate: string;
  tasks: Task[];
};

// NEW: Waitlist Type
export type WaitlistEntry = {
  id: string;
  email: string;
  date: string;
  status: 'Pending' | 'Invited' | 'Onboarded';
  source: 'Home' | 'Shift Studio';
};

// --- MOCK DATABASE ---
export const MOCK_DB: { projects: Project[]; waitlist: WaitlistEntry[] } = {
  projects: [
    {
      id: "1",
      name: "Alt // Solutions Web",
      client: "Internal",
      status: "Live",
      priority: "High",
      progress: 100,
      dueDate: "2026-03-01",
      tasks: [
        { id: "t1", title: "Fix Mobile Nav", status: "Done", assignee: "Courtney", priority: "High" },
        { id: "t2", title: "Optimize Images", status: "In Progress", assignee: "Courtney", priority: "Medium" }
      ]
    },
    {
      id: "2",
      name: "Shift Studio (Alpha)",
      client: "Internal",
      status: "In Dev",
      priority: "Critical",
      progress: 45,
      dueDate: "2026-06-15",
      tasks: [
        { id: "t3", title: "Database Schema", status: "Todo", assignee: "Courtney", priority: "Critical" },
        { id: "t4", title: "Auth Integration", status: "Todo", assignee: "Courtney", priority: "High" }
      ]
    },
    {
      id: "3",
      name: "Client: Ducky's Auto",
      client: "Ducky",
      status: "Pending",
      priority: "Medium",
      progress: 10,
      dueDate: "2026-04-01",
      tasks: [
        { id: "t5", title: "Gather Requirements", status: "In Progress", assignee: "Courtney", priority: "High" }
      ]
    }
  ],
  // NEW: Mock Waitlist Data
  waitlist: [
    { id: "w1", email: "ducky@example.com", date: "2026-02-10", status: "Pending", source: "Shift Studio" },
    { id: "w2", email: "investor@venture.com", date: "2026-02-11", status: "Invited", source: "Home" },
    { id: "w3", email: "fan@gmail.com", date: "2026-02-12", status: "Pending", source: "Shift Studio" },
  ]
};

// --- QUERIES ---
export const getProjectById = (id: string) => {
  return MOCK_DB.projects.find(p => p.id === id);
};