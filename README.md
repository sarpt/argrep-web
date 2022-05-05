# argrep-web - run grep recursively on archives

An [argrep](https://github.com/sarpt/argrep) http server. Frontend tbd.

### execution example

Run...

`deno run --unstable --allow-net --allow-read --allow-write --allow-run ./server/main.ts`

... or install/compile:

- `deno install --allow-net --unstable --allow-read --allow-write --allow-run ./server/main.ts`

- `deno compile --allow-net --unstable --allow-read --allow-write --allow-run ./server/main.ts`

and then run:

`argrep-web`

At the moment frontend is not implemented but a quick & simple way to test
grepping is by `curl`:

`curl -X PUT --data "path=<path to file>" --data "pattern=<some pattern to search>" localhost:8080/greps`

... it will return task id which ten can be used with SSE:

`curl -N localhost:8080/sse/greps?id=<id>`

### dependencies for running

- `deno` - 1.21.0 and up
- `argrep` & it's dependencies - https://github.com/sarpt/argrep which does
  actual grepping as a child process

### permissions

- `unstable` - for using unstable socket & running APIs
- `allow-net` - for sockets communication between server & `argrep`
- `allow-run` - for executing `argrep`
- `allow-read` & `allow-write` - for unix socket communication with argrep
