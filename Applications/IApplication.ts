import ClientPeer from "../core/tcp/ClientPeer";
import SocketMsg from "../core/tcp/SocketMsg";

export interface IServer {
    // 断开链接监听
    onDisconnect( client: ClientPeer ): void;
    // 数据接受监听
    onReceive( client: ClientPeer, subCode: number, value: any ): void;
}

export interface IAppliaction {
    // 断开链接监听
    onDisconnect( client: ClientPeer ): void;
    // 数据接受监听
    onReceive( client: ClientPeer, msg: SocketMsg ): void;
}
