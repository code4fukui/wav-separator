import { downloadZip } from "https://code4sabae.github.io/js/downloadZip.js";
import { waitDropFiles } from "https://code4sabae.github.io/js/waitDropFiles.js";
import { downloadFile } from "https://code4sabae.github.io/js/downloadFile.js";
//import { downloadTextFile } from "https://code4sabae.github.io/js/downloadTextFile.js";
import { readAsArrayBufferAsync } from "https://code4sabae.github.io/js/readAsArrayBufferAsync.js";

export const convertWhenDrop = async (divmain, ext, converter) => {
  A: for (;;) {
    const upext = ext.toUpperCase();
    divmain.innerHTML = upext + "ファイルをドロップしてください";
    const items = await waitDropFiles(divmain);
    const files = [];
    for (const item of items) {
      // console.log(item.type); // ignore item.type in Windows
      if (!item.file.name.endsWith("." + ext)) {
        alert("ファイル形式が違います。" + upext + "ファイルをドロップしてください。")
        continue A;
      }
      const file = item.file;
      const bin = new Uint8Array(await readAsArrayBufferAsync(file));
      try {
        const res = await converter(file.name, bin);
        if (Array.isArray(res)) {
          res.forEach(r => files.push(r));
        } else {
          files.push(res);
        }
      } catch (e) {
        console.log(e);
        alert("変換に失敗しました。データが正常かご確認ください。");
        continue A;
      }
    }
    if (files.length == 1) {
      const f = files[0];
      downloadFile(f.name, f.data);
    } else {
      downloadZip(ext + "s.zip", files);
    }
  }
};
