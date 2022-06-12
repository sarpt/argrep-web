# argrep-web - run grep recursively on archives

An [argrep](https://github.com/sarpt/argrep) http server.

### execution example

App is separated into a frontend and backend - backend is written in `deno`, and frontend in `react`.

From `server` directory run...

`deno run --unstable --allow-net --allow-read --allow-write --allow-run ./server/main.ts`

... or install/compile:

- `deno install --allow-net --unstable --allow-read --allow-write --allow-run ./server/main.ts`

- `deno compile --allow-net --unstable --allow-read --allow-write --allow-run ./server/main.ts`

and then run:

`argrep-web`

... to start a server.

Then, to run a frontend, navigate to `frontend` directory and run `yarn serve`.

For quick & simple testing of the server `curl` invocations could be used:

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
