import {Config} from '@remotion/cli/config';
// GitHub-hosted Actions runners do not have GPUs. ANGLE requires a GPU;
// SWANGLE is the CPU-backed SwiftShader implementation.
Config.setChromiumOpenGlRenderer('swangle');
Config.setOverwriteOutput(true);
