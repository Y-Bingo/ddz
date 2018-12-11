import { User } from "./User";
import { EUserStatus } from "../model/UserModel";
import { logUserAction } from "../utils/Log";
import { GAME_PLAYER } from "./ddz/Constant";
import { IRoomConf, EGameStatus } from "../model/RoomModel";
import { RoundMrg } from "./RoundMrg";


/**
 * 房间
 */
export class Room extends RoundMrg {

    // 游戏类型
    game: string;
    // 底分
    cellScore: number;
    // 局数
    rounds: number;

    constructor ( conf: IRoomConf ) {
        super( conf );
        this.game = conf.game;
        this.cellScore = conf.cellScore;
        this.rounds = this.rounds;
    }

}

// 创建房间
export function createRoom( engine: any, roomConf: IRoomConf ): Room {
    let cellScore = 1;
    let rounds = 1;
    roomConf = { cellScore, rounds, ...roomConf };
    let room = new Room( roomConf );
    room.gameEngine = engine;
    return room;
}


