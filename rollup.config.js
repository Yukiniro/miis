import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import fileSize from "rollup-plugin-filesize";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import { readFile } from "fs/promises";

function getConfig(libraryName) {
  return {
    input: "src/index.ts",
    output: [
      {
        file: `./dist/${libraryName}.cjs`,
        format: "cjs",
        exports: "auto",
      },
      {
        file: `./dist/${libraryName}.mjs`,
        format: "esm",
        exports: "auto",
      },
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      typescript(),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
      }),
      terser(),
      fileSize(),
    ],
  };
}

export default readFile("./package.json", "utf8")
  .then((json) => {
    const libraryName = JSON.parse(json).name;
    return getConfig(libraryName);
  })
  .catch((e) => {
    console.log(e);
    return getConfig("my-project");
  });
