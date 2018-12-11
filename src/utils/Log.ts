import * as DDZ from "../logic/ddz/DDZPokerType";
import { Func } from "mocha";
import { getPattern, getValue, EPokerPattern } from "../logic/PokerData";

export function logPokerType( pokerType: DDZ.EPokerType ) {
    switch ( pokerType ) {
        case DDZ.EPokerType.CT_SINGLE:
            return "【CT_SINGLE 单牌】";
        case DDZ.EPokerType.CT_SINGLE_LINE:
            return "【CT_SINGLE_LINE 顺子】";
        case DDZ.EPokerType.CT_DOUBLE:
            return "【CT_DOUBLE 对牌】";
        case DDZ.EPokerType.CT_DOUBLE_LINE:
            return "【CT_DOUBLE_LINE 连对】";
        case DDZ.EPokerType.CT_THREE:
            return "【CT_THREE 三不带】";
        case DDZ.EPokerType.CT_THREE_TAKE_ONE:
            return "【CT_THREE_TAKE_ONE 三带一】";
        case DDZ.EPokerType.CT_THREE_TAKE_TWO:
            return "【CT_THREE_TAKE_TWO 三带二】";
        case DDZ.EPokerType.CT_THREE_LINE:
            return "【CT_THREE_LINE 三不带 飞机】"
        case DDZ.EPokerType.CT_THREE_LINE_TAKE_ONE:
            return "【CT_THREE_LINE_TAKE_ONE 三带一 飞机】"
        case DDZ.EPokerType.CT_THREE_LINE_TAKE_TWO:
            return "【CT_THREE_LINE_TAKE_TWO 三带二 飞机】"
        case DDZ.EPokerType.CT_BOMB:
            return "【CT_BOMB 炸弹】";
        case DDZ.EPokerType.CT_FOUR_TAKE_ONE:
            return "【CT_FOUR_TAKE_ONE 四带一】";
        case DDZ.EPokerType.CT_FOUR_TAKE_TWO:
            return "【CT_FOUR_TAKE_TWO 四带二】";
        case DDZ.EPokerType.CT_JOKER_BOMB:
            return "【CT_JOKER_BOMB 火箭】";
        case DDZ.EPokerType.CT_ERROR:
            return "【CT_ERROR 非正确牌型】";
    }
}

export function logUserAction( str: string ): any {
    return function ( target: any, key: string, descriptor: any ) {
        let oldValue = descriptor.value;
        descriptor.value = function () {
            console.log( `玩家【 ${ arguments[ 0 ].nickName } 】：${ str }  in  房间【${ this.rid }】` );
            return oldValue.apply( this, arguments );
        }
    }
}

export function logPokes( cards: number[] ): string {
    let str = "";
    for ( let i = 0; i < cards.length; i++ ) {
        let pattern = getPattern( cards[ i ] );
        let value = getValue( cards[ i ] );
        str += `【${ getPatternStr( pattern ) }${ getValueStr( value ) }】`;
    }
    return str;
}

function getPatternStr( pattern: EPokerPattern ): string {
    switch ( pattern ) {
        case EPokerPattern.DIAMOND:
            return "♦";
        case EPokerPattern.HEART:
            return "♥";
        case EPokerPattern.SPADE:
            return "♠";
        case EPokerPattern.CLUB:
            return "♣";
        case EPokerPattern.JOKER:
            return "☼"
        case EPokerPattern.NONE:
            return "✘"
    }
}

function getValueStr( value: number ): string {
    switch ( value ) {
        case 11:
            return " J";
        case 12:
            return " Q";
        case 13:
            return " K";
        case 14:
            return " ♀";
        case 15:
            return " ♂";
        case 10:
            return "10";
        default:
            return ` ${ value }`
    }
}
