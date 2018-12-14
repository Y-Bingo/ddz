import * as ws from "ws";
import SocketMsg from "./SocketMsg";
import EncodeTool from "./EncondTool";

// 发送信息流程 打包 -》 压包 -》 进入消息队列 -》

export default class ClientPeer {
    /**
     * 用来缓存接受到的数据
     */
    dataCache: Buffer = new Buffer( 0 );
    // socekt链接对象
    private _mSocket: ws;
    // 消息队列
    private _sendQueue: Buffer[] = [];
    private _isSendProcess: boolean = false;

    get socekt(): ws {
        return this._mSocket;
    }
    set socekt( ws: ws ) {
        this._mSocket = ws;
    }
    // 数据接受完成回调
    private _mRecevieCompleted: ( ClientPeer: ClientPeer, msg: SocketMsg ) => void;
    set onReceiveCompleted( receiveCompleted: ( ClientPeer: ClientPeer, msg: SocketMsg ) => void ) {
        this._mRecevieCompleted = receiveCompleted;
    }
    // 是否正在处理数据
    private _isReceiveProcess: boolean = false;
    constructor () {
    }

    /**------------------------ 收包过程 -------------------------- */
    // 自身处理数据包
    startRecevie( packet: Buffer ) {
        // 将packet缓存到dataCache中
        this.dataCache = Buffer.concat( [ this.dataCache, packet ] )
        if ( !this._isReceiveProcess )
            this._processReceive();
    }
    // 解析数据包
    private _processReceive(): void {
        this._isReceiveProcess = true;
        // 解析数据包
        let msg: SocketMsg = EncodeTool.decodePacket( this );
        if ( msg === null ) {
            this._isReceiveProcess = false;
            return;
        }
        // 处理完成的回调
        if ( this._mRecevieCompleted )
            this._mRecevieCompleted( this, msg )
    }

    /**------------------------- 发包过程 ----------------------------- */
    // 发送消息
    send( mainCode: any, subCode: any, data: any ): void {
        let msg = new SocketMsg();
        msg.onInit( mainCode, subCode, data );
        this.sendMsg( msg );
    }
    // 压缩数据
    sendMsg( msg: SocketMsg ): void {
        let packet = EncodeTool.encodePacekt( msg );
        this.saveMsg( packet );
    }
    // 进入消息队列
    saveMsg( packet ): void {
        this._sendQueue.push( packet );
        if ( !this._isSendProcess )
            this._dealSend();
    }
    // 处理发送的消息
    private _dealSend(): void {
        if ( this._sendQueue.length === 0 ) {
            this._isSendProcess = false;
            return;
        }
        // 取出一条数据
        let packet: Buffer = this._sendQueue.shift();
        this._mSocket.send( packet );
        this._dealSend();
    }

    // 链接断开
    disconnect() {
        // 清空数据
        this.dataCache = new Buffer( 0 );
        this._isReceiveProcess = false;

        this._mSocket.close();
        this._mSocket = null;
    }
}
