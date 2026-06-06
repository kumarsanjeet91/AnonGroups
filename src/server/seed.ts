import { Group } from "../models/Group";

const defaultGroups = [
  { name: "General", description: "Open conversation for everyone." },
  { name: "Technology", description: "Gadgets, platforms, privacy, and digital life." },
  { name: "Programming", description: "Code, debugging, architecture, and tools." },
  { name: "Gaming", description: "Games, hardware, releases, and friendly banter." },
  { name: "Movies", description: "Films, shows, recommendations, and reviews." },
  { name: "Sports", description: "Matches, teams, leagues, and live reactions." }
];

export async function seedDefaultGroups() {
  const count = await Group.countDocuments();
  if (count > 0) return;
  await Group.insertMany(defaultGroups);
}
