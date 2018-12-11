import DDZRuleMaster from './logic/ddz/DDZRule';
import { ICountAnalysis } from "./logic/ddz/DDZPokerType";
import { getLogicValue } from "./logic/PokerData"
import { logPokerType } from './utils/Log';
import { Memory } from "./utils/Memory";
import { GameEngine } from './logic/GameEngine';
import createUser from './logic/User';


let gameEngine = new GameEngine();
let user1 = createUser();
let user2 = createUser();
let user3 = createUser();
let user4 = createUser();
gameEngine.onUserIn( user1 );
gameEngine.onUserIn( user2 );
gameEngine.onUserIn( user3 );

gameEngine.onUserReady( user1 );
gameEngine.onUserReady( user2 );
gameEngine.onUserOut( user2 );
gameEngine.onUserOut( user1 );
gameEngine.onUserOut( user3 );
gameEngine.onUserReady( user3 );

gameEngine.onUserIn( user4 );
gameEngine.onUserIn( user2 );
gameEngine.onUserIn( user1 );
gameEngine.onUserReady( user2 );
gameEngine.onUserReady( user4 );
gameEngine.onUserReady( user1 );




// let arr = [ 1, 2, 3, 4, 5, 17, 18, 19, 20, 9, 3 ];
// let remove = [ 1, 2, 3, 4, 5, 17, 18, 19, 20, 9, 3 ];
// let rule = new DDZRuleMaster();

// 比较
// let poker1 = [ 0x03, 0x13, 0x23, 0x33 ];
// let poker2 = [ 0x4E, 0x4F ];
// console.log( `牌型【${ poker1.join( "," ) }】${ rule.assertOuts( poker1 ) ? "可出" : "不可出" }` );
// console.log( `牌型【${ poker1.join( "," ) }】 ${ rule.assertOuts( poker1, poker2 ) ? " < " : " >" } 牌型【${ poker2.join( "," ) }】` );

// let distribution = {};
// let result1 = rule.searchFollowOuts( [ 0x02, 0x12, 0x13, 0x23, 0x33, 0x4f, 0x4E, 0x0A, 0x0B, 0x0C, 0x0DD ],[ 0x01, 0x11 ] );
// console.log( result1 );


// let result2 = rule._searchSub( [ 0x03, 0x04, 0x05, 0x15, 0x16, 0x26, 0x36, 0x06, 0x17, 0x08, 0x18 ], 1,2 );
// console.log( result2 );

// let result3 = rule._searchSub( [ 0x03, 0x04, 0x14, 0x05, 0x06, 0x16, 0x26, 0x36, 0x17, 0x27, 0x37 ], 2, 3 );
// console.log( result3 );

// let test = [ 2, 2, 4, 2, 1 ];
// console.log( Memory.combine( test, 2 ) );

// rule._analyseDistribution( [ 0x01, 0x11, 0x02, 0x32, 0x04, 0x25, 0x36, 0x18, 0x22 ], distribution );



// // 删除
// console.log( arr.join( "," ) );
// rule.removePokerDatas( remove, arr );
// console.log( arr.join( "," ) );
// 牌型
// let poker1 = [ 0x01, 0x0A, 0x0B, 0x0C, 0x0D ];
// console.log( poker1.join( "," ), logPokerType( rule.getPokerType( poker1 ) ) );
// let poker2 = [ 0x01, 0x11, 0x21, 0x02, 0x12, 0x32, 0x31, 0x22 ];
// console.log( poker2.join( "," ), logPokerType( rule.getPokerType( poker2 ) ) );
// let poker3 = [ 0x02, 0x12, 0x22, 0x32, 0x01, 0x11, 0x03, 0x13 ];
// console.log( poker3.join( "," ), logPokerType( rule.getPokerType( poker3 ) ) );
// let poker4 = [ 0x03, 0x13, 0x23, 0x33, 0x01, 0x11, 0x0A, 0x1A ];
// console.log( poker4.join( "," ), logPokerType( rule.getPokerType( poker4 ) ) );
// let poker5 = [ 0x02, 0x12, 0x22, 0x03, 0x13, 0x33, 0x11, 0x12, 0x05, 0x15 ];
// console.log( poker5.join( "," ), logPokerType( rule.getPokerType( poker5 ) ) );
// 排序
// let arr: number[] = [ 0x11, 0x01, 0x02, 0x19, 0x28, 0x31, 0x03, 0x34, 0x4F, 0x33, 0x21, 0x22, 0x4E ];
// let before = arr.map( i => {
//     return getLogicValue( i );
// } );
// console.log( before.join( "," ) );
// rule.sortPokerList( arr );
// let after = arr.map( i => {
//     return getLogicValue( i );
// } );
// console.log( after.join( "," ) );
