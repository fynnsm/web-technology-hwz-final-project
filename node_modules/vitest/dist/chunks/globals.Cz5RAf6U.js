import { g as globalApis } from './constants.DLYM6cZY.js';
import { i as index } from './index.D5jWOaqm.js';
import './run.zBhXlcZQ.js';
import './index.Or9psEGe.js';
import './tinyrainbow.Do8I1XRG.js';
import './display.Cj2h2zsY.js';
import './pathe.M-eThtNZ.zq3TM4NT.js';
import './source-map.DPHGMWvM.js';
import '../task-utils.js';
import './utils.DYj33du9.js';
import './spy.BO0hTE3G.js';
import 'chai';
import './plugins.BPruPOR8.js';
import './rawSnapshot.DvoRLRNr.js';
import './offset.Dy-5Fdfn.js';
import './index.CAmut2NG.js';
import 'vite/module-runner';
import 'tinybench';
import './rpc.CNYWPa97.js';
import 'expect-type';

function registerApiGlobally() {
	globalApis.forEach((api) => {
		// @ts-expect-error I know what I am doing :P
		globalThis[api] = index[api];
	});
}

export { registerApiGlobally };
