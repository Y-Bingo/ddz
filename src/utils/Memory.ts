
export class Memory {

    /**
     * 拷贝数据
     * @param dst 待拷贝数据
     * @param src 被拷贝数据
     */
    static copy( dst: number[], src: number[] ): void {
        let i = src.length - 1;
        while ( i >= 0 ) {
            dst[ i ] = src[ i ];
            i--;
        }
    }
    // 交换数组数据的两个位置的数据
    static swap( src: number[], i: number, j: number ): void {
        if ( i == j ) return;
        let temp = src[ i ];
        src[ i ] = src[ j ];
        src[ j ] = temp
    }

    static zero(): void {

    }

    static fill( src: number[], count: number ): void {

    }

    static combine( arr: any, selecCount: number ): number[][] {
        // 输出结果
        let combination: number[][] = [];
        // 作为对应数组下标被选择的记录
        let vecNum: number[] = [];
        let len = arr.length;
        for ( let i = 0; i < len; i++ ) {
            if ( i < selecCount )
                vecNum[ i ] = 1;
            else vecNum[ i ] = 0;
        }
        combination.push( [].concat( vecNum ) );
        for ( let i = 0; i < len - 1; i++ ) {
            if ( vecNum[ i ] === 1 && vecNum[ i + 1 ] === 0 ) {
                // 交换位置
                [ vecNum[ i ], vecNum[ i + 1 ] ] = [ vecNum[ i + 1 ], vecNum[ i ] ];
                // 把该位置前的所有1移到最前面
                for ( let ft = 0, st = 0; ft < i; ft++ ) {
                    if ( vecNum[ ft ] === 1 ) {
                        [ vecNum[ ft ], vecNum[ st ] ] = [ vecNum[ st ], vecNum[ ft ] ]
                        st++;
                    }
                }
                // 把该组合保存到输出中
                combination.push( [].concat( vecNum ) );
                // 重置开始位置
                i = -1;
            }
        }
        return combination;
    }

    static remove( removeData: number[], srcData: number[] ): void {
        let removeLen = removeData.length;
        let srcLen = srcData.length;
        if ( removeLen > srcLen )
            console.error( "remove Error. removeLen is larger than srcLen" );
        let tempData: number[] = [];
        for ( let i = 0, j = 0; i < srcLen; i++ ) {
            for ( j = 0; j < removeLen; j++ ) {
                if ( removeData[ j ] === srcData[ i ] )
                    break;
            }
            if ( j >= removeLen )
                tempData.push( srcData[ i ] );
        }
        let tempLen = tempData.length;
        for ( let i = 0; i < srcLen; i++ ) {
            if ( i < tempLen )
                srcData[ i ] = tempData[ i ]
            else
                srcData.pop();
        }
    }
}

