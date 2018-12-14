import * as ws from "ws";
import SocketMsg from "./SocketMsg";
import ClientPeer from "./ClientPeer";
import ClientPeerPool from "./ClientPeerPool";
import { IAppliaction } from "../../Applications/IApplication";

/**
 * 服务器对象对等体
 */
export default class ServerPeer {
    // 应用层
    private _application: IAppliaction;
    // 服务器对象
    private _serverSocekt: ws.Server;
    // 客户端对象的连接池
    private _clientPeerPool: ClientPeerPool;

    constructor () { }
    /**
     * 开启服务器
     * @param port 端口号
     * @param peerCount 默认连接数
     */
    start( port: number, peerCount: number ): void {
        try {
            this._serverSocekt = new ws.Server( { port: port } );
            this._clientPeerPool = new ClientPeerPool();
            let tempClientPeer: ClientPeer = null;
            for ( let i = 0; i < peerCount; i++ ) {
                tempClientPeer = new ClientPeer();
                tempClientPeer.onReceiveCompleted = this.onReceiveCompleted.bind( this );
                this._clientPeerPool.enqueue( tempClientPeer );
            }
            console.log( "===== 服务器启动 =====" );
            // 等待客户端链接
            this._serverSocekt.on( "connection", ( clientSocket ) => {
                this._processAccept( clientSocket );
            } )
        }
        catch ( e ) {
            console.log( e );
        }
    }

    setApplication( app: IAppliaction ): void {
        this._application = app;
    }

    // 处理接收监听
    private _processAccept( clientSocket: ws ) {
        let client: ClientPeer = this._clientPeerPool.dequeue();
        if ( client )
            client.socekt = clientSocket;
        console.log( "有个客户端链接进来了" );
        this._startReceive( client );
        this._monitorDisconnect( client );
    }
    // 开始接收数据
    private _startReceive( client: ClientPeer ): void {
        try {
            client.socekt.on( "message", ( data: Buffer ) => {
                this._processReceive( client, data );
            } )
        } catch ( e ) {
            console.log( e );
        }
    }
    // 处理接收数据
    private _processReceive( client: ClientPeer, data: Buffer ): void {
        client.startRecevie( data );
    }
    // 数据解析完后给应用层处理
    private onReceiveCompleted( client: ClientPeer, msg: SocketMsg ): void {
        if ( !this._application )
            console.error( "还没有绑定应用层" );
        this._application.onReceive( client, msg );
    }
    // 监听链接断开
    private _monitorDisconnect( client: ClientPeer ): void {
        try {
            client.socekt.on( "disconnect", () => {
                this._disconnect( client );
            } );
        } catch ( e ) {
            console.error( e );
        }
    }
    // 链接断开
    private _disconnect( client: ClientPeer ): void {
        try {
            if ( client == null )
                console.warn( "当前指定的客户端对象为空， 无法断开链接" );
            console.info( "客户端断开链接" );
            // 通知应用层有链接断开
            this._application.onDisconnect( client );
            client.disconnect();
        } catch ( e ) {
            console.error( e );

        }
    }
}
