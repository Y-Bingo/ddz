export const INVALID_TABLE = 65535              //无效桌子
export const INVALID_CHAIR = 65535              //无效椅子

export enum EGameStatus {
    // 游戏空闲状态
    FREE,
    // 游戏进行状态
    PLAY,
    // 游戏等待状态
    WAIT,
}

export interface IRoomConf {
    // 游戏类型
    game?: string;
    // 房间号
    roomId?: number;
    // 底分
    cellScore?: number;
    // 局数
    rounds?: number;
}

export interface IRoomModel {
    // 游戏类型
    game: string;
    // 房间号
    rid: number;
    // 底分
    cellScore: number;
    // 局数
    rounds: number;
    // 剩余空位
    resChair: number;
    // 玩家列表
    userList: any[];
    // 游戏引擎
    gameEngine: any;
}

