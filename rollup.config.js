import typescript from "@rollup/plugin-typescript";
import USERSCRIPT_HEADER from "./src/userscript_header.js";

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/userscript.js',
        format: 'iife',
        // changes to this header file aren't watch'd
        banner: USERSCRIPT_HEADER
    },
    plugins: [typescript()]
}