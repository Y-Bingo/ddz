import ClientPeer from "./ClientPeer";

// ws对象池
export default class ClientPeerPool {
    // 链接队列
    private _queue: ClientPeer[] = [];
    // 入队
    enqueue( client: ClientPeer ): void {
        this._queue.push( client );
    }

    dequeue(): ClientPeer {
        return this._queue.shift();
    }
}
