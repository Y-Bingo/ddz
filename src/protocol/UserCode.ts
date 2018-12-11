export const MDM_GR_USER = 3;

// 请求命令
export enum SUB_REQ_USER {
    // 用户规则
    RULE = 1,
    // 旁观请求
    LOOKON = 2,
    // 坐下请求 （加入桌子）
    SITDOWN = 3,
    // 站立请求（离开该桌子）
    STANDUP = 4,
    // 准备请求 (游戏准备)
    READY = 5,
    // 换桌请求
    CHAIR = 6,
    // 解散桌子请求
    DISMISS_TABLE = 7
}
// 响应命令
export enum SUB_REP_USER {
    // 玩家进入
    ENTER = 100,
    // 玩家状态
    STATUS = 101,
    // 请求失败
    REQ_FAILURE = 102,
    // 解散结果
    DISMISS_TABLE = 107
}
