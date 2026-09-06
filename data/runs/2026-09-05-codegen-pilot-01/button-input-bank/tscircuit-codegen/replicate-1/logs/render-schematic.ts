import {convertCircuitJsonToSchematicSvg} from '/Users/ankan/.bun/install/global/node_modules/circuit-to-svg/dist/index.js';
import sharp from '/Users/ankan/.bun/install/global/node_modules/sharp/lib/index.js';
const svg = await Bun.file('artifacts/attempt-02/dist/index/schematic.svg').text();
await sharp(Buffer.from(svg)).png().toFile('artifacts/attempt-02/dist/index/schematic.png');
