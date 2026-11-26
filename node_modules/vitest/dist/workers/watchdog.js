process.title = "vitest-watchdog";
const pids = /* @__PURE__ */ new Set();
// Ctrl+C and closing the terminal signal the whole process group, but the
// watchdog must outlive the main process to clean up after it
for (const signal of [
	"SIGINT",
	"SIGTERM",
	"SIGHUP"
]) process.on(signal, () => {});
process.on("message", (message) => {
	if (message.type === "watch") pids.add(message.pid);
	else if (message.type === "unwatch") pids.delete(message.pid);
});
// Workers blocked on synchronous code cannot notice the main process dying
process.on("disconnect", () => {
	for (const pid of pids) try {
		process.kill(pid, "SIGKILL");
	} catch {}
	process.exit();
});
