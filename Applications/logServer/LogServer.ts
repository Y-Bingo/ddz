import { IServer } from "../IApplication";
import ClientPeer from "../../core/tcp/ClientPeer";

/**
 * 系统日志服务
 * 1. 保存服务器的日志服务
 * 2. 保存房间的日志服务
 */
class LogServer implements IServer {

    onReceive( client: ClientPeer, subCode: number, value: any ): void {

    }

    onDisconnect( client: ClientPeer ): void {

    }

}

export default LogServer;
