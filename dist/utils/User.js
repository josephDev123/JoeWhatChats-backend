"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor() {
        this.users = [];
    }
    addUser(id, room) {
        const roomData = { id, room };
        if (this.users.find((item) => item.room === room)) {
            return;
        }
        this.users.push(roomData);
    }
    getUser(room) {
        return this.users.find((item) => item.room === room);
    }
    getUsers() {
        return this.users;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map