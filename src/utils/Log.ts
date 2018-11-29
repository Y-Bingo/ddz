import * as DDZ from "../logic/ddz/DDZPokerType";

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
