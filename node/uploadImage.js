const fs = require("fs");
const fetch = require("node-fetch");
const FormData = require("form-data");

function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function upload(req, res) {
  const File = req.file;

  if (!File || File.mimetype.indexOf("image") === -1) {
    res.send({
      status: false,
      url: null,
    });
    if (File) {
      fs.unlinkSync(File.path);
    }
    return;
  }

  try {
    const filename = guid() + ".jpg";
    const form = new FormData();
    form.append(
      "key",
      "2cd32b5c33e5ac425bbcfa19a32da95702a5fdfb202f168e458092b4e110a3aa"
    );
    form.append("filename", filename);
    form.append("upfile", fs.createReadStream(File.path), {
      filename: filename,
      contentType: File.mimetype,
    });

    const response = await fetch("https://pic.cloudshop.ru/upload.php", {
      method: "POST",
      body: form,
    });

    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send({
      status: false,
      url: null,
      error: error.message,
    });
  } finally {
    if (File) {
      fs.unlinkSync(File.path);
    }
  }
}

module.exports = upload;
