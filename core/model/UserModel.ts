const randomName = require( "chinese-random-name" );
import { UserDto, IUserDto } from "../db/UserDto";

// 用户状态
export enum EUserStatus {
    NULL = 0x00,
    FREE = 0x01,
    SIT = 0x02,
    READY = 0x03,
    LOOKON = 0x04,
    PLAYING = 0x05,
    OFFLINE = 0x06
}

interface IUserModel extends IUserDto {
    userStatus: EUserStatus;
}
/**
 * 该类是与数据库交互的model类
 */
export class UserModel extends UserDto implements IUserModel {
    userStatus: EUserStatus;
    constructor ( data: IUserModel ) {
        super( data );
        this.userStatus = data.userStatus;
    }
}

// 以下操作相当于从数据库中读取数据

/**
 * 创建用户，如果是通过客户端传入的，则用客户端传入的数据来穿创建用户模型，
 * 如果不是
 * 则判断是否为机器人
 * 是机器人则用机器人默认的创建方式
 * 不是机器人则随机属性
 * @param data
 */
export default function createUser( data: any = {} ): UserModel {
    let uid = data.uid || genUserId();
    let nickName = data.nickName || genNickName();
    let face = data.face || genFace();
    let score = data.score || genScore();
    let winCount = data.winCount || genWinCount();
    let loseCount = data.loseCount || genLoseCount();
    let userStatus = EUserStatus.FREE;
    return new UserModel( { uid, nickName, face, score, winCount, loseCount, userStatus } );
}

// 随机用户ID
let userCount = 0;
function genUserId(): number {
    let MAX_ID = 1000;
    userCount++;
    return MAX_ID + Math.floor( Math.random() * ( MAX_ID - userCount ) ) + userCount;
}
// 随机用户名
function genNickName(): string {
    return randomName.generate();
}
// 随机头像ID
function genFace(): string {
    let MAX_FACE_ID = 10;
    let faceId = Math.floor( Math.random() * MAX_FACE_ID );
    let face = faceId < 10 ? "0" + faceId : "" + faceId;
    return `face_${ face }`;
}
// 用户积分
function genScore(): number {
    return 3000;
}
// 用户胜场
function genWinCount(): number {
    return 0;
}
// 用户败场
function genLoseCount(): number {
    return 0;
}



