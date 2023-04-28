import { separateWav } from "./separateWav.js";

const name = Deno.args[0];
if (!name.endsWith(".wav")) {
  console.log("[wav filename");
  Deno.exit(1);
}
const src = await Deno.readFile(name);
const dst = separateWav(src);
const bname = name.substring(0, name.length - 4);
await Deno.writeFile(bname + ".r.wav", dst[0]);
await Deno.writeFile(bname + ".l.wav", dst[1]);
