# argrep-web - run grep recursively on archives

A web variant of a crude and quick implementation of a tool to run `grep` recursively through
archives (https://github.com/sarpt/argrep).

### execution example

Run...

`deno run --unstable --allow-ffi --allow-env --allow-read --allow-write --allow-run main.ts </path/to/dir or /path/to/archive> -e <grep regex> [-- <grep options>]`

... or install/compile:

- `deno install --unstable --allow-ffi --allow-env --allow-read --allow-write --allow-run main.ts`

- `deno compile --unstable --allow-ffi --allow-env --allow-read --allow-write --allow-run main.ts`

and then run

`argrep-web </path/to/dir or /path/to/archive> -e <grep regex> [-- <grep options>]`

### dependencies for running

- `deno` - tested on 1.20.5 and up
- `grep` - just a grep
- `xzgrep`/`lzgrep` - for xz/lzma archives
- `libmagic` - for files format deduction
- `libarchive` - for archives handling

### permissions

- `unstable` & `allow-ffi` - for FFI (format deduction using `libmagic`, archive
  extraction using `libarchive`)
- `allow-env` - for reading home and tmp directory path
- `allow-read` - for reading directories and files
- `allow-run` - for executing `grep`, `xzgrep` & `lzgrep`
- `allow-write` - for archives extraction with `libarchive` to descend into
  archives recursively
