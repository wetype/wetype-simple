import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel';
// import commonjs from 'rollup-plugin-commonjs'


export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/wetype.js',
        format: 'cjs'
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.rollup.json',
        }),
        resolve(),
        babel()
    ]
}