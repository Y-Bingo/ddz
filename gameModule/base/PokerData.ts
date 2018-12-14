
// 花色掩码
export const MASK_COLOR = 0xF0;
// 数值掩码
export const MASK_VALUE = 0x0F;
// 最大的逻辑值
export const MAX_LOGIC_VALUE = 19;
// 最小的逻辑值
export const MIN_LOGIC_VALUE = 3;
// 花色的数量
export const MAX_PATTERN_VALUE = 4;
// 扑克花型枚举
export enum EPokerPattern {
    // 方块
    DIAMOND,
    // 梅花
    CLUB,
    // 红桃
    HEART,
    // 黑桃
    SPADE,
    // 大小王
    JOKER,
    // 什么都不是
    NONE = 8
}

export const patternNameMap = {
    [ EPokerPattern.DIAMOND ]: "♦",
    [ EPokerPattern.CLUB ]: "♣",
    [ EPokerPattern.HEART ]: "♥",
    [ EPokerPattern.SPADE ]: "♠",
    [ EPokerPattern.JOKER ]: "☼",
    [ EPokerPattern.NONE ]: "✘"
}
// 扑克花色颜色
// export enum EPokerColor {
//     RED = 0,
//     BLACK = 1
// }
// 扑克数据
export interface IPokerData {
    /**
    * 花型
    * */
    pattern: EPokerPattern;
    // /**
    //  * 花色
    //  * */
    // color: EPokerColor;
    /**
     * 逻辑值
     * */
    logicValue: number;
    /**
     * 逻辑值权重
     * */
    weight: number;
    /**
     * 原值
     * */
    value: number;
}
/**
 * 从牌值获取数值
 * @param value 牌数据
 */
export function getValue( value: number ): number {
    return value & MASK_VALUE;
}
/**
 * 获取牌值花色
 * @param value 牌数据
 */
export function getPattern( value: number ): EPokerPattern {
    switch ( ( value & MASK_COLOR ) >> 4 ) {
        case 0:
            return EPokerPattern.DIAMOND;
        case 1:
            return EPokerPattern.CLUB;
        case 2:
            return EPokerPattern.HEART;
        case 3:
            return EPokerPattern.SPADE;
        case 4:
            if ( ( value & MASK_VALUE ) > 0x0D )
                return EPokerPattern.JOKER;
        default:
            return EPokerPattern.NONE;
    }
}
/**
 * 获取牌的逻辑值，相当于权重
 * 3-K取3-13，A取14，2取16（方便做顺子检测），大小王取18、19，A与2间隔开，2与大小王隔开，为了避免顺子
 * @param value
 */
export function getLogicValue( value: number ): number {
    let logicValue = getValue( value );
    if ( logicValue > 13 )
        logicValue += 4;
    else if ( logicValue === 1 )
        logicValue = 14;
    else if ( logicValue === 2 )
        logicValue = 16;
    return logicValue;
}
/**
 * 根据牌型和逻辑值 转换成 牌数据
 * @param pattern  牌型
 * @param logicValue 逻辑值
 */
export function makePokerData( pattern: number, logicValue: number ) {
    return ( pattern << 4 ) | logicValue;
}



