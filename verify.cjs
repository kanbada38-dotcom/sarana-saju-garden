const assert=require('node:assert/strict');
const {Solar}=require('./assets/lunar.js');
const e=Solar.fromYmdHms(1999,6,7,9,11,0).getLunar().getEightChar();
assert.equal(e.toString(),'己卯 庚午 庚寅 辛巳');
for(const method of ['getYear','getMonth','getDay','getTime','getDayGan'])assert.equal(typeof e[method](),'string');
const fs=require('node:fs');
for(const file of ['index.html','style.css','app.js','assets/lunar.js','assets/sarana-moonlight.webp','.github/workflows/deploy.yml'])assert.ok(fs.statSync(file).size>0,file);
console.log('PASS: upstream EightChar fixture, chart API, deployment files and assets');
