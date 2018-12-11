import { createRoom, Room } from "./Room";
import { User } from "./User";
import DDZRuleMaster from "./ddz/DDZRule";
import { logUserAction } from "../utils/Log";

/**
 * 控制游戏流程的类
 */
export class GameEngine {

    // 引擎的名字
    name: string = "ddz";
    // 房间列表
    _roomIdDict: { [ roomID: number ]: Room };
    _uIdRoomIdDict: { [ userID: number ]: number }
    gameLogic: DDZRuleMaster;

    constructor () {
        this._roomIdDict = {};
        this._uIdRoomIdDict = {};
        this.initGame();
    }

    // 初始化游戏 采用哪种游戏
    initGame(): void {
        this.gameLogic = new DDZRuleMaster();
    }

    onUserIn( user: User ): boolean {
        let roomIdDict = this._roomIdDict;
        let room: Room = null;
        for ( let roomID in roomIdDict ) {
            if ( !roomIdDict[ roomID ] || roomIdDict[ roomID ].gameStatus || roomIdDict[ roomID ].isFull() )
                continue;
            else {
                room = roomIdDict[ roomID ];
                break;
            }

        }
        if ( !room ) {
            room = createRoom( this, { roomId: genRoomId( Object.keys( this._roomIdDict ).length ), game: this.name } );
            this._roomIdDict[ room.rid ] = room;
        }
        room.onUserIn( user );
        this._uIdRoomIdDict[ user.uid ] = room.rid;
        return true;
    }

    onUserReady( user: User ): void {
        let rid = this._uIdRoomIdDict[ user.uid ];
        if ( rid && this._roomIdDict[ rid ] )
            this._roomIdDict[ rid ].onUserReady( user );
        else
            console.warn( "用户还没有坐下" );
    }

    // todo
    onUserOut( user: User ): boolean {
        let rid = this._uIdRoomIdDict[ user.uid ];
        if ( rid ) {
            this._roomIdDict[ rid ].onUserOut( user );
            delete this._uIdRoomIdDict[ user.uid ];
            // 空房间销毁掉
            if ( this._roomIdDict[ rid ].isEmpty() )
                delete this._roomIdDict[ rid ];
        }
        return true;
    }

    // 搜索房间
    getRoom( roomId: number ): Room {
        let room = this._roomIdDict[ roomId ];
        if ( room )
            return room;
        return null;
    }
}

function genRoomId( b: number ): number {
    let MAX_ROOM_ID = 15
    let random = Math.ceil( Math.random() * MAX_ROOM_ID );

    return random << 4 + b;
}
