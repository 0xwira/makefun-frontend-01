import { cp, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { gzipSync } from 'node:zlib';
const root=process.cwd(), output=resolve(process.env.MAKEFUN_OUTPUT_DIR||'/output');
if(output===root||output.startsWith(join(root,'app')+'/')||output===join(root,'app')||output===join(root,'screenshots'))throw Error('Output must be separate from source folders');
const names=['1-board.jpg','2-bounty.jpg','3-leaderboard.jpg'];
const screenshots=[];
for(const name of names){const s=await stat(join(root,'screenshots',name));if(!s.isFile()||s.size>256*1024)throw Error(`Screenshot ${name} missing or exceeds 256 KiB`);screenshots.push({file:'screenshots/'+name,bytes:s.size})}
await mkdir(output,{recursive:true});
await cp(join(root,'app'),join(output,'app'),{recursive:true});
await cp(join(root,'screenshots'),join(output,'screenshots'),{recursive:true});
async function files(dir,prefix=''){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name),name=prefix+e.name;if(e.isDirectory())result.push(...await files(path,name+'/'));else{const data=await readFile(path);result.push({file:name,bytes:data.length,gzipBytes:gzipSync(data).length})}}return result}
const appFiles=await files(join(root,'app'),'app/');
const initial=new Set(['app/index.html','app/style.css','app/main.js','app/api.js','app/format.js','app/views-board.js']);
const totals=xs=>({rawBytes:xs.reduce((n,x)=>n+x.bytes,0),gzipBytes:xs.reduce((n,x)=>n+x.gzipBytes,0)});
const firstLoad=totals(appFiles.filter(x=>initial.has(x.file))),wholeApp=totals(appFiles);
const dossier={name:'FIELDNOTES',entrypoint:'app/index.html',firstLoad,wholeApp,files:appFiles,screenshots,wholeOutput:{rawBytes:wholeApp.rawBytes+screenshots.reduce((n,x)=>n+x.bytes,0)},notes:'Gzip totals sum individually compressed HTTP assets. All initial static module imports are included; secondary route views load on demand.'};
await writeFile(join(output,'dossier.json'),JSON.stringify(dossier,null,2)+'\n');
console.log(`Load totals: ${firstLoad.rawBytes} bytes raw / ${firstLoad.gzipBytes} bytes gzip`);
console.log(`Whole-app totals: ${wholeApp.rawBytes} bytes raw / ${wholeApp.gzipBytes} bytes gzip`);
console.log('Screenshots: 3 verified, each at most 256 KiB');
