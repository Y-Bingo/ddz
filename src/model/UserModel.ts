export enum EUserStatus {
    NULL = 0x00,
    FREE = 0x01,
    SIT = 0x02,
    READY = 0x03,
    LOOKON = 0x04,
    PLAYING = 0x05,
    OFFLINE = 0x06
}
export interface UserModel {
    // 用户ID
    uid: number;
    // 用户名
    nickName: string;
    // 用户头像
    face: string;
    // 用户积分
    score: number;
    // 用户椅子
    chairID: number;
    // 用户状态
    userStatus: EUserStatus;
}
