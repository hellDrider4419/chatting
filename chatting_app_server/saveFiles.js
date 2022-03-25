const fs = require("fs");

const uploadFiles = (image) => {
  let name = `${Date.now()}-${image.name}`;
  fs.writeFileSync(`./public/${name}`, new Buffer.from(image.file, "base64"));
  return name;
};

module.exports = { uploadFiles };
