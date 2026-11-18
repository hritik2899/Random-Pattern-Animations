import React from 'react';
import {AbsoluteFill, Audio, Composition, Easing, interpolate, registerRoot, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import story from '../story.json';

const FPS = 24;
const CHAPTER_FRAMES = FPS * 50;
const WIDTH = 1280;
const HEIGHT = 720;
type Chapter = (typeof story.chapters)[number];

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, start + 22, end - 22, end], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Background: React.FC<{chapter: Chapter; index: number}> = ({chapter, index}) => {
  const frame = useCurrentFrame();
  const sun = [0,3,8,11].includes(index);
  const dark = chapter.kind === 'night' || chapter.kind === 'storm';
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 55%, ' + chapter.accent + '48, #111c32 54%, #050911 100%)', overflow:'hidden'}}>
    <svg width="1280" height="720" viewBox="0 0 1280 720" style={{position:'absolute', inset:0}}>
      <rect width="1280" height="720" fill={dark ? '#12182e' : '#283c51'} opacity=".35"/>
      {Array.from({length:28},(_,i)=><circle key={i} cx={(i*137+73)%1280} cy={(i*79+37)%390} r={i%4===0?2:1} fill="white" opacity={.12+.3*(.5+.5*Math.sin(frame/45+i))}/>)}
      <circle cx={1000+Math.sin(frame/140)*27} cy={sun?350:215} r={sun?95:58} fill={chapter.accent} opacity={sun?.6:.27}/>
      <circle cx={1000+Math.sin(frame/140)*27} cy={sun?350:215} r={sun?145:110} fill="none" stroke={chapter.accent} strokeWidth="2" opacity=".18"/>
      <path d="M0 565 L160 499 L345 571 L525 493 L710 580 L890 495 L1050 548 L1280 475 L1280 720 L0 720Z" fill={chapter.accent} opacity=".15"/>
      <path d="M0 608 L160 578 L350 632 L550 574 L762 629 L990 566 L1280 614 L1280 720 L0 720Z" fill="#050b15"/>
      {chapter.kind==='city'&&Array.from({length:18},(_,i)=><g key={i}><rect x={i*76-20} y={490-i*43%150} width="59" height="250" fill="#070f1f"/><rect x={i*76+1} y={505-i*43%150} width="5" height="7" fill={chapter.accent} opacity=".5"/></g>)}
      {chapter.kind==='storm'&&Array.from({length:35},(_,i)=><line key={i} x1={(i*47+frame*.8)%1330} y1={(i*91+frame*2)%720} x2={(i*47+frame*.8)%1330-15} y2={(i*91+frame*2)%720+44} stroke="#a5ddf5" strokeWidth="2" opacity=".25"/>)}
      <path d="M0 690 Q330 654 640 689 T1280 677" stroke={chapter.accent} strokeWidth="3" opacity=".35" fill="none"/>
    </svg>
    <AbsoluteFill style={{background:'linear-gradient(90deg,#050b17ee 0%,#050b17bb 54%,transparent 100%)'}}/>
  </AbsoluteFill>;
};

const ChapterView: React.FC<{chapter: Chapter; index: number}> = ({chapter,index}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const appear=spring({frame,fps,config:{damping:190,stiffness:80}});
  const topOpacity=fade(frame,0,CHAPTER_FRAMES-1);
  const progress=interpolate(frame,[0,CHAPTER_FRAMES],[0,100],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{fontFamily:'Arial,Helvetica,sans-serif',color:'#f8fafc'}}>
    <Background chapter={chapter} index={index}/>
    <AbsoluteFill style={{padding:'68px 86px 53px'}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:17,letterSpacing:4,fontWeight:700,color:chapter.accent,opacity:topOpacity}}>
        <span>THE ONE-HOUR PROMISE</span><span>{String(index+1).padStart(2,'0')} / {String(story.chapters.length).padStart(2,'0')}</span>
      </div>
      <div style={{position:'absolute',left:86,right:86,top:157,opacity:topOpacity,transform:'translateY('+interpolate(appear,[0,1],[32,0])+'px)'}}>
        <div style={{height:5,width:83,background:chapter.accent,borderRadius:4,marginBottom:31}}/>
        <div style={{fontSize:75,lineHeight:1.09,letterSpacing:-2.5,maxWidth:900,fontWeight:800,textShadow:'0 12px 40px #050911'}}>{chapter.heading}</div>
        <div style={{fontSize:27,marginTop:22,maxWidth:710,lineHeight:1.5,color:'#ced7e4'}}>{chapter.tagline}</div>
      </div>
      {chapter.beats.map((beat,i)=>{
        const start=7*fps+i*10*fps,end=Math.min(start+10*fps,CHAPTER_FRAMES-1);
        const opacity=fade(frame,start,end);
        const y=interpolate(frame,[start,start+22],[26,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
        return <div key={i} style={{position:'absolute',left:86,bottom:127,right:210,fontWeight:600,lineHeight:1.25,fontSize:40,letterSpacing:-.6,opacity,transform:'translateY('+y+'px)'}}>
          <span style={{color:chapter.accent,marginRight:17}}>—</span>{beat}
        </div>;
      })}
      <div style={{position:'absolute',left:86,bottom:61,width:1108,height:4,background:'#ffffff26',borderRadius:2}}>
        <div style={{width:progress+'%',height:'100%',background:chapter.accent,borderRadius:2}}/>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
const MotivationalStory: React.FC=()=> <AbsoluteFill style={{background:'#050911'}}>
  {story.chapters.map((chapter,index)=><Sequence key={index} from={index*CHAPTER_FRAMES} durationInFrames={CHAPTER_FRAMES}>
    <ChapterView chapter={chapter} index={index}/>
    <Audio src={staticFile('voice/chapter-'+String(index+1).padStart(2,'0')+'.mp3')} volume={1}/>
  </Sequence>)}
</AbsoluteFill>;
const Root: React.FC=()=> <Composition id="MotivationalStory" component={MotivationalStory} durationInFrames={CHAPTER_FRAMES*story.chapters.length} fps={FPS} width={WIDTH} height={HEIGHT}/>;
registerRoot(Root);
