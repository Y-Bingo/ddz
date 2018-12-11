export const MDM_GF_GAME = 4;

// 游戏命令定义
export enum SUB_S {
    // 游戏开始
    GAME_START = 100,
    // 抢地主
    ROB_LORD = 101,
    // 定位身份
    SET_LORD = 102,
    // 用户出牌
    OUT_CARD = 103,
    // 用户过牌
    PASS_CARD = 104,
    // 开始出牌
    START_CARD = 105,
    // 游戏结束
    GAEM_END = 105,
    // 结算
    RESULT = 106,
    // 托管
    TRUSTEE = 107,
    // 发言
    PHRASE = 108
}

export enum SUB_C {
    // 抢地主
    ROB_LORD = 1,
    // 出牌
    OUT_CARD = 2,
    // 过牌
    PASS_CARD = 3,
    // 托管
    TRUSTEE = 4,
    // 发言
    PHRASE = 5,
    // 配牌
    ALLOT_CARD_DATA = 6
}
