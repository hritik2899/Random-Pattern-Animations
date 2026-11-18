import {Config} from '@remotion/cli/config';
// ANGLE/SwiftShader is required on CPU GitHub Actions runners for WebGL 3D scenes.
Config.setChromiumOpenGlRenderer('angle');
Config.setOverwriteOutput(true);
