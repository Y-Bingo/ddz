// import { UserModel } from "../../core/model/UserModel";

// const MAX_ROOM_ID = 100;
// const ROOM_ID_ARR = ( function () {
//     let arr = [];
//     for ( let i = 0; i < MAX_ROOM_ID; i++ )
//         arr.push( i );
//     for ( let lt = MAX_ROOM_ID, gt = 0; lt >= 0; lt-- ) {
//         gt = Math.floor( Math.random() * lt );
//         [ arr[ lt ], arr[ gt ] ] = [ arr[ gt ], arr[ lt ] ];
//     }
//     return ROOM_ID_ARR;
// } )();
// /**
//  * 一个server与一个游戏模块结合
//  * 管理一个房间
//  * 处理玩家的进房
//  * 不同游戏不同server
//  */
// export default class RoomServer {
//     // 房间号
//     rid: number = ROOM_ID_ARR.pop();
//     // 玩家列表
//     userList: UserModel[] = [];
//     // 房间容量
//     capacity: number = 100;

//     isFull(): boolean {

//     }

//     isEmpty(): boolean {

//     }

//     onUserIn( user: User ): boolean {

//     }

//     onUserOut( user: User ): void {

//     }

// }

// function genRoomId( b: number ): number {

// }

// // // 创建房间
// // export function createRoom( engine: any, roomConf: IRoomConf ): RoomServer {
// //     let cellScore = 1;
// //     let rounds = 1;
// //     roomConf = { cellScore, rounds, ...roomConf };
// //     let room = new RoomServer( roomConf );
// //     room.gameEngine = engine;
// //     return room;
// // }
