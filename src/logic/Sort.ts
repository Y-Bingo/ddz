import { getValue, getPattern, getLogicValue, MAX_LOGIC_VALUE, MAX_PATTERN_VALUE } from './PokerData'


/**------------------ 排序 --------------------**/
// 根据牌的数值大小排序 1, 2, 3, 4, 5
export function sortByValue( a: number, b: number ): any {
    return getValue( b ) - getValue( a );
}

// 根据牌的逻辑值来排序
export function sortByLogicValue( a: number, b: number ): any {
    return getLogicValue( b ) - getLogicValue( a );
}

// 根据花色来排序 黑桃123，红心，梅花， 方块
export function sortByPatternFirst( a: number, b: number ): any {
    return getPatternFirstValue( b ) - getPatternFirstValue( a );
}
// 根据权重和花色来排序 123
export function sortByLogicFirst( a: number, b: number ): any {
    return getLogicFirstValue( b ) - getLogicFirstValue( a );
}


// 数值为重，花色为次的权重值
function getLogicFirstValue( value: number ): number {
    let weight = getLogicValue( value );
    let patten = getPattern( value );
    return weight * ( MAX_PATTERN_VALUE + 1 ) + patten;
}
// 花色为重， 数组为次的权重值
function getPatternFirstValue( value: number ): number {
    let weight = getLogicValue( value );
    let patten = getPattern( value );
    return weight + patten * ( MAX_LOGIC_VALUE + 1 );
}
