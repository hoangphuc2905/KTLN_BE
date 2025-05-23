const { exec } = require("child_process");
const fs = require("fs");

async function compressPDF(inputPath, maxSizeMB = 3.5) {
  const outputPath = inputPath.replace(/(\.pdf)?$/i, "_compressed.pdf");
  const gsCmd = `${
    process.platform === "win32" ? "gswin64c" : "gs"
  } -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen \
-dDetectDuplicateImages=true -dDownsampleColorImages=true -dColorImageResolution=72 \
-dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

  await new Promise((resolve, reject) => {
    exec(gsCmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Ghostscript error:", stderr);
        return reject(new Error("Nén PDF thất bại."));
      }
      const stats = fs.statSync(outputPath);
      if (stats.size > maxSizeMB * 1024 * 1024) {
        fs.unlinkSync(outputPath);
        return reject(
          new Error(`File sau khi nén vẫn lớn hơn ${maxSizeMB}MB.`)
        );
      }
      resolve();
    });
  });

  return outputPath;
}

module.exports = { compressPDF };
