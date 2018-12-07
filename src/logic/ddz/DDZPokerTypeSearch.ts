import * as poker from "../PokerData";
import * as utils from "../../utils/Memory";
import { sortByLogicFirst, sortByLogicFirstAsc } from '../Sort';
import { ICountAnalysis, EPokerMainType, EPokerType, PokerTypeAssert, IDistribution } from './DDZPokerType';
import {
    m_cbCardData,
    FULL_COUNT,
    SORT_TYPE,
    MAX_COUNT,
    MAX_POKER_COUNT,
    SJOKER,
    LJOKER
} from './Constant';

export default class PokerTypeSearch {
    // 查找单牌
    _searchSingle( cbPokerDatas: number[], startWeight: number ): number[][] {
        let combo = 1;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        return this._searchCombo( distribution, combo, startWeight );
    }
    // 查找顺子
    _searchSingleLine( cbPokerDatas: number[], startWeight: number, combo: number ): number[][] {
        let result = [];
        let sameCount = 1;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let { cardsMap, cardsSet } = distribution;
        let lineSets = this._searchSeq( distribution, sameCount, startWeight, combo );
        let outs: number[] = [];
        for ( let i = 0; i < lineSets.length; i++ ) {
            outs = [];
            for ( let j = 0; j < lineSets[ i ].length; j++ ) {
                for ( let count = 0; count < sameCount; count++ )
                    outs.push( cardsMap[ lineSets[ i ][ j ] ][ count ] );
            }
            result.push( outs );
        }
        return result;
    }
    // 查找对牌
    _searchDouble( cbPokerDatas: number[], startWeight: number ): number[][] {
        let combo = 2;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        return this._searchCombo( distribution, combo, startWeight );
    }
    // 查找连对
    _searchDoubleLine( cbPokerDatas: number[], startWeight: number, combo ): number[] {
        let result = [];
        let sameCount = 2;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let { cardsMap, cardsSet } = distribution;
        let lineSets = this._searchSeq( distribution, sameCount, startWeight, combo );
        let outs: number[] = [];
        for ( let i = 0; i < lineSets.length; i++ ) {
            outs = [];
            for ( let j = 0; j < lineSets[ i ].length; j++ ) {
                for ( let count = sameCount - 1; count >= 0; count-- )
                    outs.push( cardsMap[ lineSets[ i ][ j ] ][ count ] );
            }
            result.push( outs );
        }
        return result;
    }
    // 查找三不带
    _searchThree( cbPokerDatas: number[], startWeight: number ): number[][] {
        let combo = 3;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        return this._searchCombo( distribution, combo, startWeight );
    }
    // 查找三不带 飞机
    _searchThreeLine( cbPokerDatas: number[], startWeight: number, combo: number ): number[] {
        let result = [];
        let sameCount = 3;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let { cardsMap, cardsSet } = distribution;
        let lineSet: number[][] = this._searchSeq( distribution, sameCount, startWeight, combo );
        let outs: number[] = [];
        for ( let i = 0; i < lineSet.length; i++ ) {
            outs = [];
            for ( let j = 0; j < lineSet[ i ].length; j++ ) {
                for ( let count = sameCount - 1; count >= 0; count-- )
                    outs.push( cardsMap[ lineSet[ i ][ j ] ][ count ] );
            }
            result.push( outs );
        }
        return result;
    }
    // 查找三带一
    _searchThreeTakeOne( cbPokerDatas: number[], startWeight: number ): number[] {
        let combo = 3;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let threeSet = this._searchCombo( distribution, combo, startWeight );
        let result = [];
        // 剩牌
        let cbResPokerDatas = [];
        let subSet = [];
        utils.Memory.copy( cbResPokerDatas, cbPokerDatas );
        for ( let i = 0; i < threeSet.length; i++ ) {
            utils.Memory.remove( threeSet[ i ], cbResPokerDatas );
            subSet = this._searchSub( cbResPokerDatas, 1, 1 );
            if ( !subSet.length ) break;
            for ( let j = 0; j < subSet.length; j++ ) {
                result.push( [].concat( threeSet[ i ], subSet[ j ] ) );
            }
        }
        return result;
    }
    // 查找三带一 飞机
    _searchThreeLineTakeOne( cbPokerDatas: number[], startWeight: number, seqLen: number ): number[] {
        let result = [];
        let sameCount = 3;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let { cardsMap, cardsSet } = distribution;
        let lineSet = this._searchSeq( distribution, sameCount, startWeight, seqLen );
        let outs: number[] = [];
        let threeLineSet: number[][] = [];
        for ( let i = 0; i < lineSet.length; i++ ) {
            outs = [];
            for ( let j = 0; j < lineSet[ i ].length; j++ ) {
                for ( let count = sameCount - 1; count >= 0; count-- )
                    outs.push( cardsMap[ lineSet[ i ][ j ] ][ count ] );
            }
            threeLineSet.push( outs );
        }
        // 剩牌
        let cbResPokerDatas = [];
        let subSet = [];
        utils.Memory.copy( cbResPokerDatas, cbPokerDatas );
        for ( let i = 0; i < threeLineSet.length; i++ ) {
            utils.Memory.remove( threeLineSet[ i ], cbResPokerDatas );
            subSet = this._searchSub( cbResPokerDatas, 1, seqLen );
            if ( !subSet.length ) break;
            for ( let j = 0; j < subSet.length; j++ ) {
                result.push( [].concat( threeLineSet[ i ], subSet[ j ] ) );
            }
        }
        return result;
    }
    // 查找 三带二
    _searchThreeTakeTwo( cbPokerDatas: number[], startWeight: number ): number[] {
        let combo = 3;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let threeSet = this._searchCombo( distribution, combo, startWeight );
        let result = [];
        let cbResPokerDatas = [];
        let subSet = [];
        utils.Memory.copy( cbResPokerDatas, cbPokerDatas );
        for ( let i = 0; i < threeSet.length; i++ ) {
            utils.Memory.remove( threeSet[ i ], cbResPokerDatas );
            subSet = this._searchSub( cbResPokerDatas, 2, 1 );
            if ( !subSet.length ) break;
            for ( let j = 0; j < subSet.length; j++ ) {
                result.push( [].concat( threeSet[ i ], subSet[ j ] ) );
            }
        }
        return result;
    }
    // 查找 三带二 飞机
    _searchThreeLineTakeTwo( cbPokerDatas: number[], startWeight: number, seqLen: number ): number[] {
        let result = [];
        let combo = 3;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let { cardsMap, cardsSet } = distribution;
        let lineSet = this._searchSeq( distribution, combo, startWeight, seqLen );
        let outs: number[] = [];
        let threeLineSet: number[][] = [];
        for ( let i = 0; i < lineSet.length; i++ ) {
            outs = [];
            for ( let j = 0; j < lineSet[ i ].length; j++ ) {
                for ( let count = combo - 1; count >= 0; count-- )
                    outs.push( cardsMap[ lineSet[ i ][ j ] ][ count ] );
            }
            threeLineSet.push( outs );
        }
        // 剩牌
        let cbResPokerDatas = [];
        let subSet = [];
        utils.Memory.copy( cbResPokerDatas, cbPokerDatas );
        for ( let i = 0; i < threeLineSet.length; i++ ) {
            utils.Memory.remove( threeLineSet[ i ], cbResPokerDatas );
            subSet = this._searchSub( cbResPokerDatas, 2, seqLen );
            if ( !subSet.length ) break;
            for ( let j = 0; j < subSet.length; j++ ) {
                result.push( [].concat( threeLineSet[ i ], subSet[ j ] ) );
            }
        }
        return result;
    }
    // 查找 炸弹 包括王炸
    _searchBoom( cbPokerDatas: number[], startWeight: number ): number[][] {
        let combo = 4;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let result: number[][] = this._searchCombo( distribution, combo, startWeight );
        if ( ( cbPokerDatas.indexOf( SJOKER ) >= 0 ) && ( cbPokerDatas.indexOf( LJOKER ) >= 0 ) )
            result.push( [ SJOKER, LJOKER ] )
        return result;
    }
    // 查找 四带两单
    _searchFourTakeOne( cbPokerDatas: number[], startWeight: number ): number[] {
        let combo = 4;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let threeSet = this._searchCombo( distribution, combo, startWeight );
        let result = [];
        let cbResPokerDatas = [];
        let subSet = [];
        utils.Memory.copy( cbResPokerDatas, cbPokerDatas );
        for ( let i = 0; i < threeSet.length; i++ ) {
            utils.Memory.remove( threeSet[ i ], cbResPokerDatas );
            subSet = this._searchSub( cbResPokerDatas, 1, 2 );
            if ( !subSet.length ) break;
            for ( let j = 0; j < subSet.length; j++ ) {
                result.push( [].concat( threeSet[ i ], subSet[ j ] ) );
            }
        }
        return result;
    }
    // 查找 四带两对
    _searchFourTakeTwo( cbPokerDatas: number[], startWeight: number ): number[] {
        let combo = 4;
        let distribution: IDistribution = {};
        this._analyseDistribution( cbPokerDatas, distribution );
        let threeSet = this._searchCombo( distribution, combo, startWeight );
        let result = [];
        let cbResPokerDatas = [];
        let subSet = [];
        utils.Memory.copy( cbResPokerDatas, cbPokerDatas );
        for ( let i = 0; i < threeSet.length; i++ ) {
            utils.Memory.remove( threeSet[ i ], cbResPokerDatas );
            subSet = this._searchSub( cbResPokerDatas, 2, 2 );
            if ( !subSet.length ) break;
            for ( let j = 0; j < subSet.length; j++ ) {
                result.push( [].concat( threeSet[ i ], subSet[ j ] ) );
            }
        }
        return result;
    }
    private _searchCombo( distribution: IDistribution, combo: number, startWeight: number ): number[][] {
        let result: number[][] = [];
        let { cardsMap, cardsSet } = distribution;
        // 出牌组合
        let outs: number[] = [];
        for ( let sameCount = combo - 1; sameCount < cardsSet.length; sameCount++ ) {
            for ( let i = cardsSet[ sameCount ].length - 1; i >= 0; i-- ) {
                if ( poker.getLogicValue( cardsSet[ sameCount ][ i ] ) > startWeight ) {
                    outs = [];
                    // 从映射中拿出目标扑克
                    for ( let j = combo - 1; j >= 0; j-- ) {
                        outs.push( cardsMap[ cardsSet[ sameCount ][ i ] ][ j ] );
                    }
                    result.push( outs );
                }
            }
        }
        return result;
    }
    // 查找满足条件的连续组合
    private _searchSeq( distribution: IDistribution, sameCount: number, startWeight: number, seqLen: number ): number[][] {
        let { cardsSet } = distribution;
        let lineSets: number[][] = [];
        let sameCountSet = [];
        // 找出符合sameCount数量的牌集合
        for ( let count = sameCount - 1; count < cardsSet.length; count++ ) {
            for ( let i = 0; i < cardsSet[ count ].length; i++ ) {
                sameCountSet.push( cardsSet[ count ][ i ] );
            }
        }
        // 排序
        sameCountSet.sort( sortByLogicFirstAsc );
        // 判断combo
        let cardGroup: number[] = [];
        if ( sameCountSet.length < seqLen ) return lineSets;
        for ( let i = 0; i <= sameCountSet.length - seqLen; i++ ) {
            if ( ( poker.getLogicValue( sameCountSet[ i + seqLen - 1 ] ) > startWeight ) ) {
                cardGroup = [];
                for ( let j = 0; j < seqLen; j++ ) {
                    cardGroup.unshift( sameCountSet[ i + j ] );
                }
                if ( PokerTypeAssert.isSeq( cardGroup ) )
                    lineSets.push( cardGroup );
            }
        }
        return lineSets;
    }
    // 查找 附带牌型
    private _searchSub( cbResPokerDatas: number[], subCombo: number, groupNums: number ): number[][] {
        let distribution: IDistribution = {};
        this._analyseDistribution( cbResPokerDatas, distribution );
        let result: number[][] = [];
        let { cardsMap, cardsSet } = distribution;
        // 可出牌集合
        let outsSet: number[][] = [];
        let outs: number[] = [];
        // fixed: 组合策略，拆牌策略，带对牌才会可能拆解炸弹牌，带单不选择拆解炸弹牌
        let maxCombo = subCombo;
        let total = cardsSet[ subCombo - 1 ].length;
        while ( maxCombo < cardsSet.length ) {
            if ( groupNums < total )
                break;
            maxCombo++;
            total += cardsSet[ maxCombo - 1 ].length * Math.floor( maxCombo / subCombo );
        }
        // 拆牌
        for ( let sameCount = subCombo - 1; sameCount < maxCombo; sameCount++ ) {
            for ( let i = cardsSet[ sameCount ].length - 1; i >= 0; i-- ) {
                // 该类牌型能被拆分成几组
                // let gorupCount = Math.floor( cardsMap[ cardsSet[ sameCount ][ i ] ].length / subCombo );
                let gorupCount = Math.min( Math.floor( cardsMap[ cardsSet[ sameCount ][ i ] ].length / subCombo ), groupNums * subCombo );
                // 从映射中拿出目标扑克
                for ( let gi = 0; gi < gorupCount; gi++ ) {
                    outs = [];
                    for ( let j = 0; j < subCombo; j++ ) {
                        outs.push( cardsMap[ cardsSet[ sameCount ][ i ] ][ j + gi * subCombo ] );
                    }
                    outsSet.push( outs );
                }
            }
        }
        // 在集合中取出固定数量的集合
        let combination: number[][] = utils.Memory.combine( outsSet, groupNums );
        for ( let i = 0; i < combination.length; i++ ) {
            outs = [];
            for ( let j = 0; j < combination[ i ].length; j++ ) {
                if ( combination[ i ][ j ] )
                    outs = outs.concat( outsSet[ j ] );
            }
            result.push( outs );
        }
        return result;
    }
    // 卡牌分布分析， 用作提示出牌（类似于卡牌的基础）
    private _analyseDistribution( cbPokerDatas: number[], distribution: IDistribution ): void {
        cbPokerDatas.sort( sortByLogicFirst );
        this._clearDistribution( distribution );
        // 扑克分析
        let i = 0, sameCount = 0, cbPokerCount = cbPokerDatas.length;
        let sameValuePokerDatas: number[] = [];
        while ( i < cbPokerCount ) {
            if ( poker.getValue( cbPokerDatas[ i ] ) == poker.getValue( cbPokerDatas[ sameCount + i ] ) ) {
                sameValuePokerDatas.unshift( cbPokerDatas[ sameCount + i ] );
                sameCount++;
            } else {
                distribution.cardsMap[ poker.getValue( cbPokerDatas[ i ] ) ] = sameValuePokerDatas;
                distribution.cardsSet[ sameCount - 1 ].push( poker.getValue( cbPokerDatas[ i ] ) );
                sameValuePokerDatas = [];
                i += sameCount;
                sameCount = 0;
            }
        }
    }
    private _clearDistribution( distribution: IDistribution ): void {
        distribution.cardsSet = [];
        distribution.cardsMap = {};
        for ( let sameCount = 0; sameCount < 4; sameCount++ ) {
            distribution.cardsSet[ sameCount ] = [];
        }
    }
}
