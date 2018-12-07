import * as poker from "../PokerData";
import * as utils from "../../utils/Memory";
import PokerTypeSearch from "./DDZPokerTypeSearch";
import { sortByPatternFirst, sortByLogicFirst, sortByLogicFirstAsc } from '../Sort';
import { ICountAnalysis, EPokerMainType, EPokerType, PokerTypeAssert, IWeightAnalysis, IAnalysis, IDistribution } from './DDZPokerType';
import {
    m_cbCardData,
    FULL_COUNT,
    SORT_TYPE,
    MAX_COUNT,
    MAX_POKER_COUNT,
    SJOKER,
    LJOKER
} from './Constant';

let searchMrg: PokerTypeSearch = new PokerTypeSearch();

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
    /**
     * 洗牌/混乱扑克
     * @param cbPokerDatas
     */
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
     * @param removeData
     * @param srcData
     * @todo: 待优化，删除数组做到不改变元素的位置
     */
    removePokerDatas( removeData: number[], srcData: number[] ): void {
        utils.Memory.remove( removeData, srcData );
    }
    // 查找扑克
    isCardExists( cbPokerDatas: number[], cbSearchPoker: number ): boolean {
        return cbPokerDatas.indexOf( cbSearchPoker ) >= 0;
    }
    /**
     * 获取扑克类型 不同的游戏需要不同的类型判断
     * @param cbPokerDatas
     */
    getPokerType( cbPokerDatas: number[], anlyzerResult?: ICountAnalysis ): EPokerType {
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
        anlyzerResult = anlyzerResult || {};
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
     * 验证出牌 ( 回合首先出牌的 )
     * @param lastOuts
     * @param nextOuts
     */
    assertOuts( lastOuts: number[], nextOuts?: number[] ): boolean {
        if ( !nextOuts || !nextOuts.length ) {
            let firstOutType = this.getPokerType( lastOuts );
            return firstOutType !== EPokerType.CT_ERROR;
        }
        return this.comparePoker( lastOuts, nextOuts );
    }
    /**
     * 比较出牌
     * @param lastOuts 先手
     * @param nextOuts  后手
     * @returns boolean 如果后手大于先手，则能出牌，否则，牌型不对，牌型错误均不能出牌；
     */
    comparePoker( lastOuts: number[], nextOuts: number[] ): boolean {
        let firstAnalysis = {},
            lastAnalysis = {};
        let firstOutType = this.getPokerType( lastOuts, firstAnalysis );
        let lastOutType = this.getPokerType( nextOuts, lastAnalysis );
        // 牌型比较
        if ( firstOutType === EPokerType.CT_JOKER_BOMB ) return false;
        if ( lastOutType === EPokerType.CT_JOKER_BOMB ) return true;
        if ( firstOutType !== lastOutType ) {
            if ( lastOutType !== EPokerType.CT_BOMB ) return false;
            else return true;
        }
        // 牌数量比较
        if ( lastOuts.length !== nextOuts.length ) return false;
        // 权重比较
        let firstWeight = this.getPokersWeight( lastOuts, firstAnalysis );
        let lastWeight = this.getPokersWeight( nextOuts, lastAnalysis );
        switch ( lastOutType ) {
            case EPokerType.CT_SINGLE:
            case EPokerType.CT_SINGLE_LINE:
            case EPokerType.CT_DOUBLE:
            case EPokerType.CT_DOUBLE_LINE:
            case EPokerType.CT_THREE:
            case EPokerType.CT_THREE_TAKE_ONE:
            case EPokerType.CT_THREE_TAKE_TWO:
            case EPokerType.CT_THREE_LINE:
            case EPokerType.CT_THREE_LINE_TAKE_ONE:
            case EPokerType.CT_THREE_LINE_TAKE_TWO:
            case EPokerType.CT_FOUR_TAKE_ONE:
            case EPokerType.CT_FOUR_TAKE_TWO:
            case EPokerType.CT_BOMB:
                return firstWeight < lastWeight;
        }
        return false;
    }

    /**
     * 查询跟牌
     * @param myhands
     * @param lastOuts
     */
    searchFollowOuts( myhands: number[], lastOuts?: number[] ): number[][] {
        myhands.sort( sortByLogicFirst );
        if ( !lastOuts || !lastOuts.length ) {
            return this._searchFristOuts( myhands );
        }
        return this._searchFollowOuts( lastOuts, myhands );
    }
    /** ---------------------------------------- 牌型搜索 -------------------------------- */
    /**
     * 查询回合首次出牌
     * @param myhands
     */
    private _searchFristOuts( myhands: number[] ): number[][] {
        return [];
    }

    private _searchFollowOuts( lastOuts: number[], myhands: number[] ): number[][] {
        let lastAnalysis = {};
        let lastOutType = this.getPokerType( lastOuts, lastAnalysis );
        let lastWeight = this.getPokersWeight( lastOuts, lastAnalysis );
        let result = [];
        let seqLen = 0;
        switch ( lastOutType ) {
            case EPokerType.CT_SINGLE:
                result.push.apply( result, searchMrg._searchSingle( myhands, lastWeight ) );
                break;
            case EPokerType.CT_SINGLE_LINE:
                seqLen = lastAnalysis[ 0 ].length;
                result.push.apply( result, searchMrg._searchSingleLine( myhands, lastWeight, seqLen ) );
                break;
            case EPokerType.CT_DOUBLE:
                result.push.apply( result, searchMrg._searchDouble( myhands, lastWeight ) );
                break;
            case EPokerType.CT_DOUBLE_LINE:
                seqLen = lastAnalysis[ 1 ].length;
                result.push.apply( result, searchMrg._searchDoubleLine( myhands, lastWeight, seqLen ) );
                break;
            case EPokerType.CT_THREE:
                result.push.apply( result, searchMrg._searchThree( myhands, lastWeight ) );
                break;
            case EPokerType.CT_THREE_TAKE_ONE:
                result.push.apply( result, searchMrg._searchThreeTakeOne( myhands, lastWeight ) );
                break;
            case EPokerType.CT_THREE_LINE_TAKE_TWO:
                result.push.apply( result, searchMrg._searchThreeTakeTwo( myhands, lastWeight ) );
                break;
            case EPokerType.CT_THREE_LINE:
                seqLen = lastAnalysis[ 2 ].length;
                result.push.apply( result, searchMrg._searchThreeLine( myhands, lastWeight, seqLen ) );
                break;
            case EPokerType.CT_THREE_LINE_TAKE_ONE:
                seqLen = lastAnalysis[ 2 ].length;
                result.push.apply( result, searchMrg._searchThreeLineTakeOne( myhands, lastWeight, seqLen ) );
                break;
            case EPokerType.CT_THREE_LINE_TAKE_TWO:
                seqLen = lastAnalysis[ 2 ].length;
                result.push.apply( result, searchMrg._searchThreeLineTakeTwo( myhands, lastWeight, seqLen ) );
                break;
            case EPokerType.CT_BOMB:
                result.push.apply( result, searchMrg._searchBoom( myhands, lastWeight ) );
                break;
            case EPokerType.CT_FOUR_TAKE_ONE:
                result.push.apply( result, searchMrg._searchFourTakeOne( myhands, lastWeight ) );
                break;
            case EPokerType.CT_FOUR_TAKE_TWO:
                result.push.apply( result, searchMrg._searchFourTakeTwo( myhands, lastWeight ) );
                break;
            case EPokerType.CT_ERROR:
                console.error( "待跟牌型错误" );
            case EPokerType.CT_JOKER_BOMB:
            default:
                return result;
        }
        return result;
    }


    /**
     * 获取牌型的权重
     * @param cbPokerDatas
     * @param analysis
     */
    private getPokersWeight( cbPokerDatas: number[], analysis: IAnalysis ): number {
        if ( !analysis.cards || !analysis.cards.length ) {
            this.clearAnalyse( analysis );
            this._analyseBase( cbPokerDatas, analysis );
        }
        switch ( PokerTypeAssert.getMainType( analysis ) ) {
            case EPokerMainType.CMT_ONE:
                return poker.getLogicValue( analysis.cbPokerGroups[ 0 ][ 0 ] );
            case EPokerMainType.CMT_TWO:
                return poker.getLogicValue( analysis.cbPokerGroups[ 1 ][ 0 ] );
            case EPokerMainType.CMT_THREE:
                return poker.getLogicValue( analysis.cbPokerGroups[ 2 ][ 0 ] );
            case EPokerMainType.CMT_FOUR:
                return poker.getLogicValue( analysis.cbPokerGroups[ 3 ][ 0 ] );
            default:
                console.warn( `非正常牌值主导类型，获取不了权重` )
        }
        return 0;
    }
    /**
     * 卡牌分析，把逻辑值相同的牌都归并到同一个数组( ps：使用前先对数据进行排序 )
     * @param cbPokerDatas
     * @param analyseResult
     */
    private _analyseBase( cbPokerDatas: number[], analyseResult: ICountAnalysis ): void {
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
                    analyseResult.cbPokerGroups[ sameCount - 1 ].push( cbPokerDatas[ i ] );
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
    private clearAnalyse( analyseResult: IAnalysis ): void {
        analyseResult.cbBlockCount = [];
        analyseResult.cbPokerGroups = [];
        analyseResult.cards = [];
        analyseResult.pokerType = EPokerType.CT_ERROR;
        analyseResult.weight = 0;
        for ( let i = 0; i < 4; i++ ) {
            analyseResult.cbBlockCount[ i ] = 0;
            analyseResult.cbPokerGroups[ i ] = [];
        }
    }


}

