// 解包、压包工具
import SocketMsg from "./SocketMsg";
import ClientPeer from "./ClientPeer";

export default class EncodeTool {
    /**
     * 构造数据包： 包头 + 包尾
     * @param msg 信息包数据
     */
    static encodePacekt( msg: SocketMsg ): Buffer {
        let msgStr = JSON.stringify( msg.data );
        let buffer = new Buffer( 4 + Buffer.byteLength( msgStr ) );
        buffer.writeInt16BE( msg.mainCmd, 0 );
        buffer.writeInt16BE( msg.subCmd, 2 );
        buffer.write( msgStr, 4, Buffer.byteLength( msgStr ) );
        return buffer;
    }
    /**
     * 解析数据包，从缓存中一个一个完整的数据包
     * @param client clientPeer对象
     */
    static decodePacket( client: ClientPeer ): SocketMsg {
        let dataCache: Buffer = client.dataCache;

        if ( dataCache.length < 6 )
            return null;

        let valLen = dataCache.readInt16BE( 4 );
        // 数据长度不够约定的长度
        if ( valLen + 6 < dataCache.length )
            return null;
        let socektMsg = new SocketMsg();
        socektMsg.mainCmd = dataCache.readInt16BE( 0 );
        socektMsg.subCmd = dataCache.readInt16BE( 2 );
        socektMsg.data = JSON.parse( dataCache.toString( "utf8", 6 ) );

        // 更新保存的数据
        client.dataCache = dataCache.slice( valLen + 6 );
        return socektMsg;
    }


}
