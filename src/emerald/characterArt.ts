import * as THREE from "three";
import type {Quality} from "./topology";

/** Emm — bespoke stylized explorer: layered utility jacket, shoes, textile
 * seams, expedition backpack, warm expressive face and navigational device.
 * Geometries are genuine 3D surfaces, not billboard character sprites.
 * The silhouette is original and is not a facial likeness of the portfolio owner.
 */
export function polishEmm(character:THREE.Group,limbs:THREE.Group[],quality:Quality) {
  const low=quality==="low",high=quality==="high";
  const jacket=new THREE.MeshStandardMaterial({color:0x286c57,roughness:.73,metalness:.04});
  const cuff=new THREE.MeshStandardMaterial({color:0x133f39,roughness:.81});
  const cream=new THREE.MeshStandardMaterial({color:0xece2c9,roughness:.91});
  const fabric=new THREE.MeshStandardMaterial({color:0x435454,roughness:.85});
  const copper=new THREE.MeshStandardMaterial({color:0xe3ad66,metalness:.42,roughness:.4});
  const skin=new THREE.MeshStandardMaterial({color:0xc79676,roughness:.92});
  const hair=new THREE.MeshStandardMaterial({color:0x202d2a,roughness:.93});
  const backpack=new THREE.MeshStandardMaterial({color:0x163d39,roughness:.84});
  const emissive=new THREE.MeshStandardMaterial({color:0xa4efcf,emissive:0x44c8a7,emissiveIntensity:.42,roughness:.35});
  function put(parent:THREE.Object3D,geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number){
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function box(parent:THREE.Object3D,mat:THREE.Material,x:number,y:number,z:number,a:number,b:number,c:number){
    return put(parent,new THREE.BoxGeometry(a,b,c),mat,x,y,z);
  }
  function sphere(parent:THREE.Object3D,mat:THREE.Material,x:number,y:number,z:number,r:number){
    return put(parent,new THREE.SphereGeometry(r,low?10:high?22:16,low?8:12),mat,x,y,z);
  }
  // Soft shoulder lines and layered collar separate the jacket from the head.
  const chest=put(character,new THREE.CapsuleGeometry(.285,.47,8,12),jacket,0,1.17,0);
  chest.scale.set(1.04,1.02,.96);
  put(character,new THREE.TorusGeometry(.19,.056,7,20,Math.PI),cream,0,1.46,.15).rotation.x=.28;
  box(character,copper,.015,1.12,.3,.035,.52,.014);
  box(character,cream,-.13,1.3,.29,.12,.06,.025);
  box(character,cuff,.14,1.02,.3,.11,.16,.025);
  box(character,emissive,.14,1.045,.316,.066,.045,.008);
  // Shoulder pads, cuff folds and straps sit directly on the articulated arms.
  for(const [i,arm] of [limbs[1],limbs[3]].entries()) {
    const side=i===0?-1:1;
    sphere(arm,jacket,0,-.04,0,.147).scale.set(1,.87,.96);
    put(arm,new THREE.CylinderGeometry(.12,.13,.085,12),cuff,0,-.38,0);
    if(!low)box(arm,cream,side*.071,-.12,.098,.035,.18,.014);
  }
  // Technical pack and harness: silhouette recognizable even from the follow camera.
  const shell=box(character,backpack,0,1.11,-.355,.53,.71,.3);
  shell.rotation.x=-.06;
  box(character,cream,0,.83,-.514,.33,.13,.035);
  box(character,copper,0,1.46,-.515,.29,.08,.035);
  for(const side of [-1,1]){
    box(character,cuff,side*.3,1.24,-.17,.08,.5,.1).rotation.z=side*.19;
    box(character,copper,side*.21,1.07,-.517,.075,.13,.04);
  }
  // Individually segmented boots move with the rigged leg groups.
  for(const leg of [limbs[0],limbs[2]]) {
    put(leg,new THREE.CylinderGeometry(.128,.132,.24,12),fabric,0,-.53,0);
    const boot=put(leg,new THREE.CapsuleGeometry(.13,.19,6,12),cuff,0,-.72,.055);
    boot.rotation.x=Math.PI/2;
    box(leg,cream,0,-.79,.09,.3,.055,.42);
    box(leg,copper,0,-.56,.175,.14,.025,.02);
  }
  // Clear, original expression; eye highlights retain readability at close camera.
  for(const side of [-1,1]){
    const eye=sphere(character,hair,side*.083,1.78,.222,.032);
    eye.scale.set(1,1.11,.6);
    if(!low)sphere(character,cream,side*.091,1.795,.245,.011);
    // Eyebrows tilt gently toward the outer edge.
    const brow=box(character,hair,side*.083,1.835,.225,.092,.025,.018);
    brow.rotation.z=-side*.08;
    sphere(character,skin,side*.23,1.75,.01,.054);
  }
  sphere(character,skin,0,1.728,.252,.044).scale.set(.8,1.25,.8);
  put(character,new THREE.TorusGeometry(.056,.009,5,12,Math.PI*.8),hair,0,1.673,.247).rotation.z=Math.PI*1.15;
  // Sculpted hair tufts avoid the monotonous dome of the old avatar.
  for(let i=0;i<(low?3:6);i++){
    const x=(i-(low?2:5)/2)*.08;
    const tuft=put(character,new THREE.ConeGeometry(.075,.22,5),hair,x,1.972,.11);
    tuft.rotation.z=.25+Math.sin(i*2.1)*.27;
    tuft.rotation.x=.4;
  }
  // Navigator watch on the left wrist, a subtle and functional emblem.
  const wrist=limbs[1];
  put(wrist,new THREE.CylinderGeometry(.125,.125,.085,10),cuff,0,-.38,0);
  box(wrist,emissive,0,-.37,.126,.14,.055,.015);
  return {profile:"Emm — expedition explorer",rig:"articulated joints; local authored character art"};
}
