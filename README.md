# simple-jpeg-extractor
Small node.js script to extract JPEGs embedded into files

Created to extract JPEGs from Shockwave file types, mainly W3D/"3de" and DCR files.

## Usage
`node extract.js path`

## Dependencies
None, uses node.js standard libraries `fs` and `path`.

## "Why not just use binwalk?"
binwalk tends to overshoot data ending up in large filesizes in some cases.

## Planned Features
* Get texture names from W3D files and use it instead of array index for file names
