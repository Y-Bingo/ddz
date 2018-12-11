export const MDM_GR_LOGON = 1;

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
