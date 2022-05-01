import { serve } from "https://deno.land/std@0.135.0/http/mod.ts";

import { routing } from "./routing.ts";
import { grepArchivesWithArgrep } from "./gateways/grepArchivesWithArgrep.ts";

const PORT = 8080;
console.log(`Server is running on http://localhost:${PORT}`);

const dependencies = {
  grepArchives: grepArchivesWithArgrep(),
};

await serve(routing(dependencies), {
  port: PORT,
});
