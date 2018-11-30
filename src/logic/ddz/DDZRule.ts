import * as poker from "../PokerData";
import * as utils from "../../utils/Memory";
import { sortByPatternFirst, sortByLogicFirst } from '../Sort';
import { IAnalyseResult, EPokerMainType, EPokerType, PokerTypeAssert } from './DDZPokerType';
import {
    m_cbCardData,
    FULL_COUNT,
    SORT_TYPE,
    MAX_COUNT,
    MAX_POKER_COUNT
} from './Constant';

// 斗地主逻辑
export default class DDZRuleMaster {

    /**
     * // 牌值有效值判断
     * @param cbPokerData
     */
    isValidCard( cbPokerData: number ): boolean {
        if ( cbPokerData === 0 ) return false;
        // 花型
        let pattern = poker.getPattern( cbPokerData );
        // 逻辑值
        let logicValue = poker.getLogicValue( cbPokerData );
        // 有效判断
        if ( pattern == poker.EPokerPattern.NONE ) return false;
        if ( logicValue > poker.MAX_LOGIC_VALUE || logicValue < poker.MIN_LOGIC_VALUE ) return false;
        return true;
    }
    // 洗牌/混乱扑克
    shuffle( cbPokerDatas: number[] ): void {
        utils.Memory.copy( cbPokerDatas, m_cbCardData );
        let totalCount: number = FULL_COUNT,
            randCount: number = totalCount,
            position: number = 0;
        do {
            position = Math.floor( Math.random() * randCount );
            utils.Memory.swap( cbPokerDatas, position, randCount );
            randCount--;
        } while ( randCount );
    }
    /**
     * 手牌排序
     * @param cbPokerDatas 待排序的卡牌数组
     * @param cbSortType 排序类型
     * @todo: 按数量排序
     */
    sortPokerList( cbPokerDatas: number[], cbSortType: SORT_TYPE = SORT_TYPE.ST_LOGIC ): void {
        switch ( cbSortType ) {
            case SORT_TYPE.ST_COUNT: {
                let analyseResult = {};
                this._analyseBase( cbPokerDatas, analyseResult );

                break;
            }
            case SORT_TYPE.ST_LOGIC: {
                cbPokerDatas.sort( sortByLogicFirst );
                break;
            }
            case SORT_TYPE.ST_PATTERN: {
                cbPokerDatas.sort( sortByPatternFirst );
                break;
            }
            default: break;
        }
    }
    /**
     * 从一个牌数组中移除目标数组（ps: 出牌）
     * 对传入的原数组做操作，并不打算生成新的数组
     * @param cbRemovePoker
     * @param cbPokerDatas
     * @todo: 待优化，删除数组做到不改变元素的位置
     */
    removePokerDatas( cbRemovePoker: number[], cbPokerDatas: number[] ): void {
        let cbRemoveCount = cbRemovePoker.length;
        let cbPokerCount = cbPokerDatas.length;
        if ( cbRemoveCount > cbPokerCount )
            console.error( "remove Error. cbRemoveCount is larger than cbPokerCount" );
        let cbTempPoker: number[] = [];
        utils.Memory.copy( cbTempPoker, cbPokerDatas );
        let i = 0, j = 0;
        while ( i < cbRemoveCount ) {
            while ( j < cbPokerCount ) {
                if ( cbRemovePoker[ i ] === cbPokerDatas[ j ] ) {
                    // 交换数值
                    [ cbPokerDatas[ cbPokerCount - 1 ], cbPokerDatas[ j ] ] = [ cbPokerDatas[ j ], cbPokerDatas[ cbPokerCount - 1 ] ];
                    // utils.Memory.swap( cbPokerDatas, j, cbPokerCount - 1 );
                    cbPokerCount--;
                    continue;
                }
                j++;
            }
            i++;
            j = 0;
        }
        let removeCount = cbPokerDatas.length - cbPokerCount;
        while ( removeCount ) {
            cbPokerDatas.pop();
            removeCount--;
        }
    }
    // 查找扑克
    isCardExists( cbPokerDatas: number[], cbSearchPoker: number ): boolean {
        return cbPokerDatas.indexOf( cbSearchPoker ) >= 0;
    }
    /**
     * 获取扑克类型 不同的游戏需要不同的类型判断
     * @param cbPokerDatas
     */
    getPokerType( cbPokerDatas: number[] ): EPokerType {
        let cbPokerCount = cbPokerDatas.length;
        // 参数校验
        if ( cbPokerCount === 0 ) return EPokerType.CT_ERROR;
        // 检验牌值是否符合
        for ( let i = 0; i < cbPokerCount; i++ ) {
            if ( !this.isValidCard( cbPokerDatas[ i ] ) ) {
                console.error( `牌值【${ cbPokerDatas[ i ] }】不是合法牌值` );
                return EPokerType.CT_ERROR;
            }
        }
        // 简单牌型分析
        switch ( cbPokerCount ) {
            case 1: // 单牌
                return EPokerType.CT_SINGLE;
            case 2: // 对牌
                if ( PokerTypeAssert.isDouble( cbPokerDatas ) )
                    return EPokerType.CT_DOUBLE;
                else if ( PokerTypeAssert.isJokerBomb( cbPokerDatas ) )
                    return EPokerType.CT_JOKER_BOMB;
                else
                    return EPokerType.CT_ERROR;
            // case 3: // 三牌
            //     if ( PokerTypeAssert.isTree( cbPokerDatas ) )
            //         return EPokerType.CT_THREE;
            //     else
            //         return EPokerType.CT_ERROR;
            // case 4: // 炸弹
            //     if ( PokerTypeAssert.isBoom( cbPokerDatas ) )
            //         return EPokerType.CT_BOMB;
        }
        // 复杂牌型分析
        let anlyzerResult: IAnalyseResult = {};
        this._analyseBase( cbPokerDatas, anlyzerResult );
        switch ( PokerTypeAssert.getMainType( anlyzerResult ) ) {
            case EPokerMainType.CMT_ONE:
                // 顺子
                if ( PokerTypeAssert.isSingleLine( cbPokerDatas, anlyzerResult ) )
                    return EPokerType.CT_SINGLE_LINE;
                break;
            case EPokerMainType.CMT_TWO:
                // 连对
                if ( PokerTypeAssert.isDoubleLine( cbPokerDatas, anlyzerResult ) )
                    return EPokerType.CT_DOUBLE_LINE;
                break;
            case EPokerMainType.CMT_THREE:
                if ( anlyzerResult.cbBlockCount[ 2 ] === 1 ) {
                    // 三不带
                    if ( PokerTypeAssert.isTree( cbPokerDatas, anlyzerResult ) )
                        return EPokerType.CT_THREE;
                    // 三带一
                    if ( PokerTypeAssert.isThreeTakeOne( cbPokerDatas, anlyzerResult ) )
                        return EPokerType.CT_THREE_TAKE_ONE;
                    // 三带二
                    if ( PokerTypeAssert.isThreeTakeTwo( cbPokerDatas, anlyzerResult ) )
                        return EPokerType.CT_THREE_TAKE_TWO;
                } else {
                    // 三不带飞机
                    if ( PokerTypeAssert.isThreeLine( cbPokerDatas, anlyzerResult ) )
                        return EPokerType.CT_THREE_LINE;
                    // 三带一 飞机
                    if ( PokerTypeAssert.isThreeLineTakeOne( cbPokerDatas, anlyzerResult ) )
                        return EPokerType.CT_THREE_LINE_TAKE_ONE;
                    // 三带二 飞机
                    if ( PokerTypeAssert.isThreeLineTakeTwo( cbPokerDatas, anlyzerResult ) )
                        return EPokerType.CT_THREE_LINE_TAKE_TWO;
                }
                break;
            case EPokerMainType.CMT_FOUR:
                // 四不带
                if ( PokerTypeAssert.isBoom( cbPokerDatas, anlyzerResult ) )
                    return EPokerType.CT_BOMB;
                // 四带一
                if ( PokerTypeAssert.isFourTakeOne( cbPokerDatas, anlyzerResult ) )
                    return EPokerType.CT_FOUR_TAKE_ONE;
                // 四带二
                if ( PokerTypeAssert.isFourTakeTwo( cbPokerDatas, anlyzerResult ) )
                    return EPokerType.CT_FOUR_TAKE_TWO;
                break;
            case EPokerMainType.CMT_NONE:
                return EPokerType.CT_ERROR;
                break;
        }
        return EPokerType.CT_ERROR;
    }
    /**
     * 比较出牌
     * @param firstOuts 先手
     * @param lastOuts  后手
     */
    comparePoker( firstOuts: number[], lastOuts: number[] ): boolean {
        let firstOutType = this.getPokerType( firstOuts );
        let lastOutType = this.getPokerType( lastOuts );

        return;
    }

    /**
     * 卡牌分析，把逻辑值相同的牌都归并到同一个数组( ps：使用前先对数据进行排序 )
     * @param cbPokerDatas
     * @param analyseResult
     */
    private _analyseBase( cbPokerDatas: number[], analyseResult: IAnalyseResult ): void {
        this.clearAnalyse( analyseResult );
        cbPokerDatas.sort( sortByLogicFirst );
        // 扑克分析
        let i = 0, j = 0, cbPokerCount = cbPokerDatas.length;
        // 同牌值计数
        let sameCount = 0;
        while ( i < cbPokerCount ) {
            if ( poker.getValue( cbPokerDatas[ i ] ) === poker.getValue( cbPokerDatas[ j ] ) ) {
                sameCount++;
                j++;
            } else {
                // 张数超过了 正常牌值
                if ( sameCount <= MAX_POKER_COUNT ) {
                    analyseResult.cbBlockCount[ sameCount - 1 ]++;
                    analyseResult.cbPokerGroups[ sameCount - 1 ].push( poker.getLogicValue( cbPokerDatas[ 0 ] ) );
                } else {
                    console.error( "牌值大于最大张数" );
                }
                i += sameCount;
                j = i;
                sameCount = 0;
            }
        }
    }
    /**
     * 重置/初始化分析结果
     * @param analyseResult
     */
    private clearAnalyse( analyseResult: IAnalyseResult ): void {
        analyseResult.cbBlockCount = [];
        analyseResult.cbPokerGroups = [];
        for ( let i = 0; i < 4; i++ ) {
            analyseResult.cbBlockCount[ i ] = 0;
            analyseResult.cbPokerGroups[ i ] = [];
        }
    }


}

