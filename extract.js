const fs = require("fs");
const path = require("path");

const header = Buffer.from([
    0xff,
    0xd8,
    0xff,
    0xe0,
    0x00,
    0x10,
    0x4a,
    0x46,
    0x49,
    0x46
]); // JPEG header
const eof = Buffer.from([0xff, 0xd9]); // JPEG EOF

const w3dheader = Buffer.from([0x49, 0x46, 0x58]); // W3D header

const filepath = process.argv[2];
if (!filepath) {
    console.log("no args passed");
    return;
}
if (!fs.existsSync(filepath)) {
    console.log("does not exist");
    return;
}

const file = fs.readFileSync(filepath);
const _filepath = path.parse(filepath);
const folder = _filepath.dir;
const name = _filepath.name;

let isw3d = false;
if (file.indexOf(w3dheader, 0) > -1) {
    isw3d = true;
    console.log(
        "w3d header found, using w3d texture names if avaliable (may false positive)"
    );
}

const textureName = /\x00([a-zA-Z0-9_-]+?)\x01\xFF\xD8\xFF\xE0\x00\x10\x4A\x46\x49\x46/;

const files = [];
const names = [];

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
    if (isw3d) {
        let _file = file
            .slice(headerOffset - 64, eofOffset + eof.length) // 64 byte offset for safety
            .toString("latin1"); // latin1 allows single byte encoding
        let matches = textureName.exec(_file);

        if (matches && matches[1]) {
            names.push(matches[1]);
        } else {
            names.push(files.length - 1);
        }
    }
    index = eofOffset + eof.length;
}

for (f in files) {
    if (!fs.existsSync(`${folder}/${name}`)) fs.mkdirSync(`${folder}/${name}`);

    let data = files[f];
    fs.writeFileSync(`${folder}/${name}/${names[f] || f}.jpg`, data);
    console.log(`wrote file ${folder}/${name}/${names[f] || f}.jpg`);
}
