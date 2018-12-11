import { m_cbPokerData, HAND_COUNT, FULL_COUNT, GAME_PLAYER } from "./ddz/Constant";
import DDZRuleMaster from "./ddz/DDZRule";
import { IRoomConf, EGameStatus } from "../model/RoomModel";
import { RoomMrg } from "./RoomMrg";
import { sortByLogicFirst } from "./Sort";
import { logPokes } from "../utils/Log";

// 游戏流程管理
export class RoundMrg extends RoomMrg {
    // 一副完整的牌
    pokers: number[];
    // 玩家手牌
    hands: number[][];
    // 底牌
    tableCard: number[];
    // 回合数
    roundCount: number;
    // 地主
    lord: number;
    // 当前出牌玩家
    curChairId: number;
    // 当轮出牌最大玩家
    bigestChairId: number;
    // 上次出牌
    lastDidcards: number[];
    // 游戏状态
    gameStatus: EGameStatus;
    // 游戏引擎
    gameEngine: any;
    // 游戏逻辑
    gameLogic: any;

    constructor ( conf: IRoomConf ) {
        super( conf );
        this.gameStatus = EGameStatus.FREE;
    }

    gameStart(): void {
        console.log( `-------------------- 房间【${ this.rid }】游戏开始！--------------------` );
        this.gameStatus = EGameStatus.PLAY;
        this.gameLogic = this.gameEngine.gameLogic;
        this.reset();
        this.dispatch();
        this.setLandLord( Math.floor( Math.random() * GAME_PLAYER ) );
        this.nextTurn();
    }

    // 发牌
    dispatch(): void {
        console.log( `-------------------- 房间【${ this.rid }】开始发牌！--------------------` );
        this.gameLogic.shuffle( this.pokers );
        // let step = GAME_PLAYER;
        let i = 0, startChairId = Math.floor( Math.random() * GAME_PLAYER );
        // 玩家手牌
        for ( ; i < FULL_COUNT - 3; ) {
            for ( let j = 0; j < HAND_COUNT; j++ )
                this.hands[ startChairId ].push( this.pokers[ i + j ] );
            i += HAND_COUNT;
            startChairId = ( startChairId + 1 ) % GAME_PLAYER;
        }
        // 地主牌
        for ( ; i < FULL_COUNT; i++ )
            this.tableCard.push( this.pokers[ i ] );
    }
    // 抢地主
    setLandLord( chairId: number ): void {
        console.log( `地主牌：${ logPokes( this.tableCard ) }` );
        this.lord = chairId;
        this.hands[ chairId ].push.apply( this.hands[ chairId ], this.tableCard );
        for ( let i = 0; i < this.hands.length; i++ ) {
            this.hands[ i ].sort( sortByLogicFirst );
            console.log( `玩家【${ i }】剩余手牌：${ logPokes( this.hands[ i ] ) }` );
        }
        this.curChairId = chairId - 1;
        this.bigestChairId = chairId;
    }
    // 出牌
    discard(): void {
        let outs = [];
        if ( this.curChairId !== this.bigestChairId )
            outs = this.gameLogic.searchFollowOuts( this.hands[ this.curChairId ], this.lastDidcards );
        else
            outs = this.gameLogic.searchFollowOuts( this.hands[ this.curChairId ] );
        // 判断是否能搜索出压牌结果
        if ( outs.length ) {
            this.bigestChairId = this.curChairId;
            this.gameLogic.removePokerDatas( outs[ 0 ], this.hands[ this.curChairId ] );
            this.lastDidcards = outs[ 0 ];
            console.log( `玩家【${ this.curChairId }】出牌：${ logPokes( outs[ 0 ] ) }` );
        } else
            console.log( `玩家【${ this.curChairId }】PASS` );
        // 各位玩家剩余手牌
        for ( let i = 0; i < this.hands.length; i++ ) {
            console.log( `玩家【${ i }】剩余手牌：${ logPokes( this.hands[ i ] ) }` );
        }
        this.nextTurn();
    }
    // 下一个玩家操作
    nextTurn(): void {
        if ( !this._isGameOver() ) {
            this.curChairId = ( this.curChairId + 1 ) % GAME_PLAYER;
            console.log( `-------------------- 轮到玩家【${ this.curChairId }】出牌！--------------------` );
            this.discard();
        }
        else
            this.result();
    }
    // 结算
    result(): void {
        console.log( `-------------------- 房间【${ this.rid }】 游戏结束 玩家【${ this.curChairId }】获胜！--------------------` );
    }
    // 判断是否已经结束游戏（检查当前的出牌忘记是否已经出完牌）
    private _isGameOver(): boolean {
        if ( !this.hands[ this.curChairId ].length )
            return true;
        return false;
    }
    // 下一局
    nextRound(): void {

    }

    reset(): void {
        this.lord = -1;
        this.curChairId = -1;
        this.bigestChairId = -1;
        this.lastDidcards = [];
        this.tableCard = [];
        this.hands = [];
        for ( let i = 0; i < this.userList.length; i++ ) {
            this.hands[ i ] = [];
        }
        this.pokers = m_cbPokerData;
    }
}
