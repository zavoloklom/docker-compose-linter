# Changelog

> This file was generated automatically using [@semantic-release](https://github.com/semantic-release/semantic-release).

## [2.2.2](https://github.com/zavoloklom/docker-compose-linter/compare/v2.2.1...v2.2.2) (2025-01-01)

### Bug Fixes

- **no-duplicate-exported-ports:** add protocol handling in port parsing
  ([b4c7616](https://github.com/zavoloklom/docker-compose-linter/commit/b4c7616774d69163496dbe924d3ee267febfa553)),
  closes [#91](https://github.com/zavoloklom/docker-compose-linter/issues/91)

### Dependencies

- **dev:** bump @rollup/plugin-replace from 6.0.1 to 6.0.2
  ([d89c2b8](https://github.com/zavoloklom/docker-compose-linter/commit/d89c2b87404e55b251362df0440ec46f145543bd))
- **dev:** bump @semantic-release/release-notes-generator
  ([80fafe5](https://github.com/zavoloklom/docker-compose-linter/commit/80fafe5cc76aa66a6c1c47183e0319b9ed4a43d3))
- **dev:** bump markdownlint-cli2 from 0.16.0 to 0.17.0
  ([5a4efb3](https://github.com/zavoloklom/docker-compose-linter/commit/5a4efb3c3c1326a0be6f2dc1b1b25f0f51278ae4))

### Documentation

- update `changelog:fix` script
  ([e22c38d](https://github.com/zavoloklom/docker-compose-linter/commit/e22c38db372bf334c2e4b5d142253bb81198b877))

### CI/CD

- **deps:** bump actions/checkout from 4.1.1 to 4.2.2
  ([42f0da7](https://github.com/zavoloklom/docker-compose-linter/commit/42f0da79f1edf289be591e59078d86f3487f53b3))
- **deps:** bump actions/upload-artifact from 4.4.3 to 4.5.0
  ([4628a66](https://github.com/zavoloklom/docker-compose-linter/commit/4628a66f27ddf0d69facb5afe030773915da7f94))
- **deps:** bump github/codeql-action from 3.27.9 to 3.28.0
  ([ad72e8f](https://github.com/zavoloklom/docker-compose-linter/commit/ad72e8f4be48277ca2fbdca46139f080ea5e77c1))
- **deps:** bump ossf/scorecard-action from 2.3.1 to 2.4.0
  ([25b17f8](https://github.com/zavoloklom/docker-compose-linter/commit/25b17f8feaa2193f12e069b4b0e9f06cb877d44a))

### Others

- change commit message prefix for dependabot
  ([fc12c00](https://github.com/zavoloklom/docker-compose-linter/commit/fc12c0092ebeb640acf9d1c0ec62ee257c5fb86c))

## [2.2.1](https://github.com/zavoloklom/docker-compose-linter/compare/v2.2.0...v2.2.1) (2024-12-18)

### Bug Fixes

- skip YAML separators when searching for `dclint` comments and process the first non-empty line
  ([a8de08e](https://github.com/zavoloklom/docker-compose-linter/commit/a8de08ed125907dc98dced3f2a013bc405652fb2)),
  closes [#69](https://github.com/zavoloklom/docker-compose-linter/issues/69)

### Dependencies

- **dev:** bump @commitlint/cli from 19.6.0 to 19.6.1
  ([b769851](https://github.com/zavoloklom/docker-compose-linter/commit/b769851ebeaf087ffb4e0d8542f6bc6712a543ef))
- **dev:** bump @rollup/plugin-commonjs from 28.0.1 to 28.0.2
  ([f70e576](https://github.com/zavoloklom/docker-compose-linter/commit/f70e576bce297639038afe9c93be19e11ff058e5))
- **dev:** bump @rollup/plugin-node-resolve from 15.3.0 to 16.0.0
  ([6bd0206](https://github.com/zavoloklom/docker-compose-linter/commit/6bd0206800d4844886768aa3cae3d97e19695250))
- **dev:** bump @rollup/plugin-typescript from 12.1.1 to 12.1.2
  ([5bb8940](https://github.com/zavoloklom/docker-compose-linter/commit/5bb8940917b5a83bcbedb6574b011112db8973c9))
- **dev:** bump @stylistic/eslint-plugin from 2.11.0 to 2.12.1
  ([30cd5f2](https://github.com/zavoloklom/docker-compose-linter/commit/30cd5f25cde727eb94289b10be2577282661a02a))
- **dev:** bump @types/node from 20.17.9 to 20.17.10
  ([8f20d9a](https://github.com/zavoloklom/docker-compose-linter/commit/8f20d9a9fad5cb170c14164510f55b056c2ad2dd))
- **dev:** bump c8 from 10.1.2 to 10.1.3
  ([91c027c](https://github.com/zavoloklom/docker-compose-linter/commit/91c027cf72df43ce64722fa843e27225ca3e8b1f))
- **dev:** bump eslint-import-resolver-typescript from 3.6.3 to 3.7.0
  ([7f91608](https://github.com/zavoloklom/docker-compose-linter/commit/7f916083ee9a91c6efd4a3fc4e910c08a8db1434))

### CI/CD

- add OSSF Scorecards supply-chain security analysis
  ([6a9fe76](https://github.com/zavoloklom/docker-compose-linter/commit/6a9fe767c4220f481a9e3ce55e034845dccba2a2))
- apply security best practices
  ([1007255](https://github.com/zavoloklom/docker-compose-linter/commit/1007255b67efa357e0c7f69ae33cd612b711d959))
- skip commitlint for dependabot
  ([145ff6f](https://github.com/zavoloklom/docker-compose-linter/commit/145ff6ff7bdf07befc33a4296f51c00450889f8f))

## [2.2.0](https://github.com/zavoloklom/docker-compose-linter/compare/v2.1.0...v2.2.0) (2024-12-15)

### Features

- move rules options to a separate property for better extensibility
  ([929123a](https://github.com/zavoloklom/docker-compose-linter/commit/929123a942481b7b8d39dba8b355098d12776ea3))
- rename rules-loader, add getRuleDefinition helper
  ([292c6f9](https://github.com/zavoloklom/docker-compose-linter/commit/292c6f9f0c827dc1f95071aad80e90d08f7d4cd8))

### Code Refactoring

- change `Logger.init` to return the initialized `Logger` instance
  ([b80549d](https://github.com/zavoloklom/docker-compose-linter/commit/b80549d8c088ffaedc5227af825c96b4a498c27f))

### Tests

- move helper function to normalize strings to separate file
  ([2c70a44](https://github.com/zavoloklom/docker-compose-linter/commit/2c70a44ab3290d03f3d57f5ee0e386b62f2d6b56))

### Dependencies

- **dev:** bump markdownlint-cli2 from 0.15.0 to 0.16.0
  ([5f750ae](https://github.com/zavoloklom/docker-compose-linter/commit/5f750ae53cc77ecdfccff9229d14f61a495e4463))
- **dev:** fix npm audit warning
  ([590b488](https://github.com/zavoloklom/docker-compose-linter/commit/590b488d0b85e8b3270cb7278a442eb1f2250853))

### Documentation

- add logo to README header
  ([288246b](https://github.com/zavoloklom/docker-compose-linter/commit/288246bd6037bf3c0c788d7b1ba5e1f326bb3570))
- add TOC in README and rename sections
  ([96f8711](https://github.com/zavoloklom/docker-compose-linter/commit/96f8711c272dc921a02c7f396a8b4444dccda066))
- change release reference in rules documentation
  ([39f6745](https://github.com/zavoloklom/docker-compose-linter/commit/39f6745dd0294e5f061bfc8f05097fb6f13d0f7d))
- fix all-contributors badge
  ([cd3186b](https://github.com/zavoloklom/docker-compose-linter/commit/cd3186b008024a897985470e0b4d9b4b9cf58991))
- fix json example for editor autocompletion with schema
  ([64a04a6](https://github.com/zavoloklom/docker-compose-linter/commit/64a04a6cb4ffd538b36fa858dde94f7979973d38))
- make rules documentation more consistent
  ([095133e](https://github.com/zavoloklom/docker-compose-linter/commit/095133e8b3691e887ee1790ad8ec07bba6afdbe3))
- update Contacts section in README
  ([9f963de](https://github.com/zavoloklom/docker-compose-linter/commit/9f963dee5809b1229aa85784f76bd1da13840ce5))
- update rules descriptions
  ([1fdbd1f](https://github.com/zavoloklom/docker-compose-linter/commit/1fdbd1f974f05f77c65b254e048e33901baf6879))

### Others

- add documentation scripts and update contribution guidelines
  ([9931320](https://github.com/zavoloklom/docker-compose-linter/commit/9931320597e6c32fa09d40ee8c39a4a9baec30e7))
- fix .PHONY option in Makefile
  ([d93a930](https://github.com/zavoloklom/docker-compose-linter/commit/d93a930711fa7d14e25d16a9e185d41e6c5bf9cf))
- rewrite download-compose-schema script to TS
  ([e89549c](https://github.com/zavoloklom/docker-compose-linter/commit/e89549c5725bb3e3db9aaf199faa9f6640e8578a))
- setup all-contributors specification, add contributors to README
  ([fe4f67f](https://github.com/zavoloklom/docker-compose-linter/commit/fe4f67fd5377f330cd38861102074bdc306bf25c))
- update Commit Message Conventions for new rules
  ([d260a84](https://github.com/zavoloklom/docker-compose-linter/commit/d260a8401d34f7701f03c34e05dbf2b66058bdc4))

## [2.1.0](https://github.com/zavoloklom/docker-compose-linter/compare/v2.0.2...v2.1.0) (2024-12-07)

### Features

- allow `$schema` in JSON configuration file
  ([32aa0a4](https://github.com/zavoloklom/docker-compose-linter/commit/32aa0a4303653b5e23144f73a06b1b0dc1355eb5))

## [2.0.2](https://github.com/zavoloklom/docker-compose-linter/compare/v2.0.1...v2.0.2) (2024-12-06)

### Bug Fixes

- observe `quiet` field in configuration file
  ([15613d1](https://github.com/zavoloklom/docker-compose-linter/commit/15613d174b1f4143af1a06f38eff2e4879276e43))

### Dependencies

- **dev:** bump husky from 8.0.3 to 9.1.7
  ([cce0884](https://github.com/zavoloklom/docker-compose-linter/commit/cce088486c3ffb6d41663fc74c249437bcb793b3))

### Others

- update husky script to v9
  ([e530cf5](https://github.com/zavoloklom/docker-compose-linter/commit/e530cf5ed7a8ce54c2f1a36d04ae8c5875c83eb1))

## [2.0.1](https://github.com/zavoloklom/docker-compose-linter/compare/v2.0.0...v2.0.1) (2024-12-06)

### Bug Fixes

- npm package should not minify code
  ([5de14dd](https://github.com/zavoloklom/docker-compose-linter/commit/5de14dd26dd827376b07a9cc3103f075ac872ef0))

### Dependencies

- bump yaml from 2.6.0 to 2.6.1
  ([705da6c](https://github.com/zavoloklom/docker-compose-linter/commit/705da6c55aeb5c61e9d91f32532ef1cd5126dc47))
- **dev:** bump @stylistic/eslint-plugin from 2.10.1 to 2.11.0
  ([5954f00](https://github.com/zavoloklom/docker-compose-linter/commit/5954f00bd4c165b98e637d9acb4f03fcc5d225ed))
- **dev:** bump @types/node from 20.17.6 to 20.17.7
  ([8943ce9](https://github.com/zavoloklom/docker-compose-linter/commit/8943ce974af566934d64dba598367abc7a3098f6))
- **dev:** bump @types/node from 20.17.7 to 20.17.9
  ([b49decb](https://github.com/zavoloklom/docker-compose-linter/commit/b49decb9dbd9062e9f61f2acebe20228ca3af27d))
- **dev:** bump eslint-plugin-unicorn from 56.0.0 to 56.0.1
  ([42dc1dd](https://github.com/zavoloklom/docker-compose-linter/commit/42dc1dd66891ce721fc6c4154c3c51b0c04b4739))
- **dev:** bump typescript from 5.6.3 to 5.7.2
  ([5c68de5](https://github.com/zavoloklom/docker-compose-linter/commit/5c68de50fd6ab46edbd620f62dab9936ae615f1a))

### Documentation

- fix GitLab CI example
  ([5d8dba6](https://github.com/zavoloklom/docker-compose-linter/commit/5d8dba673e7bf6fb9bdfa4eee730d925075e5d24))
- translate comments in generate-sea script
  ([feccdec](https://github.com/zavoloklom/docker-compose-linter/commit/feccdec7b8948980111dcb3c5fd9e3a6ddc9ec5e))

### CI/CD

- change dockerfile for multi-platform build on CI
  ([3d05b2e](https://github.com/zavoloklom/docker-compose-linter/commit/3d05b2ec4431dba0ce92722dadc68aff9cb9ecfa))

### Others

- change markdownlint config file extension for codacy
  ([f0eb0ed](https://github.com/zavoloklom/docker-compose-linter/commit/f0eb0ed4399e196476a27b7d5cbb5e22bddcbd38))
- ignore warning in tests
  ([95a427c](https://github.com/zavoloklom/docker-compose-linter/commit/95a427c0d537e3de1436c534563a408b635417ee))
- setup commitlint and husky git hooks
  ([067bb49](https://github.com/zavoloklom/docker-compose-linter/commit/067bb49bedcb04c671f51c942068be55dacb7342))

## [2.0.0](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.7...v2.0.0) (2024-11-22)

### ⚠ BREAKING CHANGES

- Renamed `bin/dclint.js` to `bin/dclint.cjs`.
- Docker entrypoint changed to use the compiled binary over the Node.js implementation.

### New Rules

- **no-unbound-port-interfaces-rule**: require port bindings to include interface ip
  ([cbf7739](https://github.com/zavoloklom/docker-compose-linter/commit/cbf7739f5f12737df860d9fb8b51d9ee17b4c9b8))

### Features

- add Disabling Rules via Comments feature
  ([9f2768a](https://github.com/zavoloklom/docker-compose-linter/commit/9f2768a319bc40163b251c0589b507391928c617))
- change building system to rollup, compiling linter into a binary
  ([dc0ebcf](https://github.com/zavoloklom/docker-compose-linter/commit/dc0ebcf1ae628807901df38acd57d20d3a22f48c))
- **cli:** add `--max-warnings` option to enforce warning threshold
  ([712a8df](https://github.com/zavoloklom/docker-compose-linter/commit/712a8df25597dca610eeca8ecf87ca18f9578e7b))
- **no-build-and-image-rule:** add `checkPullPolicy` option to allow simultaneous usage of `build` and `image`
  ([7a01d07](https://github.com/zavoloklom/docker-compose-linter/commit/7a01d072c1d10fcbfbea98e64f6d17fb7bfd801a))
- **require-quotes-in-ports-rule:** handle "expose" section similar to "ports"
  ([601a50f](https://github.com/zavoloklom/docker-compose-linter/commit/601a50f7ace0a2c939d9d588ef22d389efb67290))
- **schema:** update docker compose schema from source
  ([f4e0a36](https://github.com/zavoloklom/docker-compose-linter/commit/f4e0a36fef115996661509bcfa2f998ee496e514))

### Bug Fixes

- change handling ports when it is a yamlMap
  ([2e1a97d](https://github.com/zavoloklom/docker-compose-linter/commit/2e1a97d6c7fd74956ec40d96464142334a4d74e0))
- **require-quotes-in-ports-rule:** ensure single port values are wrapped in quotes
  ([a7316a9](https://github.com/zavoloklom/docker-compose-linter/commit/a7316a9b068f3e931709643f41dae9a9964d1812))

### Dependencies

- bump yaml from 2.5.1 to 2.6.0
  ([2924e3e](https://github.com/zavoloklom/docker-compose-linter/commit/2924e3e1d879c0417b54086aa8ae2a7e80824676))
- **dev:** bump @semantic-release/github from 11.0.0 to 11.0.1
  ([3cfe923](https://github.com/zavoloklom/docker-compose-linter/commit/3cfe923aa99d90ef6c76e49eba81513ac3044a58))
- **dev:** bump @stylistic/eslint-plugin from 2.9.0 to 2.10.1
  ([5f8ccfe](https://github.com/zavoloklom/docker-compose-linter/commit/5f8ccfeb940010cf9d1b9f7374017486cac7ba3f))
- **dev:** bump @types/node from 20.16.10 to 20.16.13
  ([39be7f5](https://github.com/zavoloklom/docker-compose-linter/commit/39be7f5498988bd9e215ae6b98830e57138b08df))
- **dev:** bump @types/node from 20.16.13 to 20.17.1
  ([44e2c80](https://github.com/zavoloklom/docker-compose-linter/commit/44e2c8064d40176e3ff21c69575f3dddcf711090))
- **dev:** bump @types/node from 20.17.1 to 20.17.6
  ([7d3e5aa](https://github.com/zavoloklom/docker-compose-linter/commit/7d3e5aa85b59790fe7a262b013668a1427a7b7f9))
- **dev:** bump ava from 6.1.3 to 6.2.0
  ([e726cac](https://github.com/zavoloklom/docker-compose-linter/commit/e726cac6c8c7d1586a023c7a495b9d8e74531720))
- **dev:** bump markdownlint-cli2 from 0.14.0 to 0.15.0
  ([a6e10ae](https://github.com/zavoloklom/docker-compose-linter/commit/a6e10aef1a24258256fe0e6eadc20bf181bb9084))
- **dev:** bump semantic-release from 24.1.2 to 24.2.0
  ([844a516](https://github.com/zavoloklom/docker-compose-linter/commit/844a516112d4c7b640cc11920de521e4589fa3e7))
- **dev:** bump tsimp from 2.0.11 to 2.0.12
  ([7ae8289](https://github.com/zavoloklom/docker-compose-linter/commit/7ae8289332434fb592417f904bf06c07c37c259f))
- **dev:** bump tslib from 2.7.0 to 2.8.0
  ([3ce911b](https://github.com/zavoloklom/docker-compose-linter/commit/3ce911b8b2d9594bff68429db64891fd22614f5d))
- **dev:** bump tslib from 2.8.0 to 2.8.1
  ([870a37a](https://github.com/zavoloklom/docker-compose-linter/commit/870a37a3cc14ce4d90d42b9bdfbb3192d116c1b5))
- **dev:** bump typescript from 5.5.4 to 5.6.3
  ([37033c5](https://github.com/zavoloklom/docker-compose-linter/commit/37033c5ef49cc0c6f18221f0400b5b8c0e6040ac))

### Documentation

- **no-unbound-port-interfaces-rule:** rename rule and add documentation
  ([6649594](https://github.com/zavoloklom/docker-compose-linter/commit/6649594374018e08fe5a71263abb14920ad9f9b8))

### CI/CD

- add Hadolint check
  ([5918926](https://github.com/zavoloklom/docker-compose-linter/commit/59189260c7d613b5c586328112d23e47243bd127))

### Others

- add new linters and fix eslint warnings
  ([69d77d6](https://github.com/zavoloklom/docker-compose-linter/commit/69d77d699ec53c5ced609a47cf98031d5dbe84da))
- change indentation and fix linter warnings
  ([c612468](https://github.com/zavoloklom/docker-compose-linter/commit/c61246825a39f0e366e7d162dba87850952879b0))
- change markdownlint scripts
  ([52cb677](https://github.com/zavoloklom/docker-compose-linter/commit/52cb677562ca225c8d376cf8f5d187122e8f21cf))
- move pull_request_template
  ([faf1e72](https://github.com/zavoloklom/docker-compose-linter/commit/faf1e720fa1088a8bbf5f9cc6930442c48da18fc))
- rename linter config schema
  ([a6e9e2e](https://github.com/zavoloklom/docker-compose-linter/commit/a6e9e2e40691651c46070733286e5652a6614da5))

## [1.0.7](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.6...v1.0.7) (2024-10-26)

### Bug Fixes

- add yaml anchor/fragments support
  ([4d9826f](https://github.com/zavoloklom/docker-compose-linter/commit/4d9826f59831a583080d13fed2dbad6d3fab5f61)),
  closes [#39](https://github.com/zavoloklom/docker-compose-linter/issues/39)

### Dependencies

- **dev:** bump @semantic-release/github from 10.3.5 to 11.0.0
  ([fcf7151](https://github.com/zavoloklom/docker-compose-linter/commit/fcf715159bdfcf7075a0c5efdbed0f8a9b518d5c))
- **dev:** bump @stylistic/eslint-plugin from 2.8.0 to 2.9.0
  ([73e3f13](https://github.com/zavoloklom/docker-compose-linter/commit/73e3f13b8c4f655521c979bd3df76d51f075b16b))
- **dev:** bump @types/node from 20.16.5 to 20.16.10
  ([2599b91](https://github.com/zavoloklom/docker-compose-linter/commit/2599b917c4c118d47ae0a79743e5717102a43316))
- **dev:** bump eslint-plugin-import from 2.30.0 to 2.31.0
  ([dbcd009](https://github.com/zavoloklom/docker-compose-linter/commit/dbcd0092468e8e1c7857b36feedcbab53ebc64d1))
- **dev:** bump eslint-plugin-unicorn from 55.0.0 to 56.0.0
  ([2a92689](https://github.com/zavoloklom/docker-compose-linter/commit/2a9268923c58dc8c65e2f852f6b18e241af417f2))
- **dev:** bump esmock from 2.6.7 to 2.6.9
  ([98d2f92](https://github.com/zavoloklom/docker-compose-linter/commit/98d2f920caa086145c6493676fd3efff414c6d58))
- **dev:** bump semantic-release from 24.1.1 to 24.1.2
  ([cdc1963](https://github.com/zavoloklom/docker-compose-linter/commit/cdc196300a0145f80ebcd1cf821b79b931b9ee34))

### Documentation

- add yaml anchor handling section
  ([a7b61bb](https://github.com/zavoloklom/docker-compose-linter/commit/a7b61bb877ed2e0e67dedac1395d2a32113c57df)),
  closes [#39](https://github.com/zavoloklom/docker-compose-linter/issues/39)
- change GitLab CI Example
  ([c421f23](https://github.com/zavoloklom/docker-compose-linter/commit/c421f2315a584adcc6b2414c25fa968e6053ffd8))

### Others

- update dependabot config
  ([321fa32](https://github.com/zavoloklom/docker-compose-linter/commit/321fa328276ad68eb9575399bdc8d24310268f6b))

## [1.0.6](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.5...v1.0.6) (2024-10-01)

### Bug Fixes

- run checks against any file provided by user and skip regex pattern
  ([0047590](https://github.com/zavoloklom/docker-compose-linter/commit/0047590e9459e7f13bfab81accd7fbac7c4139d9)),
  closes [#23](https://github.com/zavoloklom/docker-compose-linter/issues/23)

## [1.0.5](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.4...v1.0.5) (2024-10-01)

### Bug Fixes

- Search for compose.ya?ml
  ([0050953](https://github.com/zavoloklom/docker-compose-linter/commit/00509536eac9929613649b805ffbf392dc068598))

### Dependencies

- **dev:** bump @semantic-release/github from 10.3.4 to 10.3.5
  ([53e65a8](https://github.com/zavoloklom/docker-compose-linter/commit/53e65a848c6ea1bc82cbb4977eebb7564478d748))
- **dev:** bump eslint from 8.57.0 to 8.57.1
  ([2bbc6e7](https://github.com/zavoloklom/docker-compose-linter/commit/2bbc6e78179fa40fff5529caf0ff407f1449c8ed))

### Documentation

- add pull request template
  ([3770397](https://github.com/zavoloklom/docker-compose-linter/commit/3770397c3aebc829d8f8d1a8dae297303d3158b0))
- update github issue templates
  ([a7ec994](https://github.com/zavoloklom/docker-compose-linter/commit/a7ec99412dcdda18f0405adfe10ed4f8e001a055))

## [1.0.4](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.3...v1.0.4) (2024-09-20)

### Bug Fixes

- resolve error "key already set" in Service Keys Order Rule
  ([336723d](https://github.com/zavoloklom/docker-compose-linter/commit/336723d7ebcdf717f278896f7fbf0d39fce4f5e9)),
  closes [#9](https://github.com/zavoloklom/docker-compose-linter/issues/9)

## [1.0.3](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.2...v1.0.3) (2024-09-20)

### Bug Fixes

- handle port value provided with envs
  ([63c6176](https://github.com/zavoloklom/docker-compose-linter/commit/63c617671f0b55630a9bc36cfc65a734596e7c56)),
  closes [#8](https://github.com/zavoloklom/docker-compose-linter/issues/8)

### CI/CD

- update version for upload-artifact and download-artifact actions
  ([f3187a6](https://github.com/zavoloklom/docker-compose-linter/commit/f3187a63679c7cbaf1ec5a6f009a4a09a0d4f366))

## [1.0.2](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.1...v1.0.2) (2024-09-20)

### Bug Fixes

- change cli-config JSON Schema
  ([a627504](https://github.com/zavoloklom/docker-compose-linter/commit/a627504f447e12d52d99617d8a1f9a7f99d0293f))

### Dependencies

- **dev:** bump @eslint-community/regexpp from 4.11.0 to 4.11.1
  ([910d6ea](https://github.com/zavoloklom/docker-compose-linter/commit/910d6ea91a433021158073970283301d0909f153))
- **dev:** bump @semantic-release/github from 10.3.3 to 10.3.4
  ([416f176](https://github.com/zavoloklom/docker-compose-linter/commit/416f176965b9e9fa894ee5d61e9b569b5d7f53a1))

### CI/CD

- add markdownlint command with @semantic-release/exec
  ([c6f8896](https://github.com/zavoloklom/docker-compose-linter/commit/c6f88964a174120041fff1b7744b3edde2f8c49e))
- remove uploading reports to Codacy from PR
  ([f67cf3c](https://github.com/zavoloklom/docker-compose-linter/commit/f67cf3ce8005cbdd3e8504341437a6629cce563b))

### Others

- add GitHub issue template for bugs
  ([4163c30](https://github.com/zavoloklom/docker-compose-linter/commit/4163c3084c3dae80d85bedfc7daba86b21f36318))
- change order of semantic-release job
  ([e8d1831](https://github.com/zavoloklom/docker-compose-linter/commit/e8d1831a683e0d6428c30376b0a668b6138717a8))
- set up a security policy
  ([8c220ac](https://github.com/zavoloklom/docker-compose-linter/commit/8c220ac824cceec1b0fb1066c0a11fa98eac1116))

## [1.0.1](https://github.com/zavoloklom/docker-compose-linter/compare/v1.0.0...v1.0.1) (2024-09-14)

### Bug Fixes

- correct npm release ci job
  ([267979d](https://github.com/zavoloklom/docker-compose-linter/commit/267979d635d695680f6f567df66ea47aa4203477))

### CI/CD

- add "Upload release artifacts" job
  ([2c12132](https://github.com/zavoloklom/docker-compose-linter/commit/2c12132e25c7b3de253f40c7f4bd2a0d50687315))

### Others

- update CHANGELOG.md generation to comply with linting rules
  ([43a7efa](https://github.com/zavoloklom/docker-compose-linter/commit/43a7efafb0fea05e50f81805758c8eec61f64153))

## 1.0.0 (2024-09-14)

### Features

- initial release
  ([6969503](https://github.com/zavoloklom/docker-compose-linter/commit/69695032957556141669ea6a5daf213ba8479ffa))
