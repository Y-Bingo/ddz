import { SJOKER, LJOKER } from "./Constant";
import * as  poker from "../../../base/PokerData";
import { sortByLogicValue } from "../../../base/Sort";
import { Memory } from "../../../../utils/Memory";

/**
 * 扑克主导类型牌型
 */
export enum EPokerMainType {
    // 单牌为主的牌型
    CMT_ONE = 1,
    // 对牌为主的牌型
    CMT_TWO = 2,
    // 三牌为主导的牌型
    CMT_THREE = 3,
    // 四牌位主导的牌型
    CMT_FOUR = 4,
    // 四不像牌型
    CMT_NONE = 0,
}
/**
 * 扑克牌出牌类型
 */
export enum EPokerType {
    // 错误类型
    CT_ERROR = 0,
    // 单牌类型
    CT_SINGLE = 1,
    // 单连类型: 顺子
    CT_SINGLE_LINE = 2,
    // 对牌类型
    CT_DOUBLE = 3,
    // 对连类型：飞机对牌
    CT_DOUBLE_LINE = 4,
    // 三条类型
    CT_THREE = 5,
    // 三带一
    CT_THREE_TAKE_ONE = 6,
    // 三带一对
    CT_THREE_TAKE_TWO = 7,
    // 三连类型：飞机三连
    CT_THREE_LINE = 8,
    // 三连带单：飞机带相同数量单牌
    CT_THREE_LINE_TAKE_ONE = 9,
    // 三连带对： 飞机带相同数量双牌
    CT_THREE_LINE_TAKE_TWO = 10,
    // 四带两单
    CT_FOUR_TAKE_ONE = 11,
    // 四带两对
    CT_FOUR_TAKE_TWO = 12,
    // 炸弹类型
    CT_BOMB = 13,
    // 火箭类型
    CT_JOKER_BOMB = 14
}
/**
 * 牌型分布数据结构
 */
export interface ICountAnalysis {
    /**
     * 对应cbCardData下数组的长度
     * */
    cbBlockCount?: number[];  //扑克数目
    /**
     * 一维对应等值数量，一维下的数组保存的是所有等值的牌值
     * */
    cbPokerGroups?: number[][];  //扑克数据
}
// 牌型分析
export interface ITypeAnalysis extends ICountAnalysis {
    // 牌型
    pokerType?: EPokerType;
}
// 权重分析
export interface IWeightAnalysis extends ITypeAnalysis {
    weight?: number; // [ 3 , 19 ];
}
// 牌型分析
export interface IAnalysis extends IWeightAnalysis {
    // 牌列表
    cards?: number[];
}
// 牌型分布分析
export interface IDistribution {
    cardsSet?: number[][];
    cardsMap?: { [ value: number ]: number[] };
}
/**
 * 牌型验证
 */
export class PokerTypeAssert {
    // 主要是哪种类型的牌型: 1 牌、2 牌、3 牌、4 牌
    static getMainType( analyseResult: ICountAnalysis ): number {
        let oneCount = analyseResult.cbBlockCount[ 0 ];
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        let fourCount = analyseResult.cbBlockCount[ 3 ];
        if ( fourCount > 0 && threeCount === 0 ) // 四牌主导的牌型是不会出现三牌的
            return EPokerMainType.CMT_FOUR;
        else if ( threeCount > 0 ) // 三牌出过的，其他牌型组都有可能出现的
            return EPokerMainType.CMT_THREE;
        else if ( twoCount > 0 && oneCount === 0 ) // 二牌主导的牌型，是不会出现一牌的
            return EPokerMainType.CMT_TWO;
        else if ( oneCount > 0 )
            return EPokerMainType.CMT_ONE;
        else // （ 二牌中出现一牌）（）
            return EPokerMainType.CMT_NONE;
    }
    // 是否连续的
    static isSeq( cbPokerGroup: number[] ): boolean {
        let cbPokerTemp: number[] = [];
        Memory.copy( cbPokerTemp, cbPokerGroup );
        // 降序排序
        cbPokerTemp.sort( sortByLogicValue );
        //连牌判断
        let len = cbPokerTemp.length;
        let i = 0;
        while ( i < len - 1 ) {
            if ( poker.getLogicValue( cbPokerTemp[ i ] ) - 1 !== poker.getLogicValue( cbPokerTemp[ i + 1 ] ) )
                return false;
            i++;
        }
        return true;
    }
    // 是否为顺子
    static isSingleLine( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        let oneCount = analyseResult.cbBlockCount[ 0 ];
        let cbPokerGroup = analyseResult.cbPokerGroups[ 0 ];
        if (
            oneCount >= 5 &&
            ( oneCount === cbPokerDatas.length ) &&
            PokerTypeAssert.isSeq( cbPokerGroup )
        )
            return true;
        return false;
    }
    // 是否为对牌
    static isDouble( cbPokerDatas: number[] ): boolean {
        return poker.getLogicValue( cbPokerDatas[ 0 ] ) === poker.getLogicValue( cbPokerDatas[ 1 ] );
    }
    // 是否为连对 需要大于三对
    static isDoubleLine( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        let cbPokerGroup = analyseResult.cbPokerGroups[ 1 ];
        if (
            twoCount >= 3 &&
            ( ( twoCount * 2 ) === cbPokerDatas.length ) &&
            PokerTypeAssert.isSeq( cbPokerGroup )
        )
            return true;
        return false;
    }
    // 是否为三牌
    static isTree( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        return threeCount === 1 && threeCount * 3 === cbPokerDatas.length;
    }
    // 三带一
    static isThreeTakeOne( cbPokerDatas: number[], analyseResult: ICountAnalysis ): boolean {
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        let oneCount = analyseResult.cbBlockCount[ 0 ];
        return ( threeCount === oneCount ) &&
            ( threeCount * 3 + oneCount ) === cbPokerDatas.length;
    }
    // 三带二
    static isThreeTakeTwo( cbPokerDatas: number[], analyseResult: ICountAnalysis ): boolean {
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        return ( threeCount === twoCount ) &&
            ( threeCount * 3 + twoCount * 2 ) === cbPokerDatas.length;
    }
    // 三不带飞机
    static isThreeLine( cbPokerDatas: number[], analyseResult: ICountAnalysis ): boolean {
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        let cbPokerGroup = analyseResult.cbPokerGroups[ 2 ];
        if (
            threeCount >= 2 &&
            ( ( threeCount * 3 ) === cbPokerDatas.length ) &&
            PokerTypeAssert.isSeq( cbPokerGroup )
        )
            return true;
        return false;
    }
    // 三带一的飞机
    static isThreeLineTakeOne( cbPokerDatas: number[], analyseResult: ICountAnalysis ): boolean {
        let fourCount = analyseResult.cbBlockCount[ 3 ];
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        let oneCount = analyseResult.cbBlockCount[ 0 ];
        let cbPokerGroup = analyseResult.cbPokerGroups[ 2 ];
        // 1 : 1的关系 排除 333 444 556 789 的牌型
        if ( threeCount === ( fourCount * 4 + twoCount * 2 + oneCount ) )
            if (
                threeCount >= 2 &&
                ( ( threeCount * 4 ) === cbPokerDatas.length ) &&
                PokerTypeAssert.isSeq( cbPokerGroup )
            )
                return true;
        return false;

    }
    // 三带二的飞机
    static isThreeLineTakeTwo( cbPokerDatas: number[], analyseResult: ICountAnalysis ): boolean {
        let fourCount = analyseResult.cbBlockCount[ 3 ];
        let threeCount = analyseResult.cbBlockCount[ 2 ];
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        let cbPokerGroup = analyseResult.cbPokerGroups[ 2 ];
        if ( threeCount === ( fourCount * 2 + twoCount ) )
            if (
                threeCount >= 2 &&
                ( ( threeCount * 3 + fourCount * 4 + twoCount * 2 ) === cbPokerDatas.length ) &&
                PokerTypeAssert.isSeq( cbPokerGroup )
            )
                return true;
        return false;
    }
    // 是否为炸弹
    static isBoom( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        // let p1 = poker.getLogicValue( cbPokerDatas[ 0 ] ),
        //     p2 = poker.getLogicValue( cbPokerDatas[ 1 ] ),
        //     p3 = poker.getLogicValue( cbPokerDatas[ 2 ] ),
        //     p4 = poker.getLogicValue( cbPokerDatas[ 3 ] );
        // return p1 === p2 && p2 === p3 && p3 === p4 && cbPokerDatas.length === 4;
        let fourCount = analyseResult.cbBlockCount[ 3 ];
        return fourCount === 1 && fourCount * 4 === cbPokerDatas.length;
    }
    // 四带两单
    static isFourTakeOne( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        let fourCount = analyseResult.cbBlockCount[ 3 ];
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        let oneCount = analyseResult.cbBlockCount[ 0 ];
        //  1 : 2的关系
        if ( fourCount * 2 === ( twoCount * 2 + oneCount ) ) {
            if (
                fourCount === 1 &&
                fourCount * 4 + twoCount * 2 + oneCount === cbPokerDatas.length
            )
                return true;
        }
        return false;
    }
    // 四带两双
    static isFourTakeTwo( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        let fourCount = analyseResult.cbBlockCount[ 3 ];
        let twoCount = analyseResult.cbBlockCount[ 1 ];
        if ( fourCount === 1 )
            if ( fourCount * 4 + twoCount * 2 === cbPokerDatas.length )
                return true;
        if ( fourCount === 2 )
            if ( fourCount * 4 === cbPokerDatas.length )
                return true;
        return false;
    }
    // 是否为火箭
    static isJokerBomb( cbPokerDatas: number[], analyseResult?: ICountAnalysis ): boolean {
        let poker1 = cbPokerDatas[ 0 ];
        let poker2 = cbPokerDatas[ 1 ];
        return ( poker1 === SJOKER || poker1 === LJOKER ) && ( poker2 === SJOKER || poker2 === LJOKER );
    }
}

