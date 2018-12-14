import Caches from "../cache/Cache";
import UserCache from "../cache/UserCache";
import { IServer } from "../IApplication";
import ClientPeer from "../../core/tcp/ClientPeer";
import createUser, { UserModel } from "../../core/model/UserModel";
import { SUB_REP_LOGON, SUB_REQ_LOGON, EMDM } from "../../protocol/FrameCode";

/**
 * 处理玩家的登录 和注册 请求
 * 1. 在注册的时候写入注册玩家的信息
 * 2. 占不做服务器：在玩家登录的时候与数据库玩家信息进行核对
 */
class LogonServer implements IServer {
    // 用户与客户端的数据
    private _userCache: UserCache = Caches.userCache;

    constructor () { }
    // 获取在线人数
    get onLines() {
        return this._userCache.size;
    }

    onDisconnect( client: ClientPeer ) {
        this._userCache.offLine( client );
    }

    onReceive( client: ClientPeer, subCode: SUB_REQ_LOGON, value: any ) {
        switch ( subCode ) {
            case SUB_REQ_LOGON.ACCOUNT:
                console.warn( "该功能还没开发 or 开发中..." );
                break;
            case SUB_REQ_LOGON.USERID:
                console.warn( "该功能还没开发 or 开发中..." );
                break;
            case SUB_REQ_LOGON.VISITOR:
                this._visitorLogin( client, value );
                break;
        }
    }
    // 游客登录
    private _visitorLogin( client: ClientPeer, value: any ): void {
        // 缓存用户数据
        let user: UserModel = createUser();
        this._userCache.onLine( user, client );
        // 返回登录成功信息给客户端: 主要信息就是用户的信息
        client.send( EMDM.GR_LOGON, SUB_REP_LOGON, user );
    }
    // 用户登录
    private _accountLogin(): void {

    }
    // 用户ID登录
    private _userLogin(): void {

    }
}



export default LogonServer;
