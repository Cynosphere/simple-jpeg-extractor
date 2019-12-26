const fs = require("fs");
const path = require("path");

const header = Buffer.from("FFD8FFE000104A464946", "hex"); // ÿØÿà 0x00 0x10 JFIF, JPEG header
const eof = Buffer.from("FFD9", "hex"); // ÿÙ, JPEG EOF

let filepath = process.argv[2];
if (!filepath) {
    console.log("no args passed");
    return;
}
if (!fs.existsSync(filepath)) {
    console.log("does not exist");
    return;
}

let file = fs.readFileSync(filepath);
let _filepath = path.parse(filepath);
let folder = _filepath.dir;
let name = _filepath.name;

const files = [];

let index = 0;
while (true) {
    const headerOffset = file.indexOf(header, index);
    if (headerOffset == -1) {
        break;
    }
    const eofOffset = file.indexOf(eof, headerOffset + header.length);
    if (eofOffset == -1) {
        break;
    }
    files.push(file.slice(headerOffset, eofOffset + eof.length));
    index = eofOffset + eof.length;
}

for (f in files) {
    if (!fs.existsSync(`${folder}/${name}`)) fs.mkdirSync(`${folder}/${name}`);

    let data = files[f];
    fs.writeFileSync(`${folder}/${name}/${f}.jpg`, data);
    console.log(`wrote file ${folder}/${name}/${f}.jpg`);
}
