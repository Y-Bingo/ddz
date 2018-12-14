// 包结构
export default class SocketMsg {
    mainCmd: any;
    subCmd: any;
    data: any;
    constructor () {
        this.mainCmd = null;
        this.subCmd = null;
        this.data = null;
    }

    onInit( mainCmd?: any, subCmd?: any, data?: any ) {
        this.mainCmd = mainCmd;
        this.subCmd = subCmd;
        this.data = data;
    }
}


