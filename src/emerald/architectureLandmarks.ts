import * as THREE from "three";
import type {Quality} from "./topology";
import type {ZoneKind, ZonePalette} from "./zoneDressing";

/** Hand-authored landmark silhouettes: no false doors, floating props or paid assets.
 * Decorative geometry lives outside the 3.2m public circulation corridor.
 * Room-local +Z = main approach, -Z = secondary departure.
 */
export function decorateArchitecture(root:THREE.Group,kind:ZoneKind,width:number,depth:number,quality:Quality,m:ZonePalette){
  const w=width/2,d=depth/2,high=quality==="high",low=quality==="low";
  function mesh(geo:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number) {
    const part=new THREE.Mesh(geo,material);part.position.set(x,y,z);
    part.receiveShadow=true;part.castShadow=true;root.add(part);return part;
  }
  function block(mat:THREE.Material,x:number,y:number,z:number,a:number,b:number,c:number){
    return mesh(new THREE.BoxGeometry(a,b,c),mat,x,y,z);
  }
  function torus(mat:THREE.Material,x:number,y:number,z:number,r:number,tube=.1){
    return mesh(new THREE.TorusGeometry(r,tube,9,64),mat,x,y,z);
  }
  function curve(mat:THREE.Material,points:THREE.Vector3[],radius=.08){
    const path=new THREE.CatmullRomCurve3(points);
    return mesh(new THREE.TubeGeometry(path,64,radius,8,false),mat,0,0,0);
  }
  function crest(x:number,y:number,z:number){
    const base=mesh(new THREE.CylinderGeometry(.46,.53,.34,14),m.stone,x,y,z);
    base.castShadow=false;
    const tree=mesh(new THREE.ConeGeometry(.61,1.13,8),m.leaf,x,y+.78,z);
    tree.rotation.z=.05;return tree;
  }
  function roofGarden(side:number,length:number,y:number){
    // Supported planter slab and visible soil: planting is not floating over glazing.
    const x=side*(w-.7);
    block(m.stone,x,y,0,1.28,.23,length);
    for(const z of [-length*.42,length*.42])block(m.frame,x,y/2,z,.2,y-.12,.23);
    block(m.frame,x,y+.16,0,1.08,.12,length-.18);
    const count=low?3:high?8:5;
    for(let i=0;i<count;i++){
      const z=-length/2+.9+(length-1.8)*(i/(Math.max(1,count-1)));
      crest(x,y+.34,z);
    }
  }
  function exteriorLight(x:number,y:number,z:number){
    block(m.frame,x,y,z,.44,.83,.29);
    const lens=block(m.gold,x,y+.03,z+.17,.32,.56,.035);
    lens.castShadow=false;
  }
  if(kind==="build"){
    // A statement entrance: a real arch around the central 3.2m passage.
    const outline:THREE.Vector3[]=[];
    for(let i=0;i<=24;i++){
      const t=i/24*Math.PI;
      outline.push(new THREE.Vector3(-2.15*Math.cos(t),3.8+1.8*Math.sin(t),d+.45));
    }
    curve(m.stone,outline,.29);
    const inner:THREE.Vector3[]=outline.map(p=>p.clone().add(new THREE.Vector3(0,0,.23)));
    curve(m.gold,inner,.045);
    roofGarden(-1,depth*.6,4.62);
    roofGarden(1,depth*.6,4.62);
    // Floor-to-ceiling side bracing echoes limestone-clad natural rock.
    for(const side of [-1,1]){
      for(let i=0;i<4;i++){
        const z=-d+1.4+i*((depth-2.8)/3);
        const pier=block(m.stone,side*(w+.08),1.08,z,.52,2.1,.55);
        pier.rotation.z=side*.15;
      }
    }
    // Layered perforated sunshades above glass, clear of entrances.
    for(let k=0;k<7;k++){
      const x=(k-3)*(width-5)/7;
      const fin=block(m.frame,x,5.78,d-.5,.09,.74,1.7);
      fin.rotation.x=-.1;
    }
  }
  if(kind==="automate"){
    // Paired enclosed structural feature towers; access remains via central doors.
    for(const side of [-1,1]){
      const x=side*(w-1.85),z=-d+2.6;
      mesh(new THREE.CylinderGeometry(1.08,1.22,3.95,24,1,true),m.glass,x,2.17,z);
      mesh(new THREE.CylinderGeometry(1.24,1.24,.17,24),m.stone,x,.13,z);
      for(const y of [.45,1.9,3.32,4.2])
        mesh(new THREE.TorusGeometry(1.14,.075,8,40),m.frame,x,y,z).rotation.x=Math.PI/2;
      const antenna=mesh(new THREE.CylinderGeometry(.08,.1,1.52,10),m.frame,x,5.04,z);
      antenna.castShadow=false;
      mesh(new THREE.OctahedronGeometry(.27),m.gold,x,5.9,z);
    }
    // Visible connection over the circulation rather than on the floor.
    curve(m.skyGlow,[
      new THREE.Vector3(-w+1.85,4.7,-d+2.6),
      new THREE.Vector3(0,6.5,-d+2.6),
      new THREE.Vector3(w-1.85,4.7,-d+2.6)
    ],.075);
    for(let i=0;i<5;i++){
      const z=-d+.85+i*(depth-1.7)/4;
      block(m.frame,-w-.1,4.4,z,.38,.12,1.1);
      block(m.frame,w+.1,4.4,z,.38,.12,1.1);
    }
  }
  if(kind==="lead"){
    // Strong axial entrance, balanced strategy wings, legible roof rhythm.
    for(const side of [-1,1]){
      const x=side*(w-.8);
      block(m.stone,x,2.3,d+.5,1.65,4.55,1.25);
      exteriorLight(x,2.42,d+.9);
    }
    for(let i=0;i<10;i++){
      const x=-w+1.25+i*(width-2.5)/9;
      const rib=block(m.frame,x,5.8,-1.05,.095,.82,depth*.68);
      rib.rotation.x=.12;
    }
    const crestRing=torus(m.gold,0,5.88,d+.65,1.24,.11);
    crestRing.rotation.y=Math.PI/4;
    // The overhang is supported by the two front portal piers.
    const canopy=block(m.stone,0,4.7,d+.2,6.3,.28,1.9);
    canopy.rotation.x=.025;
  }
  if(kind==="recognition"){
    // A restrained medal-like oculus atop the transparent canopy.
    const iris=torus(m.gold,0,6.1,0,2.15,.12);
    iris.rotation.x=Math.PI/2;
    torus(m.frame,0,6.12,0,2.5,.14).rotation.x=Math.PI/2;
    for(const support of [-1,1])block(m.frame,support*2.12,5.73,0,.12,.86,.13);
    for(const side of [-1,1]){
      for(let k=0;k<3;k++){
        const z=-d+1.4+(k+1)*depth/4;
        const b=block(m.stone,side*(w-.7),.5,z,1.3,.9,.95);
        b.castShadow=false;
        const geo=new THREE.IcosahedronGeometry(.48,1);
        mesh(geo,k===1?m.gold:m.skyGlow,side*(w-.7),1.43,z);
      }
    }
  }
  if(kind==="origins"){
    // The chronology terrace is a covered, open colonnade, not a false enclosed room.
    for(const side of [-1,1]){
      for(let i=0;i<5;i++){
        const z=-d+1.1+i*(depth-2.2)/4;
        const post=block(m.frame,side*(w-.36),2.2,z,.22,4.4,.26);
        post.castShadow=true;
        exteriorLight(side*(w-.4),2.62,z);
      }
      block(m.stone,side*(w-.31),4.42,0,.58,.28,depth+.65);
      if(!low)roofGarden(side,depth*.45,4.45);
    }
    // Small ornamental finials articulate the rhythm without blocking the circulation.
    for(let i=-3;i<=3;i++){
      const x=i*width/8;
      const beam=block(m.frame,x,4.36,0,.08,.19,depth);
      beam.castShadow=false;
    }
  }
  if(kind==="horizon"){
    // The ocean deck stays truly open; seating and stargazing are accessible.
    for(const side of [-1,1]){
      block(m.frame,side*(w-.35),3.4,-.1,.24,6.8,.28);
      block(m.stone,side*(w-.35),6.8,-.1,.47,.21,depth*.68);
    }
    for(let i=0;i<7;i++){
      const z=-d+1.2+i*(depth-2.4)/6;
      const beam=block(m.frame,0,6.65,z,width-.8,.12,.2);
      beam.castShadow=false;
    }
    torus(m.gold,0,5.7,-d+1.4,1.1,.09);
    for(const side of [-1,1]){
      const x=side*(w-.35);
      for(let k=0;k<5;k++)crest(x,.29,-d+1+k*(depth-2)/4);
    }
  }
}
