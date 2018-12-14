export interface IUserDto {
    uid: number;
    // 用户名
    nickName: string;
    // 用户头像
    face: string;
    // 用户积分
    score: number;
    // 胜场
    winCount: number;
    // 败场
    loseCount: number;
}
// 这个是数据库读取数据的数据结构够定义
export class UserDto {
    // 用户ID
    uid: number;
    // 用户名
    nickName: string;
    // 用户头像
    face: string;
    // 用户积分
    score: number;
    // 胜场
    winCount: number;
    // 败场
    loseCount: number;

    constructor ( data: IUserDto ) {
        this.uid = data.uid;
        this.nickName = data.nickName;
        this.face = data.face;
        this.score = data.score;
        this.winCount = data.winCount;
        this.loseCount = data.loseCount;
    }
}

