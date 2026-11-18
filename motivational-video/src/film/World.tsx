import React from 'react';

export type SetName='shop'|'street'|'home'|'classroom'|'rooftop';
const Mat:React.FC<{color:string;metalness?:number;roughness?:number}>=({color,metalness=0,roughness=.85})=><meshStandardMaterial color={color} metalness={metalness} roughness={roughness}/>;
export const Block:React.FC<{p:[number,number,number];s:[number,number,number];c:string;r?:[number,number,number];metal?:number}>=({p,s,c,r=[0,0,0],metal=0})=><mesh position={p} rotation={r} castShadow receiveShadow><boxGeometry args={s}/><Mat color={c} metalness={metal}/></mesh>;
export const Sphere:React.FC<{p:[number,number,number];s:[number,number,number];c:string}>=({p,s,c})=><mesh position={p} scale={s} castShadow><sphereGeometry args={[1,16,12]}/><Mat color={c}/></mesh>;
const Cylinder:React.FC<{p:[number,number,number];args:[number,number,number];c:string}>=({p,args,c})=><mesh position={p} castShadow receiveShadow><cylinderGeometry args={[...args,12]}/><Mat color={c}/></mesh>;

const Lamp:React.FC<{x:number;z:number;on?:boolean}>=({x,z,on=true})=><group position={[x,0,z]}>
  <Cylinder p={[0,1.05,0]} args={[.045,.06,2.1]} c="#343e4c"/>
  <Sphere p={[0,2.15,0]} s={[.28,.18,.28]} c={on?'#f9cc78':'#6c707b'}/>
  {on&&<pointLight position={[0,2.13,.0]} color="#fcd6a2" intensity={8} distance={5}/>}
</group>;
export const SolarLamp:React.FC<{position:[number,number,number];glowing?:boolean}>=({position,glowing=false})=><group position={position}>
 <Block p={[0,.06,0]} s={[.7,.12,.4]} c="#283c4e"/>
 <Block p={[0,.14,.03]} s={[.57,.035,.27]} c="#1e7799" metal={.5}/>
 {Array.from({length:5},(_,i)=><Block key={i} p={[-.22+i*.11,.16,.03]} s={[.012,.006,.25]} c="#b4d8de"/>)}
 <Cylinder p={[0,.30,0]} args={[.035,.05,.35]} c="#e3dac7"/>
 <Sphere p={[0,.5,0]} s={[.17,.14,.17]} c={glowing?'#fff4b0':'#d5caaa'}/>
 {glowing&&<pointLight position={[0,.6,0]} intensity={15} distance={6} color="#ffe39b"/>}
 </group>;
const ToolRack:React.FC=()=> <group>
 <Block p={[-3.6,2.35,-3.45]} s={[.11,1.6,.08]} c="#4f6f78"/>
 {Array.from({length:6},(_,i)=><group key={i}>
   <Block p={[-3.35+i*.33,1.9+(.25*(i%3)),-3.4]} s={[.24,.07,.08]} c="#c0b6a5"/>
   <Block p={[-3.35+i*.33,1.65+(.25*(i%3)),-3.4]} s={[.04,.35,.04]} c="#34383d"/>
 </group>)}
 </group>;
const Workbench:React.FC<{withLamp?:boolean;glowing?:boolean}>=({withLamp=true,glowing=false})=><group>
  <Block p={[0,1.01,-1.25]} s={[3.7,.19,1.5]} c="#966746"/>
  {[-1.5,1.5].map(x=>[-1.78,-.72].map(z=><Block key={x+':'+z} p={[x,.49,z]} s={[.15,.95,.15]} c="#6c5144"/>))}
  <Block p={[-.8,1.15,-1.48]} s={[.5,.08,.38]} c="#293a43" />
  <Block p={[.45,1.13,-1.55]} s={[.65,.09,.45]} c="#a9b1a8"/>
  {Array.from({length:6},(_,i)=><Cylinder key={i} p={[1.05+(i%3)*.17,1.16,-1.78+Math.floor(i/3)*.28]} args={[.035,.035,.13]} c={i%2?'#cc7757':'#3e7b89'}/>)}
  {withLamp&&<SolarLamp position={[0,1.15,-1.08]} glowing={glowing}/>}
  <ToolRack/>
 </group>;

const Roofs:React.FC=()=> <group>
 {Array.from({length:12},(_,i)=>{
  const x=-18+i*3.5;
  const h=4+(i*17%7);
  return <group key={i}>
   <Block p={[x,h/2,-12]} s={[2.8,h,1.3]} c={i%3===0?'#52657a':'#3d4b62'}/>
   {Array.from({length:3},(_,j)=><Block key={j} p={[x-1+j*.8,h*.55,-11.31]} s={[.35,.35,.08]} c={i%2?'#e6b978':'#7891a6'}/>)}
  </group>})}
 </group>;

const Street:React.FC=()=> <group>
  <Block p={[0,-.17,0]} s={[100,.34,100]} c="#3a404c"/>
  <Block p={[0,-.015,0]} s={[100,.03,9]} c="#31333d"/>
  {Array.from({length:18},(_,i)=><Block key={i} p={[-40+i*5,.008,0]} s={[2.3,.012,.075]} c="#f1d3a4"/>)}
  {[-1,1].map(s=><group key={s}>
   <Block p={[0,.08,s*5.9]} s={[100,.18,2.8]} c="#7b8791"/>
   {Array.from({length:6},(_,i)=><Lamp key={i} x={-35+i*12} z={s*6.2}/>)}
  </group>)}
  <Roofs/>
 </group>;

const Home:React.FC=()=> <group>
 <Block p={[0,-.22,0]} s={[15,.42,12]} c="#8f796b"/>
 <Block p={[0,3.0,-5.6]} s={[15,6,.27]} c="#b9a18d"/>
 <Block p={[-7.5,2.9,0]} s={[.25,6,12]} c="#c3a796"/>
 <Block p={[7.5,2.9,0]} s={[.25,6,12]} c="#c3a796"/>
 <Block p={[-.3,1.05,-2.0]} s={[2.7,.16,1.4]} c="#986849"/>
 <Block p={[0,1.5,-2]} s={[.52,.06,.39]} c="#ded7b5"/>
 <Block p={[3.7,1.4,-3]} s={[1.8,2.8,.25]} c="#584d46"/>
 <Lamp x={-3.1} z={-3.8}/>
 </group>;

const Shop:React.FC=()=> <group>
 <Block p={[0,-.22,0]} s={[15,.42,12]} c="#6e6462"/>
 <Block p={[0,3,-5.4]} s={[15,6,.25]} c="#8493a0"/>
 <Block p={[-7.4,3,0]} s={[.25,6,12]} c="#86929b"/>
 <Block p={[7.4,3,0]} s={[.25,6,12]} c="#86929b"/>
 <Block p={[0,5.9,0]} s={[15,.25,12]} c="#3b424c"/>
 <Block p={[-4.8,4.85,-2.9]} s={[3.2,.8,.12]} c="#29313d"/>
 <Block p={[-4.8,4.87,-2.81]} s={[2.9,.6,.08]} c="#e6b67b"/>
 <Workbench/>
 {Array.from({length:4},(_,i)=><group key={i}>
   <Block p={[4.2,1+i*.9,-4.9]} s={[3.8,.14,.8]} c="#80634f"/>
   {Array.from({length:4},(_,j)=><Block key={j} p={[2.8+j*.85,1.27+i*.9,-4.83]} s={[.3,.4,.3]} c={j%2?'#526775':'#a9a294'}/>)}
 </group>)}
 <Block p={[-5.5,2.6,-5.2]} s={[1.7,1.4,.15]} c="#c3b5a0"/>
 <Block p={[-5.5,2.6,-5.08]} s={[1.36,1.05,.05]} c="#283d51"/>
 <Lamp x={5.6} z={1}/>
 </group>;
const Classroom:React.FC=()=> <group>
 <Block p={[0,-.2,0]} s={[18,.4,15]} c="#b2a18d"/>
 <Block p={[0,4,-7]} s={[18,8,.24]} c="#d6c9b4"/>
 <Block p={[0,3.4,-6.86]} s={[7,3,.08]} c="#284c42"/>
 <Block p={[0,5.3,-6.74]} s={[7.7,.2,.22]} c="#98704b"/>
 {Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=><group key={i+':'+j}>
   <Block p={[-5+i*4,.85,2-j*3]} s={[2.25,.13,1.25]} c="#996c47"/>
   <Block p={[-5+i*4,.43,2-j*3]} s={[.15,.85,.12]} c="#4b4545"/>
 </group>))}
 </group>;
const Rooftop:React.FC=()=> <group>
 <Block p={[0,-.22,0]} s={[40,.44,30]} c="#798391"/>
 <Block p={[0,.6,-12]} s={[40,1.25,.3]} c="#a4a8a6"/>
 <Block p={[-18,.6,0]} s={[.3,1.25,30]} c="#a4a8a6"/>
 <Roofs/>
 <SolarLamp position={[1,.22,-1]} glowing/>
 </group>;

export const Environment:React.FC<{set:SetName;night?:boolean}>=({set,night=false})=><group>
 <color attach="background" args={[night?'#18243c':'#9cb5c5']}/>
 <ambientLight intensity={night?.65:1.45} color="#f1e6d5"/>
 <hemisphereLight args={[night?'#8c9cc3':'#e7e4d1','#51483e',night?1.15:2.1]}/>
 <directionalLight position={[7,12,7]} intensity={night?1.6:3.3} color={night?'#9db4f4':'#ffe5bc'} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16}/>
 {set==='shop'?<Shop/>:set==='home'?<Home/>:set==='classroom'?<Classroom/>:set==='rooftop'?<Rooftop/>:<Street/>}
 </group>;
