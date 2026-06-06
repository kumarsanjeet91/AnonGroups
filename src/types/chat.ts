export type GroupDto = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type MessageDto = {
  _id: string;
  groupId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
};

export type CurrentUser = {
  userId: string;
  username: string;
};
