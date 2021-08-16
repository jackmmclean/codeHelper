let download = require("downloadjs");

export function downloadFile(fileName: string, cbGood: any, cbBad: any) {
  fetch(`${process.env.REACT_APP_API}/download/${fileName}`, {
    method: "GET",
    credentials: "include",
    headers: {
      contentType: "blob",
    },
  })
    .then((res) => res.blob())
    .then((blob) => {
      download(blob, fileName);
      //cbGood();
    })
    .catch((e) => cbBad(e));
}
