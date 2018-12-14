import LogonServer from "./logonServer/LogonServer";
import CenterServer from "./centerServer/CenterServer";
import LogServer from "./logServer/LogServer";
import ClientPeer from "../core/tcp/ClientPeer";
import SocketMsg from "../core/tcp/SocketMsg";
import { EMDM } from "../protocol/FrameCode";
import { IAppliaction } from "./IApplication";

// 网络消息管理中心
class NetMsgCenter implements IAppliaction{
    private _logonServer: LogonServer;
    private _centerServer: CenterServer;
    private _logServer: LogServer;

    onReceive( client: ClientPeer, msg: SocketMsg ): void {
        switch ( msg.mainCmd ) {
            case EMDM.GF_GAME:
                break;
            case EMDM.GR_GAME:
                break;
            case EMDM.GR_LOGON:
                this._logonServer.onReceive( client, msg.subCmd, msg.data );
                break;
            case EMDM.GR_USER:
                break;
        }
    }

    onDisconnect( client: ClientPeer ): void {
        this._logServer.onDisconnect( client );
        this._centerServer.onDisconnect( client );
        this._logonServer.onDisconnect( client );
    }

}



export default NetMsgCenter;


