// Build smooth inflated Manrope glyph meshes once; the browser only uploads buffers.
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { ExtrudeGeometry } from 'three';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
const data = JSON.parse(fs.readFileSync('public/fonts/manrope-hero.json', 'utf8'));
const font = new FontLoader().parse(data), manifest = {};
function inside(x,y,polygon){let result=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)result=!result;}return result;}
for(const char of new Set('BUILDAOMTE')){
 const shapes=font.generateShapes(char,100), contours=shapes.map(s=>s.extractPoints(10)),segments=[];
 for(const p of contours)for(const contour of[p.shape,...p.holes])for(let i=0;i<contour.length;i++)segments.push([contour[i],contour[(i+1)%contour.length]]);
 function signedDistance(x,y){let d=Infinity;for(const[a,b]of segments){const dx=b.x-a.x,dy=b.y-a.y;const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const positive=contours.some(c=>inside(x,y,c.shape)&&!c.holes.some(h=>inside(x,y,h)));return positive?d:-d;}
 // One continuous profile across cap and bevel avoids a seam at the front face.
 const height=(x,y)=>2+17*Math.sqrt(1-Math.exp(-Math.max(.001,signedDistance(x,y)+2.8)*.2));
 let geometry=new ExtrudeGeometry(shapes,{depth:4,bevelEnabled:true,bevelThickness:7,bevelSize:2.8,bevelSegments:5,curveSegments:8,steps:1});
 geometry=new TessellateModifier(6,6).modify(geometry);
 const p=geometry.attributes.position;
 for(let i=0;i<p.count;i++)if(p.getZ(i)>=2)p.setZ(i,height(p.getX(i),p.getY(i)));
 geometry.deleteAttribute('normal');geometry.deleteAttribute('uv');geometry=mergeVertices(geometry,.001);geometry.computeVertexNormals();
 const positions=geometry.attributes.position,normals=geometry.attributes.normal;
 for(let i=0;i<positions.count;i++)if(positions.getZ(i)>=2){const x=positions.getX(i),y=positions.getY(i),e=.15;const dx=(height(x+e,y)-height(x-e,y))/(2*e),dy=(height(x,y+e)-height(x,y-e))/(2*e),len=Math.hypot(dx,dy,1);normals.setXYZ(i,-dx/len,-dy/len,1/len);}
 const rounded=array=>Array.from(array,v=>Math.round(v*1000)/1000);
 manifest[char]={position:rounded(positions.array),normal:rounded(normals.array),index:Array.from(geometry.index.array),advance:data.glyphs[char].ha/data.resolution};geometry.dispose();
}
fs.writeFileSync('public/fonts/manrope-inflated.json.gz',gzipSync(JSON.stringify(manifest),{level:9}));
console.log('Inflated glyphs:',fs.statSync('public/fonts/manrope-inflated.json.gz').size,'bytes');
