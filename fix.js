const fs = require('fs');
const path = require('path');
function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p, callback);
        else callback(p);
    });
}
walk('./src', p => {
    if (/\.tsx?$/.test(p)) {
        let c = fs.readFileSync(p, 'utf8');
        let c2 = c.replace(/([a-zA-Z0-9_])t\("([^"]+)"\)/g, '$1t.$2');
        if (c !== c2) {
            fs.writeFileSync(p, c2, 'utf8');
        }
    }
});
