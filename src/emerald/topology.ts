// Emerald Bay Lab — spatial contract v4. Coordinates in metres: X east, Z north, Y up.
// Shared by placement, HUD map, collision-aware locomotion and automatic QA.
export type PlaceId="arrival"|"plaza"|"terrace"|"lab"|"automate"|"lead"|"gallery"|"contact";
export type PanelId="works"|"about"|"experience"|"recognition"|"contact"|"map"|"settings"|"help";
export type Quality="low"|"medium"|"high";
export const presets={
 low:{dpr:1,texture:256,shadow:0,reflection:0,trees:32,grass:0,bloom:false},
 medium:{dpr:1.5,texture:512,shadow:1024,reflection:256,trees:85,grass:1400,bloom:false},
 high:{dpr:2,texture:1024,shadow:2048,reflection:512,trees:145,grass:3200,bloom:true}
} as const;
export const nodes:[number,number][]=[
 [0,-50],[0,-30],[0,-8],[-16,-10],[-32,-10],[-38,2],[-29,18],[-16,29],
 [0,40],[15,29],[28,18],[38,5],[36,-10],[44,-20],[53,-30],[27,-26],[15,-17],
 [-16,10],[16,10],[0,25],[0,0]
];
export const heights:number[]=[1.1,1.8,3.5,4.2,4.5,5.2,6.5,8,10.5,8,6.5,5.5,4.5,3.8,3,3.1,3.4,5.5,5.5,8.2,4];
export const edges:[number,number][]=[
 [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],
 [10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,2],
 [2,17],[17,6],[2,18],[18,10],[2,19],[19,8],[2,20],[17,19],[18,19]
];
export const places:{id:PlaceId,title:string,label:string,description:string,panel:PanelId,node:number,color:string}[]=[
 {id:"arrival",title:"Arrival Pier",label:"The Beginning",description:"Arrive. Activate. Explore.",panel:"help",node:0,color:"#d1f5e0"},
 {id:"plaza",title:"Bay Plaza",label:"World Hub",description:"A living world. Your journey begins here.",panel:"help",node:20,color:"#e7e1be"},
 {id:"terrace",title:"Origins Terrace",label:"The Journey",description:"From understanding operations to creating meaningful technology.",panel:"about",node:4,color:"#c6d8a0"},
 {id:"lab",title:"BUILD — Engineering Studio",label:"Products & Systems",description:"Architecture, engineering and products with purpose.",panel:"works",node:6,color:"#78e3c4"},
 {id:"automate",title:"AUTOMATE — Intelligent Systems Lab",label:"AI & Automation",description:"From real workflows to intelligent experiences.",panel:"works",node:10,color:"#95eaf2"},
 {id:"lead",title:"LEAD — Strategy Center",label:"Strategy & Leadership",description:"Shaping products and coordinating people toward delivery.",panel:"experience",node:8,color:"#edcc89"},
 {id:"gallery",title:"Recognition Gallery",label:"Evidence of Craft",description:"Research, awards and professional learning.",panel:"recognition",node:12,color:"#e4c2f2"},
 {id:"contact",title:"Horizon — Contact Deck",label:"The Next Chapter",description:"Good work begins with a conversation.",panel:"contact",node:14,color:"#efd39d"}
];
export const PATH_WIDTH=4.6;
export const platformRadius=(i:number)=>({0:4.8,2:7,4:9,6:10,8:11,10:10,12:9,14:8,20:11} as Record<number,number>)[i]||3.4;
export function pointOnSegment(x:number,z:number,a:[number,number],b:[number,number]):[number,number] {
 const dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz;
 const t=Math.max(0,Math.min(1,d?((x-a[0])*dx+(z-a[1])*dz)/d:0));
 return [a[0]+dx*t,a[1]+dz*t];
}
export function nearestNode(x:number,z:number){let best=0,dist=Infinity;nodes.forEach(([a,b],i)=>{const d=Math.hypot(x-a,z-b);if(d<dist){dist=d;best=i}});return best;}
export function groundHeight(x:number,z:number) {
 let best=Infinity,result=heights[0];
 for(const [a,b] of edges){
  const p=pointOnSegment(x,z,nodes[a],nodes[b]);
  const abx=nodes[b][0]-nodes[a][0],abz=nodes[b][1]-nodes[a][1],length=abx*abx+abz*abz;
  const t=Math.max(0,Math.min(1,length?((p[0]-nodes[a][0])*abx+(p[1]-nodes[a][1])*abz)/length:0));
  const d=Math.hypot(x-p[0],z-p[1]);
  if(d<best){best=d;result=heights[a]+(heights[b]-heights[a])*t;}
 }
 // Expanded platforms are kept level for furniture/character interaction.
 for(const p of places){const [px,pz]=nodes[p.node],rad=platformRadius(p.node)-1.2;
  if(Math.hypot(x-px,z-pz)<rad)return heights[p.node];
 }
 return result;
}
export function isWalkable(x:number,z:number) {
 return nodes.some(([a,b],i)=>Math.hypot(x-a,z-b)<=platformRadius(i)-0.42)||
 edges.some(([a,b])=>{const p=pointOnSegment(x,z,nodes[a],nodes[b]);return Math.hypot(x-p[0],z-p[1])<=PATH_WIDTH/2-0.37;});
}
export function pathBetween(from:number,to:number):number[]{
 if(from<0||to<0||from>=nodes.length||to>=nodes.length)return [];
 const distance=nodes.map(()=>Infinity),prev=nodes.map(()=>-1),used=new Set<number>();
 distance[from]=0;
 for(let n=0;n<nodes.length;n++){
  let best=-1;for(let i=0;i<nodes.length;i++)if(!used.has(i)&&(best<0||distance[i]<distance[best]))best=i;
  if(best<0||!Number.isFinite(distance[best])||best===to)break;
  used.add(best);
  for(const [a,b] of edges){
   const dest=a===best?b:b===best?a:-1;
   if(dest<0)continue;
   const alt=distance[best]+Math.hypot(nodes[best][0]-nodes[dest][0],nodes[best][1]-nodes[dest][1]);
   if(alt<distance[dest]){distance[dest]=alt;prev[dest]=best;}
  }
 }
 const path=[to];while(path[0]!==from&&prev[path[0]]>=0)path.unshift(prev[path[0]]);
 return path[0]===from?path:[];
}
function lineWalkable(a:[number,number],b:[number,number]){
 const dist=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(2,Math.ceil(dist/0.12));
 for(let j=0;j<=steps;j++)if(!isWalkable(a[0]+(b[0]-a[0])*j/steps,a[1]+(b[1]-a[1])*j/steps))return false;
 return true;
}
export function routeTo(x:number,z:number,tx:number,tz:number):[number,number][]{
 const start:[number,number]=[x,z],end:[number,number]=[tx,tz];
 if(!isWalkable(x,z)||!isWalkable(tx,tz))return [];
 if(lineWalkable(start,end))return [end];
 const beginnings=nodes.map((p,i)=>({p,i})).filter(v=>lineWalkable(start,v.p));
 const endings=nodes.map((p,i)=>({p,i})).filter(v=>lineWalkable(v.p,end));
 let best:[number,number][]=[],min=Infinity;
 for(const a of beginnings)for(const b of endings){
  const path=pathBetween(a.i,b.i);if(!path.length)continue;
  const pts:[number,number][]=[start,...path.map(i=>nodes[i]),end];
  const length=pts.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]),0);
  if(length<min&&pts.slice(1).every((p,i)=>lineWalkable(pts[i],p))){min=length;best=pts.slice(1);}
 }
 return best;
}
