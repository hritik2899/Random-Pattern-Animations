import React from 'react';
import {AbsoluteFill, Audio, Composition, registerRoot, Sequence, staticFile} from 'remotion';
import {CinematicShot,shots,SHOT_SECONDS,STORY_SECONDS} from './film/Scenes';

const FPS=24;
const SIZE={width:1280,height:720,fps:FPS};
const FullFilm:React.FC=()=> <AbsoluteFill style={{backgroundColor:'#111827'}}>
 {shots.map((shot,i)=><Sequence key={i} from={i*SHOT_SECONDS*FPS} durationInFrames={SHOT_SECONDS*FPS}>
   <CinematicShot shot={shot}/>
 </Sequence>)}
 {Array.from({length:12},(_,i)=><Sequence key={'voice'+i} from={i*50*FPS} durationInFrames={50*FPS}>
   <Audio src={staticFile('voice/chapter-'+String(i+1).padStart(2,'0')+'.mp3')} volume={1}/>
 </Sequence>)}
</AbsoluteFill>;

const Preview:React.FC=()=> <AbsoluteFill style={{backgroundColor:'#111827'}}>
 <CinematicShot shot={shots[17]} subtitle="Tara hands the working lamp to Dev"/>
 <Audio src={staticFile('voice/chapter-09.mp3')} volume={1}/>
</AbsoluteFill>;

const Root:React.FC=()=> <>
 <Composition id="CinematicPreview" component={Preview} durationInFrames={12*FPS} {...SIZE}/>
 <Composition id="CinematicFilm" component={FullFilm} durationInFrames={STORY_SECONDS*FPS} {...SIZE}/>
</>;
registerRoot(Root);
