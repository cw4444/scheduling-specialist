import { TrainingCenter } from "@/lib/types";

export const centers: TrainingCenter[] = [
  {
    id: "ctr1",
    name: "London HQ",
    location: "London",
    rooms: [
      { id: "r1", name: "Room A", capacity: 20 },
      { id: "r2", name: "Room B", capacity: 16 },
      { id: "r3", name: "Room C", capacity: 12 },
    ],
  },
  {
    id: "ctr2",
    name: "Manchester Centre",
    location: "Manchester",
    rooms: [
      { id: "r4", name: "Room 1", capacity: 16 },
      { id: "r5", name: "Room 2", capacity: 14 },
    ],
  },
  {
    id: "ctr3",
    name: "Birmingham Centre",
    location: "Birmingham",
    rooms: [
      { id: "r6", name: "Suite A", capacity: 16 },
      { id: "r7", name: "Suite B", capacity: 12 },
    ],
  },
];
