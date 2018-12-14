interface IQueue<E> {
    // 是否为空
    isEmpty: boolean;
    // 队列的当前大小
    size: number;
    // 出队
    dequeue(): E;
    // 入队
    enqueue( ele: E ): void;
    // 获取队首
    getFront(): E;
}

/**
 * 队列数据结构
 */
class Queue<E> implements IQueue<E> {

    private _data: E[] = [];

    // 是否为空
    get isEmpty() {
        return this._data.length === 0;
    };
    // 队列的当前大小
    get size() {
        return this._data.length;
    };
    // 出队
    dequeue(): E {
        let val: E = null;
        if ( !this.isEmpty )
            val = this._data.shift();
        return val;
    };
    // 入队
    enqueue( ele: E ): void {
        this._data.push( ele );
    }
    // 获取队首
    getFront(): E {
        let val: E = null;
        if ( !this.isEmpty )
            val = this._data.shift();
        return val;
    };

}

export default Queue;


