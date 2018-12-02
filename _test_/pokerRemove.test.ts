// 导入测试库
import "mocha";
import { expect } from 'chai';
// 导入待测试单元
import DDZRuleMaster from "../src/logic/ddz/DDZRule";
import { m_cbCardData } from "../src/logic/ddz/Constant";
import { EPokerType } from "../src/logic/ddz/DDZPokerType";
import { logPokerType } from "../src/utils/Log";
import { Func } from "mocha";

let rule: DDZRuleMaster;
let removePokerDatas: Function;

describe( "数组删除", function () {
    // 钩子 测试前
    before( function () {
        rule = new DDZRuleMaster();
        removePokerDatas = rule.getPokerType.bind( rule );
    } );

    checkRemove( [ 0x11, 0x12, 0x32 ], [ 0x10, 0x11, 0x12, 0x32, 0x33 ], [ 0x10, 0x33 ] );

    after( function () {
        console.log( "---------------- 数组删除检测完毕 -----------------------" );
    } )
} );

function checkRemove ( cbRemovePoker: number[], cbPokerDatas: number[], sucExpect: number[] ): void {
    let log = `原数组【${cbPokerDatas.join( "," )}】, 待删除【 ${cbRemovePoker}】`;
    it( log, function () {
        removePokerDatas( cbRemovePoker, cbPokerDatas );
        expect( cbPokerDatas ).to.deep.equal( sucExpect );
    } );
}