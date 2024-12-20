type userType = {
  id: string;
  room: string;
  //   name?: string;
};

export class User {
  users: userType[] = [];

  constructor() {}

  addUser(id: string, room: string) {
    const roomData: userType = { id, room };
    if (this.users.find((item) => item.room === room)) {
      return;
    }
    this.users.push(roomData);
  }

  getUser(room: string) {
    return this.users.find((item) => item.room === room);
  }

  getUsers() {
    return this.users;
  }
}
