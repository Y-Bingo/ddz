
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
}

