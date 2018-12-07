import { createSecureServer } from "http2";
import * as randomName from "chinese-random-name";

class User {
    // 用户ID
    id: number;
    // 用户名
    nickName: string;
    // 用户头像
    face: string;
    // 用户积分
    score: number;

    constructor ( data: any ) {
        this.id = data.id;
        this.nickName = data.nickName;
        this.face = data.face;
        this.score = data.score;
    }
}

export default function createUser( data: any = {} ): User {
    let id = data.id || genUserId();
    let nickName = data.nickName || genNickName();
    let face = data.face || genFace();
    let score = data.score || 1888;
    return new User( { id, nickName, face, score } );
}

function genUserId(): number {
    let MAX_ID = 1000;
    return MAX_ID + Math.floor( Math.random() * MAX_ID );
}

function genNickName(): string {
    return randomName.generate();
}

function genFace(): string {
    let MAX_FACE_ID = 10;
    let faceId = Math.floor( Math.random() * MAX_FACE_ID );
    let face = faceId < 10 ? "0" + faceId : "" + faceId;
    return `face_${ face }`;
}
