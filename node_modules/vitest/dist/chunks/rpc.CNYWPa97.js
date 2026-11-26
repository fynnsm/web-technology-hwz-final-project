import { a as getSafeTimers } from './source-map.DPHGMWvM.js';
import { c as createBirpc } from './index.CAmut2NG.js';
import { g as getWorkerState } from './utils.DYj33du9.js';

const { get } = Reflect;
const globalProcess = globalThis.process;
function withSafeTimers(fn) {
	const { setTimeout, clearTimeout, nextTick, setImmediate, clearImmediate } = getSafeTimers();
	const currentSetTimeout = globalThis.setTimeout;
	const currentClearTimeout = globalThis.clearTimeout;
	const currentSetImmediate = globalThis.setImmediate;
	const currentClearImmediate = globalThis.clearImmediate;
	const currentNextTick = globalProcess?.nextTick;
	try {
		globalThis.setTimeout = setTimeout;
		globalThis.clearTimeout = clearTimeout;
		if (setImmediate) globalThis.setImmediate = setImmediate;
		if (clearImmediate) globalThis.clearImmediate = clearImmediate;
		if (globalProcess && nextTick) globalProcess.nextTick = nextTick;
		return fn();
	} finally {
		globalThis.setTimeout = currentSetTimeout;
		globalThis.clearTimeout = currentClearTimeout;
		globalThis.setImmediate = currentSetImmediate;
		globalThis.clearImmediate = currentClearImmediate;
		if (globalProcess && nextTick) nextTick(() => {
			globalProcess.nextTick = currentNextTick;
		});
	}
}
const promises = /* @__PURE__ */ new Set();
async function rpcDone() {
	if (!promises.size) return;
	const awaitable = Array.from(promises);
	return Promise.all(awaitable);
}
const onCancelCallbacks = [];
function onCancel(callback) {
	onCancelCallbacks.push(callback);
	return () => {
		const index = onCancelCallbacks.indexOf(callback);
		if (index !== -1) onCancelCallbacks.splice(index, 1);
	};
}
function createRuntimeRpc(options) {
	return createSafeRpc(createBirpc({ async onCancel(reason) {
		await Promise.all(onCancelCallbacks.map((fn) => fn(reason)));
	} }, {
		eventNames: ["onCancel"],
		timeout: -1,
		...options
	}));
}
function createSafeRpc(rpc) {
	return new Proxy(rpc, { get(target, p, handler) {
		// keep $rejectPendingCalls as sync function
		if (p === "$rejectPendingCalls") return rpc.$rejectPendingCalls;
		const sendCall = get(target, p, handler);
		const safeSendCall = (...args) => withSafeTimers(async () => {
			const result = sendCall(...args);
			promises.add(result);
			try {
				return await result;
			} finally {
				promises.delete(result);
			}
		});
		safeSendCall.asEvent = sendCall.asEvent;
		return safeSendCall;
	} });
}
function rpc() {
	const { rpc } = getWorkerState();
	return rpc;
}

export { rpcDone as a, createRuntimeRpc as c, onCancel as o, rpc as r };
