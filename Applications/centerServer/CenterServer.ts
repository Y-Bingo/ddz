import { IServer } from "../IApplication";
import UserCache from "../cache/UserCache";
import ClientPeer from "../../core/tcp/ClientPeer";
import RoomCache from "../cache/RoomCache";
/**
 * 中心服务
 * 功能：
 * 1. 游戏类型信息，处理游戏种类： 扑克、麻将、休闲、钓鱼
 * 2. 加载游戏种类，细分1的种类：斗地主、断勾卡、象棋
 * 3. 房间信息
 */
class CenterServer implements IServer {
    // 用户缓存
    private _userCache: UserCache;
    private _roomCache: RoomCache;
    // 游戏列表
    gameList: any;
    // 房间列表
    _roomList: any;

    constructor () {
        this._userCache = new UserCache();
        this._roomCache = new RoomCache();
    }

    onReceive( client: ClientPeer, subCode: number, value: any ): void {

    }

    onDisconnect( client: ClientPeer ): void {

    }
    // 获取正在匹配的用户
    getOnlineCount(): number {
        return this._userCache.size;
    }

}

export default CenterServer;
