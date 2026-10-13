import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const logo=(await readFile('public/images/rook-logo.webp')).toString('base64');
const screen=(await readFile('public/images/daily-notes.webp')).toString('base64');
for(const [lang,lines,badge] of [['en',['Capture your day.','See your progress.'],'Free · Open source · Local-first'],['tr',['Gününü kaydet.','İlerlemeni gör.'],'Ücretsiz · Açık kaynak · Önce yerel']]) {
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><clipPath id="clip"><rect x="650" y="84" width="570" height="550" rx="18"/></clipPath></defs><rect width="1200" height="630" fill="#F7F7F8"/><rect x="0" y="617" width="1200" height="13" fill="#247c5b"/><image href="data:image/webp;base64,${logo}" x="65" y="62" width="54" height="54"/><g font-family="DejaVu Sans,sans-serif"><text x="130" y="97" font-size="27" font-weight="700" fill="#191919">rook<tspan font-weight="400">notes</tspan><tspan fill="#247c5b">.</tspan></text><text x="70" y="263" font-size="47" font-weight="600" letter-spacing="-2" fill="#191919">${lines[0]}</text><text x="70" y="329" font-size="47" font-weight="600" letter-spacing="-2" fill="#247c5b">${lines[1]}</text><text x="72" y="435" font-size="18" fill="#5A5A5A">${badge}</text><text x="72" y="535" font-size="17" fill="#5A5A5A">rooknotes.com</text></g><rect x="641" y="75" width="590" height="565" rx="24" fill="#FFFFFF" stroke="#dedee3" stroke-width="2"/><image href="data:image/webp;base64,${screen}" x="513" y="84" width="960" height="668" clip-path="url(#clip)"/></svg>`;
 await sharp(Buffer.from(svg)).png().toFile(`public/images/social-${lang}.png`);
}
console.log('Generated both localized 1200 × 630 social cards.');
