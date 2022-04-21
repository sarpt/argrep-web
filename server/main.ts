import dir from "https://deno.land/x/dir@v1.2.0/mod.ts";
import { Args, parse } from "https://deno.land/std@0.120.0/flags/mod.ts";
import { serve } from "https://deno.land/std@0.135.0/http/mod.ts";
import { LibArchive } from "https://raw.githubusercontent.com/sarpt/deno-libarchive/master/mod.ts";

import { defaultLibmagicPath, LibMagic } from "./libs/libmagic.ts";
import { routing } from "./routing.ts";
import { grepArchivesOnDisk } from "./gateways/grepArchivesOnDisk.ts";

const defaultLibarchivePath = "/usr/lib/libarchive.so"; // ldconfig aliases path; TODO: either parse ld.so.cache or use ldconfig -p to find this

type Arguments = {
  ["--"]: string[]; // arguments to grep after --
  v?: boolean; // -v : verbose logging
  td?: string; // --td : temporary directory for archives extraction
  libmagic?: string; // --libmagic : path to libmagic library
  libarchive?: string; // --libarchive : path to libarchive library
} & Args;

const tempDirPrefix = "argrep_";

const args = parse(Deno.args, { "--": true }) as unknown as Arguments;
const homeDir = dir("home");
if (!homeDir) {
  console.error("[ERR] Could not resolve home directory");
  Deno.exit(1);
}

const verbose = args.v;

const libArchivePath = args.libarchive
  ? args.libarchive
  : defaultLibarchivePath;
if (verbose) {
  console.info(
    `[INF] using '${libArchivePath}' as libarchive path`,
  );
}
const libArchive = new LibArchive({ libpath: libArchivePath });

const libMagicPath = args.libmagic ? args.libmagic : defaultLibmagicPath;
if (verbose) {
  console.info(
    `[INF] using '${libMagicPath}' as libmagic path`,
  );
}
const libMagic = new LibMagic();
const { errMsg: libMagicErr } = libMagic.open(libMagicPath);
if (libMagicErr) {
  console.error(
    `[ERR] could not open libmagic for format deduction: ${libMagicErr}`,
  );
  Deno.exit(1);
}

const tempDir = args.td
  ? args.td
  : await Deno.makeTempDir({ prefix: tempDirPrefix });
if (verbose) {
  console.info(
    `[INF] using '${tempDir}' as temporary path for archive extraction`,
  );
}

const PORT = 8080;
console.log(`Server is running on http://localhost:${PORT}`);

const dependencies = {
  grepArchives: grepArchivesOnDisk({ libArchive, libMagic, tempPath: tempDir }),
};

await serve(routing(dependencies), {
  port: PORT
});

libMagic.close();

