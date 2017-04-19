# tudi
> Javascript Game Engine


### Notes

The build script outputs this project in three different ways:
1. The `tsc` compiled source with `*.d.ts` type declarations and source maps. Uses CommonJS module syntax to support the majority of bundlers/tools.
2. Same as above, but with ES2015 module syntax, to enable tree shaking.
3. A `UMD` bundle, compiled to ES5, for use in browsers.

See [this article][ts-libs] for a more detailed explanation.



[ts-libs]: http://marcobotto.com/compiling-and-bundling-typescript-libraries-with-webpack/
