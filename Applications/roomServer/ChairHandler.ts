// class ChairHandler {

//     // 房间号
//     rid: number;
//     // 玩家列表
//     userList: any[];

//     constructor ( conf: IRoomConf ) {
//         this.rid = conf.roomId;
//         // 默认为3, 默认是斗地主的游戏
//         this.userList = [];
//     }

//     get resChair() {
//         let userCount = 0;
//         for ( let chairID = 0; chairID < this.userList.length; chairID++ ) {
//             if ( !this.userList[ chairID ] )
//                 continue;
//             userCount++;
//         }
//         return GAME_PLAYER - userCount;
//     }

//     isFull(): boolean {
//         return this.resChair === 0;
//     }

//     isEmpty(): boolean {
//         return this.resChair === GAME_PLAYER;
//     }

//     // 监听玩家进入房间
//     @logUserAction( "进入房间" )
//     onUserIn( user: User ): boolean {
//         let chairID = this._getFreeChair();
//         if ( chairID < 0 )
//             return false;
//         user.userStatus = EUserStatus.SIT;
//         user.chairID = chairID;
//         this.userList[ chairID ] = user;
//         return true;
//     }

//     // todo:获取该房间的空座位
//     private _getFreeChair(): number {
//         if ( !this.resChair )
//             return -1;
//         // 按顺序入座，先到先入座，不是随机入座
//         let chairId = 0;
//         for ( ; chairId < this.userList.length; chairId++ ) {
//             if ( !this.userList[ chairId ] )
//                 break;
//         }
//         return chairId--;
//     }

//     // 监听玩家准备
//     @logUserAction( "准备" )
//     onUserReady( user: User ): void {
//         user.userStatus = EUserStatus.READY;
//         // 判断是否所有人都准备好 并且开始游戏
//         let i = 0;
//         for ( ; i < this.userList.length; i++ ) {
//             if ( !this.userList[ i ] || this.userList[ i ].userStatus !== EUserStatus.READY )
//                 break;
//         }
//         if ( i === 3 )
//             this.gameStart();
//         return;
//     }

//     // todo: 监听玩家离开
//     @logUserAction( "离开房间" )
//     onUserOut( user: User ): void {
//         this.userList[ user.chairID ] = null;
//         user.userStatus = EUserStatus.FREE;
//     }

//     gameStart(): void { }
// }

// export default  ChairHandler;
