# Performance Checks

Create benchmark to compare with some alternatives using [hyperfine](https://github.com/sharkdp/hyperfine).

## Version 1

`hyperfine -i "npx dclint@1.0.7 ./docker-compose-linter/tests/mocks/docker-compose.yml"`

```text
Benchmark 1: npx dclint@1.0.7 ./docker-compose-linter/tests/mocks/docker-compose.yml
  Time (mean ± σ):     485.4 ms ±  19.6 ms    [User: 417.6 ms, System: 81.4 ms]
  Range (min … max):   441.4 ms … 514.4 ms    10 runs
```

## Version 2

`hyperfine -i "npx dclint@2.0.0 ./docker-compose-linter/tests/mocks/docker-compose.yml"`

```text
Benchmark 2: npx dclint@2.0.0 ./docker-compose-linter/tests/mocks/docker-compose.yml
  Time (mean ± σ):     487.6 ms ±  60.0 ms    [User: 387.3 ms, System: 76.2 ms]
  Range (min … max):   438.8 ms … 627.9 ms    10 runs
```

## Version 3

`hyperfine -i "npx dclint@3.0.0 ./tests/mocks/docker-compose.yml"`

```text
Benchmark (Version 3): npx dclint@3.0.0 ./tests/mocks/docker-compose.yml
  Time (mean ± σ):     542.8 ms ±  14.8 ms    [User: 508.0 ms, System: 96.6 ms]
  Range (min … max):   515.7 ms … 571.7 ms    10 runs
```

`hyperfine -i "npx dclint@3.0.0 ./awesome-compose-master/ -r"`

```text
Benchmark (Version 3): npx dclint@3.0.0 ./awesome-compose-master/ -r
  Time (mean ± σ):      1.237 s ±  0.026 s    [User: 1.533 s, System: 0.128 s]
  Range (min … max):    1.195 s …  1.267 s    10 runs
```


# Version 4

`hyperfine -i "node ./bin/dclint.cjs ./tests/mocks/docker-compose.yml"`

```text
Benchmark (Version 4): node ./bin/dclint.cjs ./tests/mocks/docker-compose.yml
  Time (mean ± σ):     127.3 ms ±   2.3 ms    [User: 169.0 ms, System: 17.1 ms]
  Range (min … max):   123.8 ms … 132.6 ms    23 runs
```

```text
Benchmark (Version 4): node ./bin/dclint.cjs ./awesome-compose-master/ -r
  Time (mean ± σ):     152.4 ms ±   2.3 ms    [User: 216.3 ms, System: 38.5 ms]
  Range (min … max):   150.1 ms … 159.3 ms    19 runs
```