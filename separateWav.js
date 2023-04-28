//import { WaveFile } from "../../util/wavefile/index.js";
import { WaveFile } from "https://code4fukui.github.io/wavefile-es/index.js";

export const separateSamples = (data) => {
  const right = new Int16Array(data.length / 4);
  const left = new Int16Array(data.length / 4);
  for (let i = 0; i < right.length; i++) {
    const n = i * 4;
    right[i] = data[n] + (data[n + 1] << 8);
    left[i] = data[n + 2] + (data[n + 3] << 8);
    /*
    const n1 = data[n + 2];
    const n2 = data[n + 3];
    if (n1 || n2) {
      console.log(n1, n2)
    }
    */
  }
  return [right, left];
};

export const separateWav = (src) => {
  const wav = new WaveFile();
  wav.fromBuffer(src);
  console.log(wav);
  const fmt = wav.fmt;
  if (fmt.bitsPerSample != 16 || fmt.chunkSize != 16 || fmt.numChannels != 2) {
    throw new Error("not supported format", fmt);
  }
  const [right, left] = separateSamples(wav.data.samples);
  const dstr = new WaveFile();
  dstr.fromScratch(1, fmt.sampleRate, '16', right);
  const dstl = new WaveFile();
  dstl.fromScratch(1, fmt.sampleRate, '16', left);
  return [dstr.toBuffer(), dstl.toBuffer()];
};
