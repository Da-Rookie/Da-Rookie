import * as THREE from "three";
import { labelTexture } from "./materials";
import type { Quality } from "./topology";

export type ZoneKind = "build" | "automate" | "lead" | "recognition" | "origins" | "horizon";
export interface ZonePalette {
  stone: THREE.Material; frame: THREE.Material; timber: THREE.Material;
  glass: THREE.Material; wall: THREE.Material; dark: THREE.Material;
  mint: THREE.Material; skyGlow: THREE.Material; gold: THREE.Material; leaf: THREE.Material;
}
export interface DressingResult { colliders: THREE.Object3D[]; animated: THREE.Object3D[]; }

/** Authored props respect a 3.2m central corridor and the room's actual floor elevation.
 * Sources remain declarative: exhibits augment content in accessible HTML, never replace it.
 */
export function dressZone(
  root: THREE.Group,
  kind: ZoneKind,
  width: number,
  depth: number,
  quality: Quality,
  m: ZonePalette,
): DressingResult {
  const colliders: THREE.Object3D[] = [], animated: THREE.Object3D[] = [];
  const high = quality === "high", low = quality === "low";
  const w = width / 2, d = depth / 2, wing = w - 2.3;
  const accent = kind === "lead" || kind === "recognition" ? m.gold : m.mint;
  function put(geo: THREE.BufferGeometry, material: THREE.Material, x:number,y:number,z:number, parent:THREE.Object3D=root) {
    const item = new THREE.Mesh(geo,material);
    item.position.set(x,y,z);item.castShadow=true;item.receiveShadow=true;
    parent.add(item);
    return item;
  }
  function block(material:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number,p:THREE.Object3D=root) {
    return put(new THREE.BoxGeometry(sx,sy,sz),material,x,y,z,p);
  }
  function disc(material:THREE.Material,x:number,y:number,z:number,r:number,h:number,p:THREE.Object3D=root) {
    return put(new THREE.CylinderGeometry(r,r,h,24),material,x,y,z,p);
  }
  function orb(material:THREE.Material,x:number,y:number,z:number,r:number,p:THREE.Object3D=root) {
    return put(new THREE.IcosahedronGeometry(r,high?2:1),material,x,y,z,p);
  }
  function cable(material:THREE.Material,coords:[number,number,number][],thick=.045,p:THREE.Object3D=root){
    const path = new THREE.CatmullRomCurve3(coords.map(v=>new THREE.Vector3(...v)));
    return put(new THREE.TubeGeometry(path, Math.max(16,coords.length*8),thick,5,false),material,0,0,0,p);
  }
  function tag(title:string,sub:string,x:number,y:number,z:number,scale=2.6,rotation=0) {
    const panel=block(m.frame,x,y,z,scale+.15,.88,.1);
    const material=new THREE.MeshBasicMaterial({map:labelTexture(title,sub),transparent:true,side:THREE.DoubleSide,depthWrite:false});
    const face=put(new THREE.PlaneGeometry(scale,.65),material,x,y,z+.059);
    panel.rotation.y=rotation;face.rotation.y=rotation;
  }
  function planter(x:number,z:number,r=.45){
    disc(m.stone,x,.26,z,r,.42);
    disc(m.frame,x,.48,z,r*.9,.07);
    const stem=put(new THREE.CylinderGeometry(.035,.055,.9,6),m.timber,x,1.02,z);
    stem.castShadow=false;
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5;
      const frond=put(new THREE.ConeGeometry(.25,.9,4),m.leaf,x+Math.cos(a)*.22,1.1,z+Math.sin(a)*.22);
      frond.rotation.z=Math.sin(a)*.48;
    }
  }
  function pedestal(x:number,z:number,number:number){
    disc(m.dark,x,.48,z,.8,.88);
    disc(m.gold,x,.96,z,.83,.075);
    const numberPlate=block(m.stone,x,.24,z+.71,.46,.23,.045);
    numberPlate.rotation.y=0;
    return {x,z,index:number};
  }
  function monitor(x:number,z:number,turn=0){
    const desk=new THREE.Group();desk.position.set(x,0,z);desk.rotation.y=turn;root.add(desk);
    const top=block(m.timber,0,1.02,0,2.5,.17,1.15,desk);
    block(m.frame,-.95,.53,-.33,.12,.95,.14,desk);
    block(m.frame,.95,.53,-.33,.12,.95,.14,desk);
    block(m.frame,0,1.45,-.35,.12,.75,.12,desk);
    const screen=block(m.dark,0,1.96,-.36,1.94,1.1,.12,desk);
    screen.castShadow=false;
    const display=block(m.skyGlow,0,1.96,-.283,1.77,.91,.02,desk);
    display.castShadow=false;
    for(let i=0;i<5;i++)block(i%2?m.gold:m.mint,-.63+i*.3,1.82,-.263,.18,.12+(i%3)*.13,.018,desk);
    block(m.frame,0,1.16,.29,1.3,.04,.38,desk);
    const cup=disc(m.stone,.93,1.21,.34,.13,.17,desk);
    cup.castShadow=false;
    colliders.push(top);
  }
  function trophy(x:number,z:number,type:number){
    pedestal(x,z,type);
    if(type%3===0) {
      const cup=put(new THREE.SphereGeometry(.48,16,12,0,Math.PI*2,Math.PI/2,Math.PI/2),m.gold,x,1.5,z);
      cup.rotation.x=Math.PI;
      disc(m.gold,x,1.22,z,.18,.33);
      for(const sign of [-1,1])cable(m.gold,[[x+sign*.27,1.62,z],[x+sign*.65,1.66,z],[x+sign*.44,1.33,z]],.065);
    } else if(type%3===1) {
      const medal=put(new THREE.TorusGeometry(.44,.09,10,32),m.gold,x,1.58,z);
      medal.rotation.y=.15;
      block(m.mint,x,1.56,z,.28,.35,.12);
    } else {
      const award=put(new THREE.OctahedronGeometry(.57),m.skyGlow,x,1.53,z);
      award.rotation.z=.26;
      animated.push(award);
    }
  }
  // Wall niches: physical plinth/shelf/backboard, no scenic false doorways.
  function niche(x:number,z:number,side:number,caption:string){
    const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=side*Math.PI/2;root.add(g);
    block(m.frame,0,2.12,-.04,2.4,3.05,.24,g);
    block(m.stone,0,1.03,.33,2.55,.17,1.04,g);
    block(m.wall,0,3.54,.25,2.5,.1,.85,g);
    const mesh=put(new THREE.PlaneGeometry(2.18,.43),new THREE.MeshBasicMaterial({
      map:labelTexture(caption,"EXPLORE IN PORTFOLIO"),transparent:true,side:THREE.DoubleSide,depthWrite:false
    }),0,3.53,.35,g);
    mesh.castShadow=false;
  }
  if(kind==="build"){
    // Two complete workstations with product engineering tools, plus a stable server/storage showcase.
    monitor(-wing,-.25,Math.PI/2);
    monitor(wing,-.25,-Math.PI/2);
    for(let i=0;i<(low?2:4);i++){
      const z=-d+2+i*1.16;
      const rack=block(m.dark,-w+1.1,1.52,z,1.28,2.55,.91);
      colliders.push(rack);
      block(m.frame,-w+1.1,1.54,z+.465,1.05,2.27,.045);
      for(let j=0;j<5;j++){
        block(m.mint,-w+.78,2.45-j*.33,z+.49,.08,.07,.04);
        block(m.gold,-w+1.28,2.45-j*.33,z+.49,.42,.035,.04);
      }
    }
    const sys=new THREE.Group();sys.position.set(0,0,-d+1.55);root.add(sys);
    for(let i=0;i<5;i++){
      const x=(i-2)*.78,y=1.65+Math.sin(i*1.7)*.5;
      orb(i===2?m.gold:m.skyGlow,x,y,0,.24,sys);
      if(i) cable(m.mint,[[(i-3)*.78,1.65+Math.sin((i-1)*1.7)*.5,0],[(i-2.5)*.78,2.06,.16],[x,y,0]],.04,sys);
    }
    tag("BUILD","PRODUCTS + ENGINEERING",0,3.6,-d+1.15,4.5);
  }
  if(kind==="automate"){
    // Data travels between sensor, integration, agent and human communication stations.
    for(let i=0;i<4;i++){
      const x=i%2?-wing:wing,z=i<2?-1.9:2.2;
      const base=disc(m.frame,x,.53,z,.92,.98);colliders.push(base);
      const cap=disc(m.stone,x,1.08,z,.95,.1);
      for(let j=0;j<3;j++){
        const ring=put(new THREE.TorusGeometry(.56+j*.11,.035,7,36),j===2?m.gold:m.skyGlow,x,1.75+j*.25,z);
        ring.rotation.x=Math.PI/2.35;
      }
      orb(i%2?m.mint:m.gold,x,1.91,z,.34);
      tag(["DATA","WORKFLOW","AI AGENT","MESSAGE"][i],"",x,3.25,z-.22,2.7);
    }
    const core=orb(m.skyGlow,0,2.42,-d+2,.73);animated.push(core);
    const hoop=put(new THREE.TorusGeometry(1.3,.065,8,60),m.mint,0,2.4,-d+2);
    hoop.rotation.y=.26;
    for(const s of [-1,1])cable(m.skyGlow,[[s*wing,2.2,-1.9],[s*wing*.65,3.55,-d+4],[0,2.5,-d+2]],.047);
    tag("AUTOMATE","LLM • n8n • SYSTEMS",0,4.24,-d+2.2,4.5);
  }
  if(kind==="lead"){
    // The four vertical modules symbolize coordinated divisions, not fictional metrics.
    const board=block(m.dark,0,2.53,-d+.6,8.9,3.7,.23);
    board.castShadow=false;
    block(m.frame,0,2.53,-d+.41,8.45,3.31,.035);
    for(let i=0;i<4;i++){
      const x=(i-1.5)*2.02,z=-d+.36;
      block(i%2?m.mint:m.gold,x,2.65,z,.12,1.65,.06);
      block(m.wall,x,1.66,z,1.32,.12,.06);
      for(let j=0;j<3;j++)block(m.skyGlow,x,3.4-j*.25,z,.85,.035,.07);
    }
    tag("LEAD","DECISIONS → DELIVERY",0,4.55,-d+.25,4.5);
    for(const side of [-1,1]){
      const table=block(m.timber,side*wing,1.03,-1.4,2.8,.2,1.65);
      colliders.push(table);
      block(m.frame,side*wing,1.65,-1.54,1.75,.9,.12);
      block(m.skyGlow,side*wing,1.67,-1.46,1.59,.75,.03);
      const seat=disc(m.stone,side*wing,.48,1,.52,.2);
      seat.castShadow=false;
      disc(m.frame,side*wing,.29,1,.11,.48);
    }
  }
  if(kind==="recognition"){
    // Curated, indefinitely extensible exhibit bays (no one-object-per-certificate explosion).
    for(let i=0;i<(low?3:5);i++) {
      const x=(i-((low?3:5)-1)/2)*2.4;
      trophy(x,-d+1,i);
    }
    for(const side of [-1,1]){
      const x=side*wing;
      const caseFrame=block(m.frame,x,1.65,1.2,1.8,2.6,1.4);
      colliders.push(caseFrame);
      const caseGlass=block(m.glass,x,2,1.9,1.78,2.15,.05);caseGlass.castShadow=false;
      for(let i=0;i<3;i++){
        const book=block(i===1?m.gold:m.wall,x+(i-1)*.41,1.42,1.3,.24,.55,.88);
        book.rotation.z=(i-1)*.13;
      }
      tag(side===-1?"RESEARCH":"CERTIFIED","PUBLICATIONS · CREDENTIALS",x,3.45,1.88,3);
    }
    tag("RECOGNITION","AWARDS · RESEARCH · LEARNING",0,4.1,-d+.53,5);
  }
  if(kind==="origins"){
    const chapters=["OPERATIONS","ENGINEERING","PRODUCT","AI","LEADERSHIP"];
    for(let i=0;i<5;i++){
      const x=(i-2)*2.85,z=-d+2.1;
      const p=disc(m.frame,x,.55,z,.66,1.04);colliders.push(p);
      const stone=disc(m.stone,x,1.1,z,.67,.08);
      stone.castShadow=false;
      const relic=orb(i%2?m.gold:m.mint,x,1.62,z,.38);
      relic.rotation.z=i*.22;
      tag(chapters[i],"",x,2.95,z-.28,2.6);
    }
    // Timeline wall engraving motif.
    cable(m.gold,[[-6.4,1.42,-d+.4],[-3.2,1.65,-d+.38],[0,1.85,-d+.3],[3.2,2,-d+.38],[6.4,2.22,-d+.4]],.065);
    planter(-wing,1.7);planter(wing,1.7);
  }
  if(kind==="horizon"){
    // Telescope is grounded and aimed toward the ocean; casual seating around a clear center.
    const telescope=new THREE.Group();telescope.position.set(-wing+1.2,0,-1.1);root.add(telescope);
    disc(m.stone,0,.27,0,.74,.24,telescope);
    disc(m.frame,0,.74,0,.12,.78,telescope);
    const tubeBody=put(new THREE.CylinderGeometry(.29,.39,2.25,18),m.frame,0,1.47,0,telescope);
    tubeBody.rotation.x=Math.PI/2.55;
    put(new THREE.TorusGeometry(.33,.07,8,24),m.gold,0,2.31,-.85,telescope);
    block(m.timber,wing-1.4,.58,-1.7,2.75,.22,1.25);
    block(m.frame,wing-1.4,1.07,-2.32,2.75,1,.2);
    planter(-wing+1,2.7);planter(wing-1,2.7);
    tag("THE HORIZON","LET'S CONNECT",0,3.4,-d+.6,5);
  }
  return {colliders,animated};
}
