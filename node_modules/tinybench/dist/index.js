const e = Object.freeze(() => {}), t = globalThis.Event;
var n = class extends t {
	get error() {
		return this.#e;
	}
	get reason() {
		return this.#t;
	}
	get task() {
		return this.#n;
	}
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		super(e), t != null && (this.#n = t), typeof n == "string" ? this.#t = n : n != null && (this.#e = n);
	}
};
// src/async.ts
const r = (e) => e !== null && (typeof e == "object" || typeof e == "function") && typeof e.then == "function", i = (t, n = 2, a = new WeakSet()) => {
	try {
		if (!r(t) || a.has(t)) return;
		if (n < -1) {
			a.add(t), t.catch?.(e);
			return;
		}
		a.add(t);
		let o = (e) => {
			i(e, n - 1, a);
		};
		i(t.then(o, o), n - 1, a);
	} catch {}
}, a = (async () => {}).constructor, o = (e) => typeof e == "function" && e.constructor === a, s = (e) => {
	if (e == null) return !1;
	if (o(e)) return !0;
	try {
		let t = e(), n = r(t);
		return n && i(t), n;
	} catch {
		return !1;
	}
}, c = (e, t) => {
	if (!e) {
		let e = Error.stackTraceLimit;
		try {
			Error.stackTraceLimit = 0;
			let n = Error(t);
			throw Error.stackTraceLimit = e, e !== 0 && Error.captureStackTrace(n, c), n;
		} finally {
			Error.stackTraceLimit = e;
		}
	}
}, l = (e) => {
	switch (typeof e) {
		case "function": return Error(e.name);
		case "object": if (e !== null) return e instanceof Error ? e : Error(e.message ?? "");
		case "undefined": return Error();
		case "string": return Error(e);
		default: return Error(String(e));
	}
}, u = (e) => Number(e) / 1e6, d = (e) => Number(e) * 1e6, f = (e) => e, p = (e) => BigInt(Math.round(e * 1e6));
// src/runtime.ts
function m(e = globalThis) {
	let t = "unknown", n = "unknown";
	if (e.Bun || e.process && e.process.versions?.bun) {
		t = "bun";
		let r = e.Bun?.version;
		if (r) n = r;
		else {
			let t = e.process?.versions?.bun;
			t && (n = t);
		}
	} else e.Deno ? (t = "deno", n = e.Deno.version?.deno ?? "unknown") : e.process && e.process.release?.name === "node" ? (t = "node", n = e.process.versions?.node ?? "unknown") : e.HermesInternal ? (t = "hermes", n = e.HermesInternal.getRuntimeProperties?.()["OSS Release Version"] ?? "unknown") : h(e) && e.navigator.userAgent === "Cloudflare-Workers" ? t = "workerd" : h(e) && e.navigator.userAgent.toLowerCase().startsWith("quickjs-ng") ? (t = "quickjs-ng", n = e.navigator.userAgent.split("/")[1] ?? "unknown") : typeof e.Netlify == "object" ? t = "netlify" : typeof e.EdgeRuntime == "string" ? t = "edge-light" : e.__lagon__ ? t = "lagon" : e.fastly ? t = "fastly" : e.$262 && e.lockdown && e.AsyncDisposableStack ? t = "moddable" : e.d8 ? (t = "v8", n = typeof e.version == "function" ? e.version() : "unknown") : e.inIon && e.performance && e.performance.mozMemory ? t = "spidermonkey" : typeof e.$ == "object" && e.$ !== null && "IsHTMLDDA" in e.$ ? t = "jsc" : e.window && e.navigator && (t = "browser");
	return {
		runtime: t,
		version: n
	};
}
function h(e = globalThis) {
	return typeof e.navigator == "object" && e.navigator !== null && typeof e.navigator.userAgent == "string";
}
const { runtime: g, version: _ } = m(), v = globalThis.performance.now.bind(globalThis.performance), y = {
	fn: v,
	fromMs: f,
	name: "performanceNow",
	toMs: f
}, b = globalThis.process?.hrtime?.bigint.bind(globalThis.process?.hrtime) ?? (() => {
	throw Error("hrtime.bigint() is not supported in this JS environment");
}), x = () => u(b()), S = {
	fn: b,
	fromMs: p,
	name: "hrtimeNow",
	toMs: u
}, C = globalThis.Bun?.nanoseconds, w = C ? {
	fn: C,
	fromMs: d,
	name: "bunNanoseconds",
	toMs: u
} : void 0;
function T(e) {
	return {
		fn: e,
		fromMs: f,
		name: "custom",
		toMs: f
	};
}
const ee = (e = g) => e === "bun" ? w : e === "deno" ? y : e === "node" ? S : y, E = (e) => {
	switch (typeof e) {
		case "function": return T(e);
		case "string": switch (e) {
			case "auto": return ee();
			case "bunNanoseconds": return w ?? y;
			case "hrtimeNow": return S;
			default: return y;
		}
		case "object": return e === null ? y : (c(D(e), "Invalid Timestamp Provider object"), e);
		case "undefined": return y;
		default: throw Error("Invalid value for 'timestampProvider' or 'now'");
	}
};
function D(e) {
	return typeof e == "object" && !!e && typeof e.fn == "function" && typeof e.name == "string" && typeof e.toMs == "function" && typeof e.fromMs == "function";
}
// src/concurrency.ts
const O = async (e) => {
	let { fn: t, iterations: n, limit: r, signal: i, time: a = 0, timestampProvider: o = y } = e, s = n === 0 ? r : Math.max(0, Math.min(r, n)), c = [], u = [], d = !0, f = 0, p = Number.isFinite(a) && a > 0, m = n > 0, h = 0, g = o.fn, _ = m ? p ? () => d && f++ < n && (g() < h || (d = !1)) : () => d && f++ < n : p ? () => d && (g() < h || (d = !1)) : () => d, v = (e) => {
		d && u.push(e);
	}, b = (e) => {
		c.push(l(e));
	}, x = () => d = !1, S = Array.isArray(i) ? i : i ? [i] : [];
	if (S.some((e) => e.aborted)) return [];
	for (let e of S) e.addEventListener("abort", x);
	let C = async () => {
		for (; _();) try {
			v(await t());
		} catch (e) {
			d = !1, b(e);
			break;
		}
	};
	try {
		p && (h = g() + o.fromMs(a));
		let e = Array.from({ length: s }, () => C());
		await Promise.allSettled(e);
	} finally {
		for (let e of S) e.removeEventListener("abort", x);
	}
	if (c.length === 0) return u;
	throw c.length === 1 ? c[0] : AggregateError(c, "Multiple errors occurred during concurrent execution");
}, k = (e, t = 5, n = 2) => {
	if (e === 1e400) return "+∞";
	if (e === -1e400) return "-∞";
	if (e !== e) return "NaN";
	let r = Math.abs(e);
	if (r >= 10 ** t) return e.toFixed();
	if (r < 10 ** (t - n)) return e.toFixed(n);
	let i = Math.min(Math.max(0, t - (Math.floor(Math.log10(r)) + 1)), n);
	return e.toFixed(i);
}, te = (e) => {
	let t = e.result.state;
	return {
		"Task name": e.name,
		...t === "aborted-with-statistics" || t === "completed" ? {
			"Latency avg (ns)": `${k(d(e.result.latency.mean))} \xb1 ${k(e.result.latency.rme)}%`,
			"Latency med (ns)": `${k(d(e.result.latency.p50))} \xb1 ${k(d(e.result.latency.mad))}`,
			"Throughput avg (ops/s)": `${Math.round(e.result.throughput.mean).toString()} \xb1 ${k(e.result.throughput.rme)}%`,
			"Throughput med (ops/s)": `${Math.round(e.result.throughput.p50).toString()} \xb1 ${Math.round(e.result.throughput.mad).toString()}`,
			Samples: e.result.latency.samplesCount
		} : t === "errored" ? {
			Error: e.result.error.message,
			Stack: e.result.error.stack ?? "N/A"
		} : {
			"Latency avg (ns)": "N/A",
			"Latency med (ns)": "N/A",
			"Throughput avg (ops/s)": "N/A",
			"Throughput med (ops/s)": "N/A",
			Samples: "N/A",
			Remarks: t
		},
		...t === "aborted-with-statistics" && { Remarks: t }
	};
}, [ne, ...A] = [
	.9999999999998099,
	676.5203681218851,
	-1259.1392167224028,
	771.3234287776531,
	-176.6150291621406,
	12.507343278686905,
	-.13857109526572012,
	9984369578019572e-21,
	1.5056327351493116e-7
], j = (e) => {
	let t = ne;
	for (let n = 0; n < A.length; n++) t += A[n] / (e + n);
	return .5 * Math.log(2 * Math.PI) + (e - .5) * Math.log(e + 6.5) - (e + 6.5) + Math.log(t);
}, M = (e, t, n) => {
	let r = e + t, i = e + 1, a = e - 1, o = 1, s = 1 - r * n / i;
	Math.abs(s) < 1e-300 && (s = 1e-300), s = 1 / s;
	let c = s;
	for (let l = 1; l <= 300; l++) {
		let u = 2 * l, d = l * (t - l) * n / ((a + u) * (e + u));
		s = 1 + d * s, Math.abs(s) < 1e-300 && (s = 1e-300), o = 1 + d / o, Math.abs(o) < 1e-300 && (o = 1e-300), s = 1 / s, c *= s * o, d = -(e + l) * (r + l) * n / ((e + u) * (i + u)), s = 1 + d * s, Math.abs(s) < 1e-300 && (s = 1e-300), o = 1 + d / o, Math.abs(o) < 1e-300 && (o = 1e-300), s = 1 / s;
		let f = s * o;
		if (c *= f, Math.abs(f - 1) < 1e-16) break;
	}
	return c;
}, N = (e) => {
	let t = e > 0 ? e : 1, n = t / 2, r = .5, i = n < 12 ? j(n + .5) - j(n) : .5 * Math.log(n) - 1 / (8 * n) + 1 / (192 * n ** 3) - 1 / (640 * n ** 5) + .00118582565234835 / n ** 7 - .00167977198469943 / n ** 9 + .00342404392538552 / n ** 11, a = .5 * Math.log(Math.PI), o = i - .5 * Math.log(t * Math.PI), s = (e) => {
		let o = e * e, s = o / (t + o), c = Math.exp(i - a + n * Math.log1p(-s) + r * Math.log(s));
		return s <= .5 ? 1 - c * M(r, n, s) / r : c * M(n, r, 1 - s) / n;
	}, c = (e) => o - (t + 1) / 2 * Math.log1p(e * e / t), l = 1.959963984540054;
	for (let e = 0; e < 30; e++) {
		let e = Math.exp(-c(l)), t = .5 * (s(l) - .05) * e;
		if (!Number.isFinite(t)) break;
		let n = l + t;
		if (!(n > 0)) break;
		let r = Math.abs(t);
		if (l = n, r <= 4e-16 * e) break;
	}
	return l;
}, P = (e) => Array.isArray(e) && e.length !== 0;
function F(e) {
	let t = e.length;
	if (t < 1024) {
		e.sort(z);
		return;
	}
	let n = !0, r = !0, i = e[0];
	for (let a = 0; a < t; a++) {
		let t = e[a];
		if (!Number.isFinite(t) || Object.is(t, -0)) {
			e.sort(z);
			return;
		}
		(n || r) && (n &&= t >= i, r &&= t <= i, i = t);
	}
	if (n) return;
	if (r) {
		e.reverse();
		return;
	}
	let a = new Float64Array(e).sort();
	for (let n = 0; n < t; n++) e[n] = a[n];
}
const I = (e) => {
	let t = e.length;
	if (t === 1) return {
		mean: e[0],
		vr: 0
	};
	let n = 0, r = 0, i = 0;
	for (; i < t;) {
		let t = e[i++], a = t - n;
		n += a / i, r += a * (t - n);
	}
	return {
		mean: n,
		vr: r / (t - 1)
	};
}, L = (e, t) => {
	let n = e + t;
	return Number.isFinite(n) ? n / 2 : e / 2 + t / 2;
}, R = (e, t) => {
	let n = (e.length - 1) * t, r = Math.floor(n), i = e[r];
	if (n === r) return i;
	let a = e[r + 1];
	if (i === a) return i;
	let o = n - r;
	if (o === .5) return L(i, a);
	let s = a - i;
	return Number.isFinite(s) ? i + o * s : (1 - o) * i + o * a;
}, z = (e, t) => e - t, re = (e, t) => {
	let n = 0, r = e.length, i = 0;
	for (; i < r;) n += (Math.abs(e[i++] - t) - n) / i;
	return n;
};
function B(e, t) {
	let n = e.length;
	if (n === 1) return 0;
	let r = n >> 1, i = n + 1 >> 1, a = 0, o = r, s, c, l, u, d, f;
	for (; a <= o;) {
		if (s = a + o >> 1, c = i - s, l = s === 0 ? -1e400 : t - e[r - s], d = s === r ? 1e400 : t - e[r - s - 1], u = c === 0 ? -1e400 : e[r + c - 1] - t, f = c === n - r ? 1e400 : e[r + c] - t, l <= f && u <= d) return n & 1 ? Math.max(l, u) : L(Math.max(l, u), Math.min(d, f));
		l > f ? o = s - 1 : a = s + 1;
	}
	return 0;
}
const V = (e) => B(e, R(e, .5));
function H(e, t = !1) {
	let { mean: n, vr: r } = I(e), i = Math.sqrt(r), a = i / Math.sqrt(e.length), o = e.length - 1, s = N(o), c = a * s, l = n === 0 ? 1e400 : c / Math.abs(n) * 100, u = R(e, .5);
	return {
		aad: re(e, n),
		critical: s,
		df: o,
		mad: B(e, u),
		max: e[o],
		mean: n,
		min: e[0],
		moe: c,
		p50: u,
		p75: R(e, .75),
		p99: R(e, .99),
		p995: R(e, .995),
		p999: R(e, .999),
		rme: l,
		samples: t ? e : void 0,
		samplesCount: e.length,
		sd: i,
		sem: a,
		variance: r
	};
}
// src/timer-diagnostics.ts
const U = (e, t) => {
	let n = e.length;
	if (n < 10) return;
	let r = 0;
	for (let t of e) t === 0 && r++;
	if (r * 2 > n) return "zero-dominated";
	let i = Math.max(3, Math.min(10, Math.floor(n / 1e3))), a = 1;
	for (let t = 1; t < n && !(e[t] !== e[t - 1] && (a++, a >= i)); t++);
	if (a < i) return "low-distinct";
	if (n > 100 && t === 0) return "zero-mad";
}, ie = (e, t) => U(e, t) !== void 0, W = (e) => {
	let t;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (!(r <= 0) && (t ??= r, e[n + 1] === r)) return r;
	}
	return t;
}, G = (e, t = {}) => {
	let { estimator: n = "median", pairs: r = 1024, warmupPairs: i = 64 } = t, { fn: a, toMs: o } = e;
	if (!Number.isInteger(r) || r <= 0) return 0;
	if (Number.isInteger(i) && i > 0) for (let e = 0; e < i; e++) {
		let e = a();
		o(a() - e);
	}
	let s = [];
	for (let e = 0; e < r; e++) {
		let e = a(), t = o(a() - e);
		t > 0 && s.push(t);
	}
	return s.length * 2 < r ? 0 : (s.sort(z), n === "min" ? s[0] : R(s, n === "p05" ? .05 : .5));
}, ae = [
	"afterAll",
	"beforeAll",
	"beforeEach",
	"afterEach"
], K = (e, t) => {
	let n = r(e);
	n && i(e), c(!n, t);
}, oe = ["not-started", "started"], q = { state: "not-started" }, J = { state: "aborted" }, se = { state: "started" };
var Y = class extends EventTarget {
	get detectedResolution() {
		return this.#r;
	}
	get name() {
		return this.#o;
	}
	get result() {
		return {
			...this.#s,
			runtime: this.#n.runtime,
			runtimeVersion: this.#n.runtimeVersion,
			timestampProviderName: this.#n.timestampProvider.name
		};
	}
	get runs() {
		return this.#l;
	}
	#e = !1;
	#t;
	#n;
	#r = void 0;
	#i;
	#a;
	#o;
	#s = q;
	#c;
	#l = 0;
	#u;
	#d;
	#f;
	#p;
	constructor(e, t, n, r = {}) {
		super(), this.#n = e, this.#o = t, this.#i = n, this.#a = r, this.#t = r.async ?? s(n), this.#u = r.signal, this.#c = r.retainSamples ?? e.retainSamples, this.#f = e.timestampProvider, this.#d = e.timestampProvider.fn, this.#p = e.timestampProvider.toMs;
		for (let e of ae) this.#a[e] != null && c(typeof this.#a[e] == "function", `'${e}' must be a function if provided`);
		this.reset(!1), this.#u && (this.#u.aborted ? this.#v() : this.#u.addEventListener("abort", this.#v.bind(this), { once: !0 })), this.#n.signal && (this.#n.signal.aborted ? this.#v() : this.#n.signal.addEventListener("abort", this.#v.bind(this), { once: !0 }));
	}
	reset(e = !0) {
		this.#l = 0, this.#r = void 0, this.#s = this.#e ? J : q, e && this.dispatchEvent(new n("reset", this));
	}
	async run() {
		if (this.#s.state !== "not-started") return this;
		this.#s = { state: "started" }, this.dispatchEvent(new n("start", this)), await this.#n.setup(this, "run");
		let { error: e, overriddenIndices: t, samples: r } = await this.#m("run", this.#n.time, this.#n.iterations);
		return await this.#n.teardown(this, "run"), this.#b({
			error: e,
			latencySamples: r,
			overriddenIndices: t
		}), this;
	}
	runSync() {
		if (this.#s.state !== "not-started") return this;
		c(this.#n.concurrency === null, "Cannot use `concurrency` option when using `runSync`"), this.#s = se, this.dispatchEvent(new n("start", this)), K(this.#n.setup(this, "run"), "`setup` function must be sync when using `runSync()`");
		let { error: e, overriddenIndices: t, samples: r } = this.#h("run", this.#n.time, this.#n.iterations);
		return K(this.#n.teardown(this, "run"), "`teardown` function must be sync when using `runSync()`"), this.#b({
			error: e,
			latencySamples: r,
			overriddenIndices: t
		}), this;
	}
	async warmup() {
		if (this.#s.state !== "not-started") return;
		this.dispatchEvent(new n("warmup", this)), await this.#n.setup(this, "warmup");
		let { error: e } = await this.#m("warmup", this.#n.warmupTime, this.#n.warmupIterations);
		await this.#n.teardown(this, "warmup"), this.#y(e);
	}
	warmupSync() {
		if (this.#s.state !== "not-started") return;
		this.dispatchEvent(new n("warmup", this)), K(this.#n.setup(this, "warmup"), "`setup` function must be sync when using `runSync()`");
		let { error: e } = this.#h("warmup", this.#n.warmupTime, this.#n.warmupIterations);
		K(this.#n.teardown(this, "warmup"), "`teardown` function must be sync when using `runSync()`"), this.#y(e);
	}
	async #m(e, t, n) {
		try {
			this.#a.beforeAll && await this.#a.beforeAll.call(this, e);
			let r = this.#n.concurrency !== "task", i = 0, a = [], o = new Set(), s = async () => {
				if (!this.#e) try {
					this.#a.beforeEach != null && await this.#a.beforeEach.call(this, e);
					let { iterationCost: t, overridden: n, taskTime: s } = this.#t ? await this.#g(r) : this.#_(r), c = a.push(s) - 1;
					n && o.add(c), r && (i += t ?? s);
				} finally {
					this.#a.afterEach != null && await this.#a.afterEach.call(this, e);
				}
			};
			try {
				if (!r) await O({
					fn: s,
					iterations: n,
					limit: Math.max(1, Math.floor(this.#n.threshold)),
					signal: [this.#u, this.#n.signal].filter((e) => e != null),
					time: t,
					timestampProvider: this.#f
				}), this.#l = a.length;
				else for (; (i < t || a.length < n) && !this.#e;) await s();
			} finally {
				this.#a.afterAll != null && await this.#a.afterAll.call(this, e);
			}
			return P(a) ? {
				overriddenIndices: o,
				samples: a
			} : {};
		} catch (e) {
			return { error: l(e) };
		}
	}
	#h(e, t, n) {
		try {
			this.#a.beforeAll && K(this.#a.beforeAll.call(this, e), "`beforeAll` function must be sync when using `runSync()`");
			let r = 0, i = [], a = new Set(), o = () => {
				if (!this.#e) try {
					this.#a.beforeEach && K(this.#a.beforeEach.call(this, e), "`beforeEach` function must be sync when using `runSync()`");
					let { iterationCost: t, overridden: n, taskTime: o } = this.#_(!0), s = i.push(o) - 1;
					n && a.add(s), r += t ?? o;
				} finally {
					this.#a.afterEach && K(this.#a.afterEach.call(this, e), "`afterEach` function must be sync when using `runSync()`");
				}
			};
			try {
				for (; (r < t || i.length < n) && !this.#e;) o();
			} finally {
				this.#a.afterAll && K(this.#a.afterAll.call(this, e), "`afterAll` function must be sync when using `runSync()`");
			}
			return P(i) ? {
				overriddenIndices: a,
				samples: i
			} : {};
		} catch (e) {
			return { error: l(e) };
		}
	}
	async #g(e) {
		let t = this.#d(), n = await this.#i.call(this), r = this.#p(this.#d() - t), i = e ? Q(n) : void 0, a = Z(n);
		return a === void 0 ? {
			iterationCost: i,
			overridden: !1,
			taskTime: r
		} : {
			iterationCost: i,
			overridden: !0,
			taskTime: a
		};
	}
	#_(e) {
		let t = this.#d(), n = this.#i.call(this), r = this.#p(this.#d() - t);
		K(n, "task function must be sync when using `runSync()`");
		let i = e ? Q(n) : void 0, a = Z(n);
		return a === void 0 ? {
			iterationCost: i,
			overridden: !1,
			taskTime: r
		} : {
			iterationCost: i,
			overridden: !0,
			taskTime: a
		};
	}
	#v() {
		if (this.#e = !0, oe.includes(this.#s.state)) {
			this.#s = J;
			let e = new n("abort", this);
			this.dispatchEvent(e), this.#n.dispatchEvent(e);
		}
	}
	#y(e) {
		if (e) {
			this.#s = {
				state: "errored",
				error: e
			};
			let t = new n("error", this, e);
			if (this.dispatchEvent(t), this.#n.dispatchEvent(t), this.#n.throws) throw e;
		}
	}
	#b({ error: e, latencySamples: t, overriddenIndices: r }) {
		if (P(t)) {
			this.#l = t.length;
			let e = this.#n.timerOverhead;
			if (e !== void 0 && e > 0) for (let n = 0; n < t.length; n++) r?.has(n) || (t[n] = Math.max(0, t[n] - e));
			let i = (r?.size ?? 0) > 0, a = i ? t.filter((e, t) => !r?.has(t)) : t;
			F(t);
			let o = H(t, this.#c), s;
			i ? P(a) ? (F(a), this.#r = W(a), s = U(a, V(a))) : this.#r = void 0 : (this.#r = W(t), s = U(t, o.mad));
			let c = o.mean, l = 0, u = [];
			for (let e of t) e === 0 ? u.push(c === 0 ? 0 : 1e3 / c) : (l += e, u.push(1e3 / e));
			F(u);
			let d = H(u, this.#c);
			if (this.#s = {
				state: this.#e ? "aborted-with-statistics" : "completed",
				latency: o,
				period: l / this.runs,
				throughput: d,
				totalTime: l
			}, s !== void 0) {
				let e = new n("warning", this, s);
				this.dispatchEvent(e), this.#n.dispatchEvent(e);
			}
		} else this.#e && (this.#s = J);
		if (e) {
			this.#s = {
				state: "errored",
				error: e
			};
			let t = new n("error", this, e);
			if (this.dispatchEvent(t), this.#n.dispatchEvent(t), this.#n.throws) throw e;
		}
		let i = new n("cycle", this);
		this.dispatchEvent(i), this.#n.dispatchEvent(i), this.dispatchEvent(new n("complete", this));
	}
};
const X = (e) => typeof e == "number" && Number.isFinite(e) && e >= 0;
function Z(e) {
	if (typeof e != "object" || !e) return;
	let t = e;
	if (!("overriddenDuration" in t)) return;
	let n = t.overriddenDuration;
	if (typeof n != "number") try {
		r(n) && i(n);
	} catch {}
	else return X(n) ? n : void 0;
}
function Q(e) {
	if (typeof e != "object" || !e) return;
	let t = e;
	try {
		if (!("overriddenIterationCost" in t)) return;
		let e = t.overriddenIterationCost;
		return typeof e != "number" && r(e) && i(e), X(e) ? e : void 0;
	} catch {
		return;
	}
}
// src/bench.ts
const $ = "`subtractTimerOverhead` cannot be used with `concurrency: \"task\"` — set `concurrency` to `null` or `\"bench\"`, or disable `subtractTimerOverhead`";
var ce = class extends EventTarget {
	concurrency;
	iterations;
	name;
	now;
	retainSamples;
	runtime;
	runtimeVersion;
	setup;
	signal;
	subtractTimerOverhead;
	teardown;
	threshold;
	throws;
	time;
	timerOverhead;
	timestampProvider;
	warmup;
	warmupIterations;
	warmupTime;
	get results() {
		return this.tasks.map((e) => e.result);
	}
	get tasks() {
		return [...this.#e.values()];
	}
	#e = new Map();
	constructor(t = {}) {
		super();
		let { name: r, ...i } = t;
		this.name = r, this.runtime = g, this.runtimeVersion = _, this.concurrency = i.concurrency ?? null, this.threshold = i.threshold ?? 1e400, this.time = i.time ?? 1e3, this.iterations = i.iterations ?? 64, c(i.now === void 0 || i.timestampProvider === void 0, "Cannot set both `now` and `timestampProvider` options"), this.timestampProvider = E(i.now ?? i.timestampProvider), this.now = () => this.timestampProvider.toMs(this.timestampProvider.fn()), this.warmup = i.warmup ?? !0, this.warmupIterations = i.warmupIterations ?? 16, this.warmupTime = i.warmupTime ?? 250, this.setup = i.setup ?? e, this.teardown = i.teardown ?? e, this.throws = i.throws ?? !1, i.signal != null && (this.signal = i.signal), this.retainSamples = i.retainSamples === !0, this.subtractTimerOverhead = i.subtractTimerOverhead === !0, c(!(this.subtractTimerOverhead && this.concurrency === "task"), $);
		let a = this.subtractTimerOverhead ? G(this.timestampProvider) : void 0;
		a != null && (this.timerOverhead = a), this.signal && this.signal.addEventListener("abort", () => {
			this.dispatchEvent(new n("abort"));
		}, { once: !0 });
	}
	add(e, t, r = {}) {
		if (this.#e.has(e)) throw Error(`Task "${e}" already exists`);
		{
			let i = new Y(this, e, t, r);
			this.#e.set(e, i), this.dispatchEvent(new n("add", i));
		}
		return this;
	}
	getTask(e) {
		return this.#e.get(e);
	}
	remove(e) {
		let t = this.getTask(e);
		return t && (this.#e.delete(e), this.dispatchEvent(new n("remove", t))), this;
	}
	reset() {
		for (let e of this.#e.values()) e.reset();
		this.dispatchEvent(new n("reset"));
	}
	async run() {
		c(!(this.subtractTimerOverhead && this.concurrency === "task"), $), this.warmup && await this.#t(), this.dispatchEvent(new n("start"));
		let e = [];
		if (this.concurrency === "bench") {
			let t = [];
			for (let e of this.#e.values()) t.push(e.run());
			e = await Promise.all(t);
		} else for (let t of this.#e.values()) e.push(await t.run());
		return this.dispatchEvent(new n("complete")), e;
	}
	runSync() {
		c(this.concurrency === null, "Cannot use `concurrency` option when using `runSync`"), this.warmup && this.#n();
		let e = [];
		this.dispatchEvent(new n("start"));
		for (let t of this.#e.values()) e.push(t.runSync());
		return this.dispatchEvent(new n("complete")), e;
	}
	table(e = te) {
		return this.tasks.map(e);
	}
	async #t() {
		if (this.dispatchEvent(new n("warmup")), this.concurrency === "bench") {
			let e = [];
			for (let t of this.#e.values()) e.push(t.warmup());
			await Promise.all(e);
		} else for (let e of this.#e.values()) await e.warmup();
	}
	#n() {
		this.dispatchEvent(new n("warmup"));
		for (let e of this.#e.values()) e.warmupSync();
	}
};
export { ce as Bench, Y as Task, G as calibrateTimerOverhead, U as classifyTimerSaturation, ie as detectTimerSaturation, W as estimateResolution, k as formatNumber, x as hrtimeNow, S as hrtimeNowTimestampProvider, d as mToNs, V as medianAbsoluteDeviation, u as nToMs, v as now, y as performanceNowTimestampProvider };
