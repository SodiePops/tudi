# tudi
> Javascript Game Engine


### Notes

The build script outputs this project in three different ways:
1. The `tsc` compiled source with `*.d.ts` type declarations and source maps. Uses CommonJS module syntax to support the majority of bundlers/tools.
2. Same as above, but with ES2015 module syntax, to enable tree shaking.
3. A `UMD` bundle, compiled to ES5, for use in browsers.

See [this article][ts-libs] for a more detailed explanation.

---

## Examples
[Asteroids][asteroids] - [repo][asteroids-repo]

## Making a Game with tudi

### Project Structure
```
src/
├── Components/
│   ├── Health.ts
│   ├── Weapon.ts
│   ├── PlayerController.ts
│   └── EnemyController.ts
├── Prefabs/
│   ├── Player.ts
│   └── Enemy.ts
├── Scenes/
│   ├── LevelOne.ts
│   └── LevelTwo.ts
└── index.ts
```

If a component is only used in a single entity, it is ok to put it inside the same file as the prefab.



[ts-libs]: http://marcobotto.com/compiling-and-bundling-typescript-libraries-with-webpack/
[asteroids]: https://github.com/SodiePops/asteroids-example/
[asteroids-repo]: https://sodiepops.github.io/asteroids-example/
