/**
 * 房间
 */
export class Room {
    // 房间号
    roomId: number;
    // 底分
    cellScore: number;
    // 局数
    rounds: number;
    // 剩余空位
    resChair: number;
    // 玩家列表
    userList: any[];

    constructor () {

    }
    // 监听玩家进入房间
    onUserIn(): void {
        
    }
    // 监听玩家坐下
    onUserReady(): void {

    }
    // 监听玩家离开
    onUserOut(): void {

    }
}


