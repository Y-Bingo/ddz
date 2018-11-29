import DDZRuleMaster from './logic/ddz/DDZRule';
import { IAnalyseResult } from "./logic/ddz/DDZPokerType";
import { getLogicValue } from "./logic/PokerData"
import { logPokerType } from './utils/Log';

// let arr = [ 1, 2,, getLogicValue 3, 4, 5, 17, 18, 19, 20, 9, 3
// let remove = [ 1, 2, 4 ];

let rule = new DDZRuleMaster();
let poker1 = [ 0x03, 0x13, 0x23, 0x04, 0x15 ];
console.log( poker1.join( "," ), logPokerType( rule.getPokerType( poker1 ) ) );
let poker2 = [ 0x05, 0x15, 0x25, 0x16, 0x26, 0x36, 0x07, 0x17, 0x37, 0x27 ];
console.log( poker2.join( "," ), logPokerType( rule.getPokerType( poker2 ) ) );
let poker3 = [ 0x02, 0x12, 0x22, 0x32, 0x01, 0x11, 0x03, 0x13 ];
console.log( poker3.join( "," ), logPokerType( rule.getPokerType( poker3 ) ) );
let poker4 = [ 0x03, 0x13, 0x23, 0x33, 0x01, 0x11, 0x0A, 0x1A ];
console.log( poker4.join( "," ), logPokerType( rule.getPokerType( poker4 ) ) );
let poker5 = [ 0x02, 0x12, 0x22, 0x03, 0x13, 0x33, 0x11, 0x12, 0x05, 0x15 ];
console.log( poker5.join( "," ), logPokerType( rule.getPokerType( poker5 ) ) );

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
