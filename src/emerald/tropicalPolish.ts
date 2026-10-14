import * as THREE from "three";
import type { Quality } from "./topology";

/**
 * Tropical eco-futuristic architectural and botanical art pass.
 * Entirely local, deterministic and self-contained: no paid assets or remote image dependencies.
 * It supplements (rather than substitutes for) the traversable environment and its colliders.
 */
export function installTropicalArt(root: THREE.Group, quality: Quality) {
  let seed = 79831;
  const rand = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
  const hi = quality === "high";
  const low = quality === "low";
  const shell = new THREE.MeshStandardMaterial({color:0xe8e3d2, roughness:0.84, metalness:0.04});
  const trim = new THREE.MeshStandardMaterial({color:0x315d50, roughness:0.31, metalness:0.59});
  const sand = new THREE.MeshStandardMaterial({color:0xe6d0a7, roughness:0.98});
  const glass = new THREE.MeshPhysicalMaterial({color:0x8cddd0, transparent:true, opacity:0.33, roughness:0.07, metalness:0.04, depthWrite:false, side:THREE.DoubleSide});
  const leaf = new THREE.MeshStandardMaterial({color:0x37815c, roughness:0.91, side:THREE.DoubleSide});
  const fern = new THREE.MeshStandardMaterial({color:0x538d62, roughness:0.93, side:THREE.DoubleSide});
  const bark = new THREE.MeshStandardMaterial({color:0x816a4e, roughness:0.98});
  const brass = new THREE.MeshStandardMaterial({color:0xc6a46d, roughness:0.3, metalness:0.75});
  const screen = new THREE.MeshStandardMaterial({color:0x1c5a58, emissive:0x1b8171, emissiveIntensity:0.3, metalness:0.18, roughness:0.26});
  function mesh(g:THREE.BufferGeometry,m:THREE.Material,p:THREE.Object3D,x=0,y=0,z=0){
    const o=new THREE.Mesh(g,m); o.position.set(x,y,z); o.castShadow=true; o.receiveShadow=true; p.add(o); return o;
  }
  function cube(p:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,w:number,h:number,d:number) {
    return mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z);
  }
  function column(p:THREE.Object3D,m:THREE.Material,x:number,z:number,h:number,r=0.11) {
    return mesh(new THREE.CylinderGeometry(r,r,h,9),m,p,x,h/2,z);
  }
  function tube(p:THREE.Object3D,m:THREE.Material,pts:THREE.Vector3[],radius=0.09){
    const curve=new THREE.CatmullRomCurve3(pts);
    return mesh(new THREE.TubeGeometry(curve,Math.max(12,pts.length*6),radius,6,false),m,p);
  }
  function dome(p:THREE.Object3D,x:number,z:number,w:number,d:number,h:number){
    // The arch is real structural geometry. Center opening on the visitor-facing +Z side.
    const frameCurve:THREE.Vector3[]=[];
    for(let k=0;k<=24;k++){
      const a=Math.PI-k*Math.PI/24;
      frameCurve.push(new THREE.Vector3(Math.cos(a)*w/2,h/2+Math.sin(a)*h/2,z+d/2));
    }
    tube(p,shell,frameCurve,0.24);
    for(const offset of [-d/2,0,d/2]){
      const ring:THREE.Vector3[]=[];
      for(let k=0;k<=24;k++){
        const a=Math.PI-k*Math.PI/24;
        ring.push(new THREE.Vector3(Math.cos(a)*w/2,h/2+Math.sin(a)*h/2,z+offset));
      }
      tube(p,trim,ring,0.09);
    }
    for(let k=0;k<=10;k++){
      const a=(k/10)*Math.PI;
      const x=Math.cos(a)*w/2;
      const y=h/2+Math.sin(a)*h/2;
      cube(p,trim,x,y,z,0.09,0.09,d);
    }
    // A thin transparent glazed ceiling with a physical surface rather than a flat billboard.
    const archG=new THREE.CylinderGeometry(w/2,w/2,d,40,1,true,0,Math.PI);
    archG.rotateX(Math.PI/2);
    const ar=mesh(archG,glass,p,0,h/2,z); ar.rotation.y=Math.PI/2;
  }
  function pavilion(x:number,z:number,yaw:number,tag:"AUTOMATE"|"LEAD",accent:THREE.Material){
    const p=new THREE.Group();
    p.position.set(x,1.16,z); p.rotation.y=yaw; root.add(p);
    mesh(new THREE.CylinderGeometry(6.9,7.4,0.45,40),shell,p,0,-0.22,0);
    mesh(new THREE.CylinderGeometry(6.55,6.7,0.16,40),sand,p,0,0.03,0);
    for(const side of [-1,1]){
      const x0=side*5.1;
      column(p,trim,x0,-3.6,5.15,0.16);
      column(p,trim,x0,3.6,5.15,0.16);
    }
    dome(p,0,0,11.5,8,6.7);
    // Curved glass wall, split to preserve a genuine clear entrance.
    for(let i=-6;i<=6;i++){
      const u=i/6,xx=u*5.4, zz=-3.7-0.7*(1-u*u);
      const back=mesh(new THREE.PlaneGeometry(0.81,3.6),glass,p,xx,2.05,zz);
      back.rotation.y=Math.atan2(u*1.3,1);
      if(Math.abs(i)>1){
        const front=mesh(new THREE.PlaneGeometry(0.81,3.4),glass,p,xx,2.1,3.68);
        front.rotation.y=-u*0.06;
      }
    }
    cube(p,trim,-2.4,2.12,3.78,0.08,4.23,0.1);
    cube(p,trim,2.4,2.12,3.78,0.08,4.23,0.1);
    // Clear front entry aligns with the open central floor and front-facing exhibits.
    cube(p,trim,0,0.21,3.6,3.2,0.06,0.6);
    const desk=mesh(new THREE.CylinderGeometry(1.75,2,0.34,32),shell,p,0,1.12,-0.3);
    desk.castShadow=true;
    mesh(new THREE.CylinderGeometry(0.86,0.94,0.88,24),trim,p,0,0.63,-0.3);
    mesh(new THREE.CylinderGeometry(1.35,1.35,0.04,32),accent,p,0,1.33,-0.3);
    const badge=mesh(new THREE.OctahedronGeometry(0.65,1),screen,p,0,2.4,-0.3);
    badge.rotation.z=0.25;
    for(let i=0;i<3;i++){
      const xx=(i-1)*3.2;
      const z0=-2.55;
      cube(p,trim,xx,1.52,z0,2.35,1.8,0.17);
      cube(p,screen,xx,1.54,z0+0.1,2.12,1.5,0.04);
      cube(p,brass,xx,0.43,z0,1.65,0.18,0.95);
    }
    for(const side of [-1,1]){
      column(p,trim,side*5.3,1.2,2.1,0.08);
      mesh(new THREE.SphereGeometry(0.19,12,8),brass,p,side*5.3,2.2,1.2);
    }
    // Functional entrance is intentionally unobstructed in the central two-meter lane.
    p.name=tag+"-open-air-pavilion";
    return p;
  }
  pavilion(-24,7,-0.24,"AUTOMATE",screen);
  pavilion(19,17,0.5,"LEAD",brass);
  // Architectural focal point in the south-facing plaza.
  const plaza=new THREE.Group(); plaza.position.set(0,1.02,-4); root.add(plaza);
  const monolith=mesh(new THREE.CylinderGeometry(1.25,1.65,1.2,8),shell,plaza,0,0.55,0);
  monolith.rotation.y=Math.PI/8;
  mesh(new THREE.TorusGeometry(2.9,0.12,9,64,Math.PI*1.8),brass,plaza,0,3.1,0).rotation.z=0.45;
  mesh(new THREE.IcosahedronGeometry(0.52,2),screen,plaza,0,3,0);
  // Coastal palm groves - curved trunks, distinctive crowns and individual fronds.
  const palms=low?9:hi?26:17;
  const frondInstances=new THREE.InstancedMesh(new THREE.ConeGeometry(0.14,0.75,3),leaf,2500);
  const frondTransform=new THREE.Object3D();
  let frondCount=0;
  const crown=new THREE.SphereGeometry(0.27,8,6);
  for(let i=0;i<palms;i++){
    const a=rand()*Math.PI*2,r=25+rand()*10;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;
    // Never dress over the main promenades, landing or facades.
    if(Math.abs(x+17)<9&&Math.abs(z+13)<8)continue;
    if(Math.abs(x-5)<9&&Math.abs(z+20)<8)continue;
    if(Math.abs(x-27)<8&&Math.abs(z)<8)continue;
    const height=4.2+rand()*3.3, lean=(rand()-0.5)*1.9;
    const branch=new THREE.Group();branch.position.set(x,0.8,z);root.add(branch);
    tube(branch,bark,[
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(lean*.32,height*.46,0.15),
      new THREE.Vector3(lean,height,-0.3)
    ],0.16);
    mesh(crown,bark,branch,lean,height, -0.3);
    const n=low?5:hi?9:7;
    for(let j=0;j<n;j++){
      const angle=j/n*Math.PI*2,ext=2.25+rand()*1.1;
      const forward=new THREE.Vector3(Math.cos(angle),0,Math.sin(angle));
      const tip=new THREE.Vector3(lean+forward.x*ext,height-1.05+rand()*.2,-0.3+forward.z*ext);
      const mid=new THREE.Vector3(lean+forward.x*ext*.55,height+.52,-0.3+forward.z*ext*.55);
      tube(branch,fern,[new THREE.Vector3(lean,height,-0.3),mid,tip],0.055);
      for(let k=2;k<=4;k++){
        const t=k/6;
        const center=new THREE.Vector3(lean+forward.x*ext*t,height+(0.52*Math.sin(t*Math.PI)) -t*t*1.05,-0.3+forward.z*ext*t);
        const f=new THREE.Vector3(-forward.z,0,forward.x);
        for(const s of [-1,1]){
          frondTransform.position.set(x+center.x+f.x*s*.28,0.8+center.y-.12,z+center.z+f.z*s*.28);
          frondTransform.rotation.set(0,angle+(s<0?Math.PI:0),Math.PI/2);
          frondTransform.scale.set(1,1-t*.6,1);
          frondTransform.updateMatrix();
          if(frondCount<2500)frondInstances.setMatrixAt(frondCount++,frondTransform.matrix);
        }
      }
    }
  }
  frondInstances.count=frondCount;
  frondInstances.instanceMatrix.needsUpdate=true;
  frondInstances.castShadow=hi;
  root.add(frondInstances);
  // Limestone boulders, contrasting coastal gravel, and tiny dune planting.
  for(let i=0;i<(low?36:hi?165:95);i++){
    const a=rand()*Math.PI*2,r=34+rand()*10;
    const rock=mesh(new THREE.IcosahedronGeometry(0.55+rand()*1.1,0),i%5===0?sand:shell,root,Math.cos(a)*r,-0.32,Math.sin(a)*r);
    rock.scale.set(1.2+rand(),0.45+rand()*.8,0.8+rand());
    rock.rotation.set(rand(),rand()*Math.PI,rand());
  }
  return {palmCount:palms};
}
