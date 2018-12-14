/**
 * 字典数据结构
 */
interface IDictionary<K, V> {
    // // 向字典中添加新元素
    // set( key: K, value: V ): void;
    // // 通过使用键值来从字典中移除键值对应的数据值
    // remove( key: K ): boolean;
    // // 如果某个键值存在于这个字典中，则返回true，反之则返回false
    // has( key: K ): boolean;
    // // 通过键值查找特定的数值并返回
    // get( key: K ): V;
    // // 将这个字典中的所有元素全部删除
    // clear(): void;
    // // 返回字典所包含元素的数量。与数组的length属性类似
    // size(): number;
    // 将字典所包含的所有键名以数组形式返回
    // keys(): K[];
    // 将字典所包含的所有数值以数组形式返回
    // values(): V[];
}
/**
 * 由于能使用map结构，所以直接继承map结构了
 */
class Dictionary<K, V> extends Map<K, V> implements IDictionary<K, V> {

    // private _items = {};

    // // 向字典中添加新元素
    // set( key: K, value: V ): void {

    // }
    // // 通过使用键值来从字典中移除键值对应的数据值
    // remove( key: K ): boolean {

    // }
    // // 如果某个键值存在于这个字典中，则返回true，反之则返回false
    // has( key: K ): boolean {
    //     return key in this._items;
    // }
    hasVal( val: V ): boolean {
        for ( let [ , v ] of this ) {
            if ( val === v )
                return true;
        }
        return false;
    }
    // // 通过键值查找特定的数值并返回
    // get( key: K ): V {

    // }
    getByVal( val: V ): K {
        for ( let [ k, v ] of this ) {
            if ( val === v )
                return k;
        }
        return null;
    }
    // // 将这个字典中的所有元素全部删除
    // clear(): void {

    // }
    // // 返回字典所包含元素的数量。与数组的length属性类似
    // size(): number {

    // }
    // 将字典所包含的所有键名以数组形式返回
    // keys(): K[] {

    // }
    // 将字典所包含的所有数值以数组形式返回
    // values(): V[] {
    //     return [];
    // }
}

export default Dictionary;
