import * as THREE from "three";
import {Sky} from "three/addons/objects/Sky.js";
import {Water} from "three/addons/objects/Water.js";
import {nodes,edges,places,heights,presets,platformRadius,groundHeight,PATH_WIDTH,isWalkable,type Quality} from "./topology";
import {surface,waterNormal,labelTexture,random} from "./materials";
import { dressZone, type ZoneKind } from "./zoneDressing";
import { decorateArchitecture } from "./architectureLandmarks";
import { polishEmm } from "./characterArt";

export interface Environment {
 root:THREE.Group;water:Water|THREE.Mesh;beacons:THREE.Group[];
 character:THREE.Group;limbs:THREE.Group[];boat:THREE.Group;
 lights:THREE.MeshStandardMaterial[];animated:THREE.Object3D[];
 reflectionTargets:THREE.WebGLRenderTarget[];sky:Sky;sunlight:THREE.DirectionalLight;
 cameraColliders:THREE.Object3D[];playerColliders:THREE.Object3D[];
}
export function createEnvironment(scene:THREE.Scene,renderer:THREE.WebGLRenderer,quality:Quality):Environment{
 const root=new THREE.Group(); scene.add(root);root.name="Emerald Bay — immersive playable archipelago";
 const budget=presets[quality],rng=random();
 const reflectionTargets:THREE.WebGLRenderTarget[]=[],lights:THREE.MeshStandardMaterial[]=[],
 animated:THREE.Object3D[]=[],cameraColliders:THREE.Object3D[]=[],playerColliders:THREE.Object3D[]=[];
 const stone=new THREE.MeshStandardMaterial({color:0xd7d5c4,map:surface(budget.texture,"stone"),roughness:.92});
 const cliff=new THREE.MeshStandardMaterial({color:0x919f8b,roughness:1});
 const sand=new THREE.MeshStandardMaterial({color:0xe7d4b0,roughness:1});
 const grass=new THREE.MeshStandardMaterial({color:0x478b5a,map:surface(budget.texture,"grass"),roughness:.98});
 const frame=new THREE.MeshStandardMaterial({color:0x254b42,roughness:.35,metalness:.63});
 const timber=new THREE.MeshStandardMaterial({color:0xb39266,map:surface(budget.texture,"wood"),roughness:.64});
 const glass=new THREE.MeshPhysicalMaterial({color:0x9cddd8,roughness:.08,metalness:.04,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false});
 const wall=new THREE.MeshStandardMaterial({color:0xece7d7,metalness:.02,roughness:.8});
 const dark=new THREE.MeshStandardMaterial({color:0x123c3b,roughness:.33,metalness:.52});
 const leaf=new THREE.MeshStandardMaterial({color:0x287b4f,side:THREE.DoubleSide,roughness:1});
 const reed=new THREE.MeshStandardMaterial({color:0x7a9870,side:THREE.DoubleSide,roughness:1});
 const gold=new THREE.MeshStandardMaterial({color:0xd2b379,metalness:.6,roughness:.36});
 function emissive(color:number){const m=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.75,roughness:.24});lights.push(m);return m;}
 const mint=emissive(0x66dcb8),skyGlow=emissive(0x6bd0d5);
 function mesh(g:THREE.BufferGeometry,m:THREE.Material,p:THREE.Object3D,x=0,y=0,z=0,shadow=true){
  const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;p.add(o);return o;
 }
 function box(p:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,w:number,h:number,d:number){
  return mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z);
 }
 function cylinder(p:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,r:number,h:number,r2=r,sides=20){
  return mesh(new THREE.CylinderGeometry(r,r2,h,sides),m,p,x,y,z);
 }
 function tube(p:THREE.Object3D,m:THREE.Material,points:THREE.Vector3[],r=.1,div=36){
  return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),div,r,7,false),m,p);
 }
 function billboard(p:THREE.Object3D,text:string,caption:string,x:number,y:number,z:number,w=5){
  const m=new THREE.MeshBasicMaterial({map:labelTexture(text,caption),transparent:true,side:THREE.DoubleSide,depthWrite:false});
  return mesh(new THREE.PlaneGeometry(w,w/4),m,p,x,y,z,false);
 }
 // Morphologically coherent island — mesh geometry, not a background image.
 const outline:[number,number][]=[[-66,-42],[-72,-28],[-66,-5],[-69,15],[-63,35],[-46,48],[-22,57],[0,62],[28,55],[51,41],[64,17],[70,-11],[63,-32],[50,-46],[28,-50],[8,-47],[-13,-48],[-39,-46]];
 const poly=new THREE.Shape();
 outline.forEach(([x,z],i)=>i?poly.lineTo(x,z):poly.moveTo(x,z));poly.closePath();
 const base=new THREE.ExtrudeGeometry(poly,{depth:5,bevelEnabled:true,bevelSegments:2,bevelSize:1.4,bevelThickness:.8,curveSegments:12});
 base.rotateX(Math.PI/2);mesh(base,cliff,root,0,-.05,0);
 // A graded mesh of hills and planting substrates follows the land polygon.
 function contained(x:number,z:number) {
  let within=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){
   const [ax,az]=outline[i],[bx,bz]=outline[j];
   if(((az>z)!==(bz>z))&&(x<(bx-ax)*(z-az)/(bz-az)+ax))within=!within;
  }return within;
 }
 function hillside(x:number,z:number) {
  const ridge=7.8*Math.exp(-((x/62)**2+((z-32)/31)**2));
  const west=3*Math.exp(-(((x+36)/30)**2+((z-6)/37)**2));
  const east=3.6*Math.exp(-(((x-33)/32)**2+((z-5)/42)**2));
  const shore=.75+Math.max(0,ridge+west+east);
  const micro=.23*Math.sin(x*.13)*Math.cos(z*.11)+.16*Math.sin(z*.19+x*.07);
  return shore+micro;
 }
 const pts:number[]=[],indices:number[]=[],cell=2.5,X=62,Z=55;
 // Keep exterior cells hidden; procedural edges are covered by the cliff base below.
 for(let j=0;j<=Math.ceil(120/cell);j++)for(let i=0;i<=Math.ceil(150/cell);i++){
  const x=-75+i*cell,z=-55+j*cell;pts.push(x,hillside(x,z),z);
 }
 const nx=Math.ceil(150/cell)+1,nz=Math.ceil(120/cell)+1;
 for(let j=0;j<nz-1;j++)for(let i=0;i<nx-1;i++){
  const a=j*nx+i,b=a+1,c=a+nx,d=c+1;
  const cx=-75+(i+.5)*cell,cz=-55+(j+.5)*cell;
  if(contained(cx,cz))indices.push(a,c,b,b,c,d);
 }
 const terrainG=new THREE.BufferGeometry();
 terrainG.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));terrainG.setIndex(indices);
 terrainG.computeVertexNormals();
 mesh(terrainG,grass,root);
 // Sand/stone beach bands and limestone ledges create geological depth.
 for(let i=0;i<outline.length;i++){
  const [x,z]=outline[i],next=outline[(i+1)%outline.length];
  const l=Math.hypot(next[0]-x,next[1]-z),count=Math.ceil(l/5);
  for(let k=0;k<count;k++){
   const t=(k+.5)/count,px=x+(next[0]-x)*t,pz=z+(next[1]-z)*t;
   const rock=mesh(new THREE.IcosahedronGeometry(.7+rng()*1.25,quality==="high"?1:0),i%3?sand:stone,root,px,.24+rng()*.6,pz);
   rock.rotation.set(rng(),rng()*3,rng());rock.scale.set(1.5+rng(),.45+rng()*.6,.9+rng());
  }
 }
 // True animated water, sky/IBL, and daytime sunlight.
 let water:Water|THREE.Mesh;
 if(budget.reflection){
  water=new Water(new THREE.PlaneGeometry(1200,1200),{
   textureWidth:budget.reflection,textureHeight:budget.reflection,waterNormals:waterNormal(),
   sunDirection:new THREE.Vector3(-.35,.8,-.4),sunColor:0xfff8e2,waterColor:0x1a9d9f,distortionScale:2.2,fog:true});
 }else{
  water=mesh(new THREE.PlaneGeometry(1200,1200),new THREE.MeshStandardMaterial({color:0x2ba9ae,roughness:.26,metalness:.4,normalMap:waterNormal(),transparent:true,opacity:.92}),root);
 }
 water.rotation.x=-Math.PI/2;water.position.y=-.7;if(!water.parent)root.add(water);
 const sky=new Sky();sky.scale.setScalar(1100);
 sky.material.uniforms.turbidity.value=3.5;
 sky.material.uniforms.rayleigh.value=1.25;
 sky.material.uniforms.mieCoefficient.value=.003;
 sky.material.uniforms.mieDirectionalG.value=.85;
 sky.material.uniforms.sunPosition.value.set(-.4,.92,-.6);
 root.add(sky);
 const pmrem=new THREE.PMREMGenerator(renderer),envScene=new THREE.Scene();
 envScene.add(sky.clone());const target=pmrem.fromScene(envScene,.04,.1,1100);
 scene.environment=target.texture;reflectionTargets.push(target);pmrem.dispose();
 const hemi=new THREE.HemisphereLight(0xd9f9f1,0x46694f,2.4);root.add(hemi);
 const sunlight=new THREE.DirectionalLight(0xfff6db,3.6);
 sunlight.position.set(-80,110,-85);sunlight.castShadow=!!budget.shadow;
 sunlight.shadow.mapSize.set(budget.shadow||512,budget.shadow||512);
 sunlight.shadow.camera.left=-100;sunlight.shadow.camera.right=100;
 sunlight.shadow.camera.top=100;sunlight.shadow.camera.bottom=-100;
 sunlight.shadow.camera.near=1;sunlight.shadow.camera.far=300;sunlight.shadow.normalBias=.075;
 root.add(sunlight);
 // Functional paths: precise width, accessible gradients, ground collision contract.
 edges.forEach(([a,b],i)=>{
  const [ax,az]=nodes[a],[bx,bz]=nodes[b],len=Math.hypot(bx-ax,bz-az);
  const g=new THREE.Group();
  g.position.set((ax+bx)/2,(heights[a]+heights[b])/2-.08,(az+bz)/2);
  g.rotation.y=Math.atan2(bx-ax,bz-az);root.add(g);
  const deck=box(g,i%4===0?timber:stone,0,0,0,PATH_WIDTH,.25,len+.55);
  deck.rotation.x=-Math.atan2(heights[b]-heights[a],len); deck.castShadow=false;
  for(const side of [-1,1]){
   // Low rails, recessed under stepping surface rather than fluorescent sidewalks.
   box(g,frame,side*(PATH_WIDTH/2-.18),.07,0,.09,.12,len);
  }
  const n=Math.floor(len/6);
  for(let j=0;j<=n;j++){
   const t=n?j/n:.5,x=ax+(bx-ax)*t,z=az+(bz-az)*t,y=heights[a]+(heights[b]-heights[a])*t;
   cylinder(root,cliff,x,Math.max(-.5,(y-.5)/2),z,.27,Math.max(.6,y+.5),.39,8);
  }
 });
 // Stable circular plaza floors/room foundations.
 nodes.forEach(([x,z],i)=>{
  const radius=platformRadius(i),large=radius>=7;
  if(!large)return;
  cylinder(root,i===0||i===14?timber:stone,x,heights[i]-.13,z,radius,.28,radius,48);
  const edge=mesh(new THREE.TorusGeometry(radius-.18,.08,7,80),frame,root,x,heights[i]+.06,z,false);
  edge.rotation.x=Math.PI/2;
 });
 // Island centerpiece: sculptural horizon gateway with three balanced rings.
 const hub=new THREE.Group();hub.position.set(0,heights[20],0);root.add(hub);
 cylinder(hub,stone,0,.34,0,3.1,.7,3.25,48);
 for(let j=0;j<3;j++){
  const a=(j-1)*.34;
  const tor=mesh(new THREE.TorusGeometry(3.2+j*.16,.12,9,72,Math.PI*1.6),j===1?gold:frame,hub,0,4.15,0);
  tor.rotation.set(0,a,j*.25);
 }
 const core=mesh(new THREE.IcosahedronGeometry(.66,2),mint,hub,0,4.1,0);animated.push(core);
 // Open pavilion architecture. Every glazed wall has a true center cutout aligned with a path.
 function pavilion(node:number,width:number,depth:number,title:string,subtitle:string,kind:ZoneKind){
  const [x,z]=nodes[node],h=heights[node],g=new THREE.Group();
  g.position.set(x,h+.1,z);
  const approach=kind==="build"?nodes[5]:kind==="automate"?nodes[18]:kind==="lead"?nodes[19]:kind==="recognition"?nodes[11]:kind==="origins"?nodes[3]:nodes[13];
  g.rotation.y=Math.atan2(approach[0]-x,approach[1]-z);
  root.add(g);g.name=title;
  const w=width/2,d=depth/2;
  box(g,stone,0,-.16,0,width+.8,.32,depth+.8);
  const floor=box(g,timber,0,.06,0,width,.09,depth);
  floor.receiveShadow=true;floor.castShadow=false;
  if(kind==="horizon"){
   for(const side of [-1,1]){box(g,frame,side*(w-.24),1.15,0,.12,1.6,depth);}
   billboard(g,"THE HORIZON","LET'S MAKE SOMETHING MEANINGFUL",0,2.4,-d+.5,9);
   for(const ix of [-1,1]) {
    box(g,timber,ix*2,.75,0,2.5,.17,1.5);
    box(g,frame,ix*2,.43,0,.16,.75,1.2);
   }
  const palette={stone,frame,timber,glass,wall,dark,mint,skyGlow,gold,leaf};
  decorateArchitecture(g,kind,width,depth,quality,palette);
  const dressed=dressZone(g,kind,width,depth,quality,palette);
  playerColliders.push(...dressed.colliders);
  animated.push(...dressed.animated);
   return;
  }
  if(kind==="origins"){
   for(const side of [-1,1]) {
    box(g,frame,side*(w-.3),2,0,.16,4.1,.2);
    box(g,frame,side*(w-.3),4,0,.2,.18,depth);
   }
   billboard(g,"ORIGINS","UNDERSTAND • DESIGN • CREATE",0,3.3,-d+.12,9);
   for(let i=0;i<5;i++){
    const xx=(i-2)*3.1;
    box(g,stone,xx,.65,-2,2.3,.4,1.1);
    const plinth=cylinder(g,frame,xx,1.3,-2,.22,1.0,.22);
    plinth.castShadow=true;
   }
  const palette={stone,frame,timber,glass,wall,dark,mint,skyGlow,gold,leaf};
  decorateArchitecture(g,kind,width,depth,quality,palette);
  const dressed=dressZone(g,kind,width,depth,quality,palette);
  playerColliders.push(...dressed.colliders);
  animated.push(...dressed.animated);
   return;
  }
  const tall=kind==="lead"?7.5:6.1;
  const nRoof=21;
  for(const offset of [-d+.2,0,d-.2]){
   const pts:THREE.Vector3[]=[];
   for(let i=0;i<=nRoof;i++){
    const u=i/nRoof*Math.PI;
    pts.push(new THREE.Vector3(-w*Math.cos(u),2+tall*.55*Math.sin(u),offset));
   }
   tube(g,offset===0?frame:wall,pts,offset===0?.12:.23,42);
  }
  // Continuous curved glass canopy under its real structural arch.
  const roofCoordinates:number[]=[],roofIndices:number[]=[];
  for(let i=0;i<=nRoof;i++){
   const u=i/nRoof*Math.PI,x=-w*Math.cos(u),y=2+tall*.55*Math.sin(u);
   roofCoordinates.push(x,y,-d+.26,x,y,d-.26);
   if(i<nRoof){const n=i*2;roofIndices.push(n,n+1,n+2,n+1,n+3,n+2);}
  }
  const roofGeometry=new THREE.BufferGeometry();
  roofGeometry.setAttribute("position",new THREE.Float32BufferAttribute(roofCoordinates,3));
  roofGeometry.setIndex(roofIndices);
  roofGeometry.computeVertexNormals();
  const canopy=mesh(roofGeometry,glass,g);canopy.castShadow=false;
  // Semi-open structural ribs, roof fins, and floor-to-ceiling glass.
  for(let i=0;i<=12;i++){
   const v=i/12,xx=-w+v*width,yy=2+tall*.55*Math.sqrt(Math.max(0,1-(xx/w)**2));
   box(g,frame,xx,yy,-.2,.11,.1,depth);
  }
  for(const side of [-1,1]){
   const sx=side*(w-.25);
   box(g,frame,sx,2.4,0,.17,4.5,depth);
   const pane=box(g,glass,sx,2.25,0,.06,4.3,depth-.35);pane.castShadow=false;
   playerColliders.push(pane);cameraColliders.push(pane);
  }
  // Rear transparent facade; front has a true 3m clear entrance, not a decorative sign.
  // Paired real front/rear passages support the main ring from either direction.
  const rearOpening=(width-3.2)/2;
  for(const side of [-1,1]){
   const xx=side*(1.6+rearOpening/2);
   const rear=box(g,glass,xx,2.25,-d+.16,rearOpening-.22,4.3,.07);
   rear.castShadow=false;playerColliders.push(rear);cameraColliders.push(rear);
  }
  const sideWidth=(width-3.2)/2;
  for(const side of [-1,1]){
   const xx=side*(1.6+sideWidth/2);
   const front=box(g,glass,xx,2.25,d-.16,sideWidth-.22,4.3,.07);
   front.castShadow=false;playerColliders.push(front);cameraColliders.push(front);
   box(g,frame,side*1.6,2.27,d-.18,.13,4.4,.11);
  }
  box(g,frame,0,4.54,d-.19,3.3,.16,.2);
  const sign=billboard(g,title,subtitle,0,5.15,d+.21,Math.min(width-2,11));
  sign.castShadow=false;
  // A readable centerpiece + context-aware exhibits, no raw placeholder cubes.
  const table=cylinder(g,stone,0,.96,-3.1,1.65,.21,1.75,40);
  cylinder(g,frame,0,.46,-3.1,.6,.85,.65,24);
  const artifact=mesh(kind==="recognition"?new THREE.TorusGeometry(.78,.17,10,32):new THREE.IcosahedronGeometry(.77,2),kind==="recognition"?gold:mint,g,0,2.08,-3.1);
  playerColliders.push(table);
  artifact.rotation.x=.24;animated.push(artifact);
  // Showcase alcoves on rear wall.
  for(let k=0;k<3;k++){
   const px=(k-1)*(width/4);
   box(g,frame,px,2.12,-d+.68,width/4.8,2.4,.28);
   box(g,skyGlow,px,2.12,-d+.48,width/5,2,.045);
   box(g,stone,px,1.03,-d+.16,2.7,.17,1.13);
  }
  for(const side of [-1,1]){
   cylinder(g,stone,side*(w-1.1),.56,d-1,.52,1.05,.58,12);
   cylinder(g,grass,side*(w-1.1),1.23,d-1,.66,.65,.32,9);
  }
  // Detailed storytelling elements remain subordinate to entrances and central navigation.
  const palette={stone,frame,timber,glass,wall,dark,mint,skyGlow,gold,leaf};
  decorateArchitecture(g,kind,width,depth,quality,palette);
  const dressed=dressZone(g,kind,width,depth,quality,palette);
  playerColliders.push(...dressed.colliders);
  animated.push(...dressed.animated);
  // Camera and locomotion collide against authored structural glass, never foliage.
 }
 pavilion(6,20,15,"BUILD STUDIO","ENGINEERING & PRODUCTS","build");
 pavilion(10,19,15,"AUTOMATE LAB","INTELLIGENT WORKFLOWS","automate");
 pavilion(8,20,14,"LEAD CENTER","STRATEGY & EXECUTION","lead");
 pavilion(12,17,13,"RECOGNITION","RESEARCH & MILESTONES","recognition");
 pavilion(4,18,12,"ORIGINS","THE PROFESSIONAL JOURNEY","origins");
 pavilion(14,15,11,"THE HORIZON","CONNECT & COLLABORATE","horizon");
 // Bay Plaza and elevated lookout plaques.
 billboard(root,"EMERALD BAY","BUILD  /  AUTOMATE  /  LEAD",0,heights[20]+7.3,4.3,10);
 const beacons=places.map((p,i)=>{
  const [x,z]=nodes[p.node],h=heights[p.node],g=new THREE.Group();
  g.position.set(x,h,z);g.name=p.title;root.add(g);
  cylinder(g,frame,0,.18,0,.62,.36,.76,12);
  cylinder(g,i%3===0?skyGlow:mint,0,.95,0,.16,1.3,.2,10);
  mesh(new THREE.OctahedronGeometry(.35,0),gold,g,0,1.78,0);return g;
 });
 const foliageGeo=new THREE.IcosahedronGeometry(1,quality==="high"?2:1);
 const trunkGeo=new THREE.CylinderGeometry(.14,.29,1,7);
 const canopy=new THREE.InstancedMesh(foliageGeo,leaf,budget.trees*4);
 const trunks=new THREE.InstancedMesh(trunkGeo,timber,budget.trees);
 const dummy=new THREE.Object3D();let treeCount=0;
 for(let attempt=0;treeCount<budget.trees&&attempt<budget.trees*45;attempt++){
  const x=(rng()-.5)*145,z=(rng()-.5)*112;
  if(!contained(x,z)||isWalkable(x,z)||z< -44)continue;
  const height=3.5+rng()*4.1;
  dummy.position.set(x,hillside(x,z)+height/2,z);
  dummy.rotation.set(0,rng()*6,0);dummy.scale.set(.9,height,.9);dummy.updateMatrix();
  trunks.setMatrixAt(treeCount,dummy.matrix);
  for(let k=0;k<4;k++){
   const a=k/4*Math.PI*2;
   dummy.position.set(x+Math.cos(a)*.92,hillside(x,z)+height+rng()*.7,z+Math.sin(a)*.92);
   dummy.scale.set(1.4+rng()*.8,.65+rng()*.6,1.3+rng()*.7);
   dummy.rotation.set(rng()*.4,rng()*6,rng()*.4);dummy.updateMatrix();
   canopy.setMatrixAt(treeCount*4+k,dummy.matrix);
  }
  treeCount++;
 }
 canopy.count=treeCount*4;trunks.count=treeCount;
 canopy.instanceMatrix.needsUpdate=true;trunks.instanceMatrix.needsUpdate=true;
 canopy.castShadow=quality==="high";root.add(canopy,trunks);
 // Tropical palm hero props near coast; static trunks + foliage instancing for efficiency.
 const palmLeafG=new THREE.ConeGeometry(.2,1.6,3),palmLeaf=new THREE.InstancedMesh(palmLeafG,reed,quality==="high"?700:350);
 let palmIndex=0;
 for(let i=0;i<(quality==="low"?9:quality==="high"?35:19);i++){
  const a=i*2.399,r=47+(i%5)*3,x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(!contained(x,z)||isWalkable(x,z))continue;
  const y=hillside(x,z),h=5.4+(i%4);
  const trunk=cylinder(root,timber,x,y+h/2,z,.19,h,.31,8);
  trunk.rotation.z=.05*Math.sin(i);
  for(let k=0;k<9;k++){
   const v=k/9*Math.PI*2;
   dummy.position.set(x+Math.cos(v)*1.6,y+h-.3,z+Math.sin(v)*1.6);
   dummy.rotation.set(Math.cos(v)*.8,v,Math.PI/2);dummy.scale.set(1,.95,1);dummy.updateMatrix();
   palmLeaf.setMatrixAt(palmIndex++,dummy.matrix);
  }
 }
 palmLeaf.count=palmIndex;palmLeaf.instanceMatrix.needsUpdate=true;root.add(palmLeaf);
 // Grass vegetation is instanced; terrain and shoreline are asset-placement boundaries.
 if(budget.grass){
  const bits=new THREE.InstancedMesh(new THREE.ConeGeometry(.11,.54,3),reed,budget.grass);
  let visible=0;
  for(let i=0;i<budget.grass*3&&visible<budget.grass;i++){
   const x=(rng()-.5)*143,z=(rng()-.5)*116;
   if(!contained(x,z)||isWalkable(x,z))continue;
   dummy.position.set(x,hillside(x,z)+.2,z);dummy.rotation.set(.1,rng()*6,.1);
   dummy.scale.set(.5+rng(),.45+rng(),.5+rng());dummy.updateMatrix();
   bits.setMatrixAt(visible++,dummy.matrix);
  }
  bits.count=visible;bits.instanceMatrix.needsUpdate=true;root.add(bits);
 }
 // Boat: authored hull + timber deck + stainless trim; used in the cinematic.
 const boat=new THREE.Group();root.add(boat);
 const hull=mesh(new THREE.SphereGeometry(1,30,16),wall,boat,0,0,0);hull.scale.set(1.3,.6,2.8);
 box(boat,timber,0,.36,0,2.1,.15,4.2);
 box(boat,frame,0,.8,.75,1.75,.8,.7);
 const pane=box(boat,glass,0,1.27,-.5,1.65,.7,.08);pane.castShadow=false;
 for(const side of [-1,1]) box(boat,mint,side*1.13,.43,-.2,.055,.06,3.7);
 boat.position.set(0,0,-84);
 // Emm: original stylized explorer with articulated rig; no personal likeness assertion.
 const character=new THREE.Group(),limbs:THREE.Group[]=[];root.add(character);
 const jacket=new THREE.MeshStandardMaterial({color:0x277259,roughness:.67});
 const pants=new THREE.MeshStandardMaterial({color:0x273c40,roughness:.9});
 const skin=new THREE.MeshStandardMaterial({color:0xc99a79,roughness:.82});
 const hair=new THREE.MeshStandardMaterial({color:0x202c29,roughness:.95});
 const sole=new THREE.MeshStandardMaterial({color:0xe9e0d1,roughness:.85});
 mesh(new THREE.CapsuleGeometry(.28,.46,5,14),jacket,character,0,1.12,0);
 mesh(new THREE.SphereGeometry(.235,16,12),skin,character,0,1.76,0).scale.set(1,1.1,.92);
 mesh(new THREE.SphereGeometry(.24,16,10,0,Math.PI*2,0,Math.PI*.55),hair,character,0,1.85,0);
 box(character,frame,0,1.1,-.27,.43,.57,.22);box(character,mint,.13,1.11,-.39,.065,.22,.03);
 for(const side of [-1,1]){
  const leg=new THREE.Group();leg.position.set(side*.17,.82,0);character.add(leg);limbs.push(leg);
  mesh(new THREE.CapsuleGeometry(.11,.42,5,10),pants,leg,0,-.28,0);
  box(leg,sole,0,-.66,.07,.26,.15,.43);
  const arm=new THREE.Group();arm.position.set(side*.38,1.34,0);character.add(arm);limbs.push(arm);
  mesh(new THREE.CapsuleGeometry(.1,.37,5,10),jacket,arm,0,-.19,0);
  mesh(new THREE.SphereGeometry(.1,10,8),skin,arm,0,-.45,0);
 }
 // Eyes read in character closeup, clothing seams provide a designed silhouette.
 for(const side of [-1,1]){
  mesh(new THREE.SphereGeometry(.03,8,6),hair,character,side*.083,1.78,.21,false);
  box(character,gold,side*.23,1.14,.1,.07,.31,.05);
 }
 polishEmm(character,limbs,quality);
 character.position.set(...[nodes[0][0],heights[0],nodes[0][1]]);
 character.traverse(o=>{if(o instanceof THREE.Mesh)o.castShadow=true});
 return {root,water,beacons,character,limbs,boat,lights,animated,reflectionTargets,sky,sunlight,cameraColliders,playerColliders};
}
