import { defineConfig } from '@rslib/core';

export default defineConfig({
    lib: [
        {
            format: 'esm',
            syntax: 'es2021',
            dts: true,
        },
        {
            format: 'cjs',
            syntax: 'es2021',
        },
    ],
    output: {
        minify: {
            js: true,
            css: false,
            jsOptions: {
                minimizerOptions: {
                    mangle: true,
                    minify: true,
                    compress: {
                        defaults: false,
                        unused: true,
                        dead_code: true,
                        toplevel: true,
                    },
                    format: {
                        comments: 'some',
                        preserve_annotations: true,
                    },
                },
            },
        },
    },
});
