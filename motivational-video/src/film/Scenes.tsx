import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';
import {Vector3} from 'three';
import {Action,ActorName,Human} from './Human';
import {Block,Environment,SetName,SolarLamp,Sphere} from './World';

type Cast = {
  name:ActorName; action:Action; start:[number,number,number]; end?:[number,number,number]; angle?:number;
  startAt?:number; endAt?:number;
};
type Shot={
  title:string; set:SetName; night?:boolean; cast:Cast[]; lens:'wide'|'medium'|'close'|'track'|'orbit';
  focus?:[number,number,number]; extra?:'rain'|'lamp'|'broken'|'books'|'toolbox'|'timer'|'sparks';
  dramatic?:boolean;
};
// Twenty-four distinct, authored action sequences. Two 25-second shots per 50-second chapter.
export const shots:Shot[]=[
 {title:'A city before sunrise',set:'street',night:true,lens:'track',cast:[{name:'tara',action:'walk',start:[-10,0,2],end:[2,0,2]}]},
 {title:'Opening the repair shop',set:'shop',night:true,lens:'wide',cast:[{name:'tara',action:'walk',start:[-4,0,3],end:[-.7,0,0],endAt:8},{name:'tara',action:'work',start:[-.7,0,0],startAt:8}]},
 {title:'Finding an old solar light',set:'shop',lens:'medium',extra:'broken',cast:[{name:'tara',action:'sweep',start:[-2.3,0,.45]},{name:'mother',action:'walk',start:[4,0,2],end:[2,0,1]}]},
 {title:'Drawing a blueprint',set:'home',night:true,lens:'orbit',extra:'books',cast:[{name:'tara',action:'work',start:[0,0,-.1]},{name:'mother',action:'listen',start:[3,0,1],angle:-.7}]},
 {title:'First prototype burns out',set:'shop',night:true,lens:'close',extra:'sparks',cast:[{name:'tara',action:'solder',start:[.3,0,.3]}]},
 {title:'The difficult walk home',set:'street',night:true,lens:'track',dramatic:true,cast:[{name:'tara',action:'walk',start:[2,0,2],end:[-7,0,2]}]},
 {title:'Mother hands over a timer',set:'home',night:true,lens:'medium',extra:'timer',cast:[{name:'mother',action:'give',start:[-1.1,0,.3],angle:.6},{name:'tara',action:'receive',start:[1.1,0,.3],angle:-.6}]},
 {title:'The new promise',set:'home',night:true,lens:'orbit',extra:'timer',cast:[{name:'tara',action:'work',start:[.25,0,-.3]}]},
 {title:'Learning the circuitry',set:'shop',lens:'close',extra:'books',cast:[{name:'tara',action:'read',start:[.25,0,.15]}]},
 {title:'Weeks of careful work',set:'shop',night:true,lens:'medium',extra:'toolbox',cast:[{name:'tara',action:'solder',start:[.25,0,.15]},{name:'mother',action:'listen',start:[3,0,1.8]}]},
 {title:'Long shifts in the shop',set:'shop',lens:'wide',cast:[{name:'tara',action:'work',start:[0,0,0]},{name:'dev',action:'walk',start:[5,0,3],end:[2.5,0,2]}]},
 {title:'Returning to the workbench',set:'home',night:true,lens:'close',extra:'books',cast:[{name:'tara',action:'work',start:[.2,0,.1]}]},
 {title:'Storm over the city',set:'street',night:true,lens:'wide',extra:'rain',cast:[{name:'tara',action:'run',start:[-6,0,2],end:[5,0,2]}]},
 {title:'Saving the notebook',set:'shop',night:true,lens:'medium',extra:'rain',dramatic:true,cast:[{name:'tara',action:'carry',start:[0,0,1],end:[2.8,0,2.3]}]},
 {title:'A student asks for help',set:'shop',lens:'medium',cast:[{name:'dev',action:'give',start:[1.55,0,1.4],angle:-.45},{name:'tara',action:'receive',start:[-1.55,0,1.4],angle:.45}]},
 {title:'The purpose becomes real',set:'shop',lens:'close',extra:'books',cast:[{name:'tara',action:'speak',start:[-1.65,0,1.4],angle:.45},{name:'dev',action:'listen',start:[1.65,0,1.4],angle:-.45}]},
 {title:'A working lamp',set:'shop',night:true,lens:'close',extra:'lamp',cast:[{name:'tara',action:'solder',start:[-.25,0,.25]},{name:'dev',action:'listen',start:[2.4,0,1.4],angle:-.4}]},
 {title:'The lamp changes hands',set:'shop',night:true,lens:'orbit',extra:'lamp',cast:[{name:'tara',action:'give',start:[-1.3,0,1.55],angle:.55},{name:'dev',action:'receive',start:[1.3,0,1.55],angle:-.55}]},
 {title:'Testing twenty lamps',set:'classroom',lens:'wide',extra:'lamp',cast:[{name:'tara',action:'work',start:[-4,0,3]},{name:'dev',action:'read',start:[.0,0,3]},{name:'mentor',action:'listen',start:[4,0,3]}]},
 {title:'Fixing what failed',set:'shop',night:true,lens:'close',extra:'sparks',cast:[{name:'tara',action:'solder',start:[.3,0,.1]},{name:'mother',action:'listen',start:[2.6,0,2]}]},
 {title:'The mentor arrives',set:'shop',lens:'track',cast:[{name:'mentor',action:'walk',start:[6,0,3],end:[2,0,1.3]},{name:'tara',action:'listen',start:[-1,0,1.3],angle:.6}]},
 {title:'Explaining her invention',set:'classroom',lens:'medium',extra:'lamp',cast:[{name:'tara',action:'point',start:[-2.2,0,2]},{name:'mentor',action:'listen',start:[2.3,0,2],angle:-.5},{name:'dev',action:'read',start:[0,0,4]}]},
 {title:'Teaching the next generation',set:'classroom',lens:'orbit',extra:'lamp',cast:[{name:'tara',action:'speak',start:[-3,0,2]},{name:'dev',action:'work',start:[.0,0,2]},{name:'mother',action:'listen',start:[3,0,2]}]},
 {title:'The city lights up',set:'rooftop',night:true,lens:'wide',extra:'lamp',cast:[{name:'tara',action:'celebrate',start:[-1.3,0,1]},{name:'dev',action:'celebrate',start:[1.3,0,1]}]}
];
export const SHOT_SECONDS=25;
export const STORY_SECONDS=shots.length*SHOT_SECONDS;

const at=(c:Cast,t:number):[number,number,number]=>{
 const start=c.startAt??0, end=c.endAt??SHOT_SECONDS;
 const x=c.end?Math.max(0,Math.min(1,(t-start)/(end-start))):0;
 const v=x*x*(3-2*x);
 return [
  c.start[0]+((c.end?.[0]??c.start[0])-c.start[0])*v,
  c.start[1]+((c.end?.[1]??c.start[1])-c.start[1])*v,
  c.start[2]+((c.end?.[2]??c.start[2])-c.start[2])*v
 ];
};
const Extras:React.FC<{shot:Shot;t:number}>=({shot,t})=>{
 const extra=shot.extra;
 return <group>
 {extra==='broken'&&<group><Block p={[1.3,1.2,-.3]} s={[.7,.07,.35]} c="#3d5260" r={[.25,0,.3]}/><Block p={[1.45,1.25,-.25]} s={[.19,.11,.13]} c="#ae6c5e"/></group>}
 {extra==='books'&&Array.from({length:4},(_,i)=><Block key={i} p={[-.2+i*.18,1.3+i*.06,-1.45]} s={[.27,.06,.46]} c={['#547a84','#a6796b','#9d9e77','#c6a179'][i]} r={[0,i*.1,0]}/>)}
 {extra==='toolbox'&&<group><Block p={[1.2,1.2,-1.2]} s={[.8,.35,.5]} c="#3b7381"/><Block p={[1.2,1.48,-1.2]} s={[.34,.08,.09]} c="#c7bd9e"/></group>}
 {extra==='timer'&&<group><Sphere p={[.1,1.5,-1.65]} s={[.25,.25,.12]} c="#d9d3b8"/><Block p={[.1,1.48,-1.5]} s={[.016,.19,.015]} c="#3d424b"/></group>}
 {extra==='lamp'&&<SolarLamp position={[0,shot.set==='classroom'?.98:shot.set==='rooftop'?.28:1.18,shot.set==='classroom'?2:-1.1]} glowing/>}
 {extra==='sparks'&&Array.from({length:10},(_,i)=><Sphere key={i}
   p={[(i%5-2)*.09+.25,1.5+Math.sin(t*6+i)*.23,-1.14+Math.cos(i+t*2)*.12]}
   s={[.025,.025,.025]} c={i%2?'#ffcc6b':'#f77c48'}/>)}
 {extra==='rain'&&Array.from({length:85},(_,i)=>{
   const x=((i*17.3+t*1.9)%19)-9.5;
   const y=((i*8.17-t*7)%7+7)%7;
   const z=((i*3.79)%12)-6;
   return <Block key={i} p={[x,y,z]} s={[.012,.31,.012]} c="#aed0ee" r={[.2,0,.1]}/>;
 })}
 </group>;
};

const Camera:React.FC<{shot:Shot;t:number;actors:Cast[]}>=({shot,t,actors})=>{
 const {camera}=useThree();
 const main=actors[0];
 const p=main?at(main,t):[0,0,0];
 const target=shot.focus??([shot.lens==='track'?p[0]:0,1.5,shot.lens==='track'?p[2]:0] as [number,number,number]);
 const orbit=shot.lens==='orbit'?t*.025:0;
 const close=shot.lens==='close',wide=shot.lens==='wide';
 const distance=close?5:wide?14:shot.lens==='track'?9:8.5;
 const cx=(shot.lens==='track'?p[0]:0)+Math.sin(.2+orbit)*distance;
 const cy=close?2.7:wide?6.2:4.4;
 const cz=(shot.lens==='track'?p[2]:0)+Math.cos(.2+orbit)*distance;
 camera.position.copy(new Vector3(cx,cy,cz));
 camera.lookAt(target[0],target[1],target[2]);
 camera.updateProjectionMatrix();
 return null;
};
const WorldShot:React.FC<{shot:Shot;timeOffset?:number}>=({shot,timeOffset=0})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 const t=frame/fps+timeOffset;
 return <><Environment set={shot.set} night={shot.night}/><Camera shot={shot} t={t} actors={shot.cast}/>
   {shot.cast.filter(c=>t>=(c.startAt??0)&&t<(c.endAt??SHOT_SECONDS)).map((c,i)=><Human
       key={c.name+'-'+i} name={c.name} action={c.action} time={t} position={at(c,t)} rotation={c.angle??0}/>)}
   <Extras shot={shot} t={t}/>
 </>;
};
export const CinematicShot:React.FC<{shot:Shot;timeOffset?:number;subtitle?:string}>=({shot,timeOffset=0,subtitle})=>{
 const {width,height,fps}=useVideoConfig();
 const frame=useCurrentFrame();
 const fadeIn=interpolate(frame,[0,Math.round(fps*.6)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{backgroundColor:'#101927'}}>
  <ThreeCanvas width={width} height={height} orthographic={false} camera={{fov:45,position:[8,4.4,9],near:.1,far:200}} shadows gl={{antialias:true,preserveDrawingBuffer:true}}>
   <WorldShot shot={shot} timeOffset={timeOffset}/>
  </ThreeCanvas>
  <AbsoluteFill style={{pointerEvents:'none',background:'linear-gradient(to bottom,#00000055,transparent 20%,transparent 75%,#0000008f)'}}>
    <div style={{position:'absolute',left:46,top:33,fontFamily:'sans-serif',fontSize:17,letterSpacing:4,color:'#f6e3c2',fontWeight:700,opacity:fadeIn}}>
      THE ONE-HOUR PROMISE
    </div>
    <div style={{position:'absolute',bottom:46,left:46,fontFamily:'sans-serif',fontSize:20,letterSpacing:1,color:'#e3e9ee',opacity:fadeIn}}>
      {subtitle??shot.title}
    </div>
  </AbsoluteFill>
 </AbsoluteFill>;
};
