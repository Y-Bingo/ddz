import Dictionary from "../../lib/Dictionary";
import { UserModel } from "../../core/model/UserModel";
import ClientPeer from "../../core/tcp/ClientPeer";

class UserCache {

    private _userClientDict: Dictionary<UserModel, ClientPeer> = new Dictionary<UserModel, ClientPeer>();

    get size() {
        return this._userClientDict.size;
    }
    // 上线
    onLine( userModel: UserModel, clientPeer: ClientPeer ): void {
        this._userClientDict.set( userModel, clientPeer );
    }
    // 下线
    offLine( clientPeer: ClientPeer ): void {
        let userModel = this.getUserModel( clientPeer );
        this._userClientDict.delete( userModel );
    }
    // 根据连接对象获取用户信息
    getClientPeer( userModel: UserModel ): ClientPeer {
        return this._userClientDict.get( userModel );
    }
    // 根据用户信息获取连接对象
    getUserModel( clientPeer: ClientPeer ): UserModel {
        return this._userClientDict.getByVal( clientPeer );
    }
    // 根据用户id获取连接对象
    getClientPeerByUid( uid: number ): ClientPeer {
        let clientPeer = null;
        for ( let [ userModel ] of this._userClientDict ) {
            if ( userModel.uid === uid ) {
                clientPeer = this._userClientDict.get( userModel );
                break;
            }
        }
        return clientPeer;
    }
    // 更新： 由于用的是对象字典，对象的属性的改变会直接更新到字典里面的
    // update(){}
}

export default UserCache;
