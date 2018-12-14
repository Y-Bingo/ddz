export enum EMDM {
    // 登录主命令
    GR_LOGON,
    // 房间主命令
    GR_GAME,
    // 玩家主命令
    GR_USER,
    // 游戏住命令
    GF_GAME,
}

export enum SUB_REQ_LOGON {
    // 游客
    VISITOR,
    // 账户
    ACCOUNT,
    // 用户ID
    USERID,
}

export enum SUB_REP_LOGON {
    // 成功
    SUCCESS,
    // 失败
    FAILURE,
    // 登录完成
    FINISH,
}
