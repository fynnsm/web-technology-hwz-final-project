import { builtinModules } from 'node:module';
import { Buffer } from 'node:buffer';

// copied from vite
// https://github.com/vitejs/vite/blob/814120f2ad387ca3d1e16c7dd403b04ca4b97f75/packages/vite/src/node/utils.ts#L106
// Supported by Node, Deno, Bun
const NODE_BUILTIN_NAMESPACE = "node:";
// Supported by Deno
const NPM_BUILTIN_NAMESPACE = "npm:";
// Supported by Bun
const BUN_BUILTIN_NAMESPACE = "bun:";
// Some runtimes like Bun injects namespaced modules here, which is not a node builtin
const nodeBuiltins = builtinModules.filter((id) => !id.includes(":"));
const { bun: isBun, deno: isDeno } = process.versions;
// TODO: Use `isBuiltin` from `node:module`, but Deno doesn't support it
function isBuiltin(id) {
	if (isDeno && id.startsWith(NPM_BUILTIN_NAMESPACE)) return true;
	if (isBun && id.startsWith(BUN_BUILTIN_NAMESPACE)) return true;
	return isNodeBuiltin(id);
}
function isNodeBuiltin(id) {
	if (id.startsWith(NODE_BUILTIN_NAMESPACE)) return true;
	return nodeBuiltins.includes(id);
}
const browserExternalId = "__vite-browser-external";
const browserExternalLength = 24;
function isBrowserExternal(id) {
	return id.startsWith(browserExternalId);
}
function toBuiltin(id) {
	if (id.startsWith(browserExternalId)) id = id.slice(browserExternalLength);
	if (id.startsWith(NPM_BUILTIN_NAMESPACE) || id.startsWith(BUN_BUILTIN_NAMESPACE) || id.startsWith(NODE_BUILTIN_NAMESPACE)) return id;
	if (isDeno || isBun) return id;
	return `node:${id}`;
}

let SOURCEMAPPING_URL = "sourceMa";
SOURCEMAPPING_URL += "ppingURL";
// the source map is stored after the code in the files that workers read,
// it is JSON without line breaks, so the last marker is always this one
const SOURCE_MAP_SEPARATOR = "\n//# vitestSourceMap=";
function appendSourceMap(content, sourceMap) {
	return `${content}${SOURCE_MAP_SEPARATOR}${sourceMap ?? ""}`;
}
function splitSourceMap(content) {
	const index = content.lastIndexOf(SOURCE_MAP_SEPARATOR);
	if (index === -1) return {
		code: content,
		sourceMap: void 0
	};
	return {
		code: content.slice(0, index),
		sourceMap: content.slice(index + 21) || void 0
	};
}
// debuggers read the source map from the comment in the compiled script
function withInlineSourceMap(result) {
	const { code, sourceMap } = result;
	if (code == null || !sourceMap) return result;
	return {
		...result,
		code: `${code}\n//# ${SOURCEMAPPING_URL}=data:application/json;base64,${Buffer.from(sourceMap).toString("base64")}\n`
	};
}

export { isBrowserExternal as a, appendSourceMap as b, isBuiltin as i, splitSourceMap as s, toBuiltin as t, withInlineSourceMap as w };
