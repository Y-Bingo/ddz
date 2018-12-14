import UserCache from "./UserCache";
import RoomCache from "./RoomCache";

class Caches {
    static userCache: UserCache = new UserCache();
    static roomCache: RoomCache = new RoomCache();
}

export default Caches;
