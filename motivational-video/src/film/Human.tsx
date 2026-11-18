import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type ActorName = 'tara' | 'dev' | 'mother' | 'mentor';
export type Action = 'idle'|'walk'|'run'|'work'|'solder'|'read'|'speak'|'listen'|'give'|'receive'|'celebrate'|'sad'|'point'|'carry'|'sweep'|'think';

const people: Record<ActorName, {
  skin:string; hair:string; outfit:string; trouser:string; shoes:string; hairStyle:'long'|'short'|'bun';
  size:number;
}> = {
  tara: {skin:'#b77753',hair:'#201a20',outfit:'#e0a455',trouser:'#304f6b',shoes:'#2c252b',hairStyle:'bun',size:1},
  dev: {skin:'#c68c66',hair:'#241b1c',outfit:'#4ca3be',trouser:'#394568',shoes:'#e7e0d3',hairStyle:'short',size:.75},
  mother: {skin:'#ac6a4e',hair:'#51484c',outfit:'#b88aae',trouser:'#53496a',shoes:'#352c35',hairStyle:'long',size:.96},
  mentor: {skin:'#c78b68',hair:'#3c2425',outfit:'#72b9a5',trouser:'#323c53',shoes:'#2c2d36',hairStyle:'long',size:1.02}
};

const Shape:React.FC<{pos?:[number,number,number];scale:[number,number,number];color:string;roughness?:number;rotation?:[number,number,number]}> =
 ({pos=[0,0,0],scale,color,roughness=.77,rotation=[0,0,0]}) =>
 <mesh position={pos} scale={scale} rotation={rotation} castShadow receiveShadow>
  <sphereGeometry args={[1,16,12]}/>
  <meshStandardMaterial color={color} roughness={roughness}/>
 </mesh>;

const Limb: React.FC<{length:number;radius:number;color:string}> = ({length,radius,color}) =>
 <mesh position={[0,-length/2,0]} castShadow receiveShadow>
  <cylinderGeometry args={[radius*.9,radius,length,10]}/>
  <meshStandardMaterial color={color} roughness={.88}/>
 </mesh>;

const Arm:React.FC<{side:number;action:Action;t:number;skin:string;outfit:string}> =
 ({side,action,t,skin,outfit})=>{
   const moving=action==='walk'||action==='run';
   const cycle=Math.sin(t*(action==='run'?11:6.4));
   const work=action==='work'||action==='solder'||action==='sweep';
   const offering=action==='give'||action==='receive'||action==='carry';
   const talk=action==='speak'||action==='point';
   const shoulderX=moving?cycle*(action==='run'?.65:.39)*side:
     work?-1.12+Math.sin(t*4+side)*.12:
     offering?-1.1:talk?(side===1?-1.2:-.18):action==='celebrate'?-2.5:
     action==='sad'?.08:Math.sin(t*1.3+side)*.07;
   const shoulderZ=talk&&side===1?-.35:action==='celebrate'?-side*.24:side*.06;
   const elbow=work?-.85+Math.sin(t*5+side)*.15:offering?-1.0:talk&&side===1?-.7:.15;
   return <group position={[side*.45,2.03,0]} rotation={[shoulderX,0,shoulderZ]}>
      <Shape pos={[0,-.13,0]} scale={[.16,.17,.17]} color={outfit}/>
      <Limb length={.54} radius={.135} color={outfit}/>
      <group position={[0,-.52,0]} rotation={[elbow,0,0]}>
       <Shape scale={[.115,.12,.115]} color={skin}/>
       <Limb length={.44} radius={.097} color={skin}/>
       <Shape pos={[0,-.48,0]} scale={[.125,.15,.085]} color={skin}/>
       {Array.from({length:4},(_,i)=><Shape key={i} pos={[(i-1.5)*.048,-.6,.055]}
           scale={[.024,.085,.033]} color={skin}/>)}
      </group>
   </group>;
 };

const Leg:React.FC<{side:number;action:Action;t:number;trouser:string;shoes:string}> =
 ({side,action,t,trouser,shoes})=>{
  const moving=action==='walk'||action==='run';
  const amp=action==='run'?.78:.48;
  const swing=moving?Math.sin(t*(action==='run'?11:6.4)+ (side===1?0:Math.PI))*amp:0;
  const knee=moving?Math.max(0,-swing)*1.15:.03;
  return <group position={[side*.22,1.15,0]} rotation={[swing,0,0]}>
    <Shape scale={[.19,.18,.2]} color={trouser}/>
    <Limb length={.61} radius={.17} color={trouser}/>
    <group position={[0,-.57,0]} rotation={[knee,0,0]}>
      <Shape scale={[.14,.14,.14]} color={trouser}/>
      <Limb length={.47} radius={.13} color={trouser}/>
      <Shape pos={[0,-.46,.1]} scale={[.19,.115,.33]} color={shoes}/>
    </group>
  </group>;
};

export const Human:React.FC<{
  name:ActorName;action:Action;time:number;position:[number,number,number];rotation?:number;look?:number;
}> = ({name,action,time,position,rotation=0,look=0}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  // Absolute frame drives every movement. No wall-clock animation or useFrame().
  const t=time+frame/fps*.0001;
  const p=people[name];
  const walking=action==='walk'||action==='run';
  const bounce=walking?Math.abs(Math.sin(t*(action==='run'?11:6.4)))*.055:
    action==='work'||action==='solder'?Math.sin(t*3)*.008:Math.sin(t*1.2)*.015;
  const lean=action==='work'||action==='solder'?.17:action==='sad'?.19:action==='run'?-.17:0;
  const talking=action==='speak';
  const mouthOpen=talking?.03+.04*Math.abs(Math.sin(t*8)):.016;
  return <group position={[position[0],position[1],position[2]]} rotation={[0,rotation,0]} scale={p.size}>
    <group position={[0,bounce,0]} rotation={[lean,0,0]}>
      <Leg side={-1} action={action} t={t} trouser={p.trouser} shoes={p.shoes}/>
      <Leg side={1} action={action} t={t} trouser={p.trouser} shoes={p.shoes}/>
      <Shape pos={[0,1.31,0]} scale={[.4,.35,.25]} color={p.trouser}/>
      <Shape pos={[0,1.73,0]} scale={[.49,.58,.30]} color={p.outfit}/>
      <Shape pos={[0,1.56,.304]} scale={[.29,.35,.025]} color={name==='tara'?'#f4dcc0':'#e4ded8'}/>
      <Shape pos={[0,1.2,.1]} scale={[.37,.075,.23]} color={'#3c3441'}/>
      <Shape pos={[0,2.21,0]} scale={[.145,.19,.14]} color={p.skin}/>
      <Arm side={-1} action={action} t={t} skin={p.skin} outfit={p.outfit}/>
      <Arm side={1} action={action} t={t} skin={p.skin} outfit={p.outfit}/>
      <group position={[0,2.58,0]} rotation={[action==='sad'?.22:action==='read'?.12:Math.sin(t*.8)*.035,look,0]}>
        <Shape scale={[.31,.40,.29]} color={p.skin}/>
        <Shape pos={[0,.27,-.045]} scale={[.32,.23,.29]} color={p.hair}/>
        {p.hairStyle==='long'&&<><Shape pos={[-.255,-.23,-.10]} scale={[.13,.39,.20]} color={p.hair}/><Shape pos={[.255,-.23,-.10]} scale={[.13,.39,.20]} color={p.hair}/></>}
        {p.hairStyle==='bun'&&<Shape pos={[0,.05,-.31]} scale={[.24,.25,.20]} color={p.hair}/>}
        {[-1,1].map(side=><group key={side}>
          <Shape pos={[side*.17,.025,.262]} scale={[.065,.053,.037]} color="#faf3ef"/>
          <Shape pos={[side*.17,.025,.291]} scale={[.029,.039,.016]} color="#24202a"/>
          <Shape pos={[side*.17,.17,.266]} scale={[.088,.023,.018]} color={p.hair}/>
          <Shape pos={[side*.305,-.035,0]} scale={[.06,.11,.07]} color={p.skin}/>
        </group>)}
        <Shape pos={[0,-.055,.294]} scale={[.052,.09,.073]} color={p.skin}/>
        <Shape pos={[0,-.20,.275]} scale={[.115,mouthOpen,.025]} color={talking?'#713d40':'#7f4f48'}/>
      </group>
    </group>
  </group>;
};
