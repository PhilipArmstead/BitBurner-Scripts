import { getRootedServers } from "/gui/lib/servers.js"


/**
 * @param {NS} ns
 * @return {[String, {filename: String, threads: Number, args: String[], pid: Number}[]][]}
 */
export const getRunningProcesses = (ns) =>
	getRootedServers(ns)
		.filter((server) => ns.getServerUsedRam(server))
		.map((server) => ([server, ns.ps(server)]))


/**
 * @param{[String, {filename: String, threads: Number, args: String[], pid: Number}[]][]} processes
 * @param {String} process
 * @param {String[]} args
 * @return {Boolean}
 */
export const isProcessRunning = (processes, process, args) => {
	for (const [, tasks] of processes) {
		if (tasks.findIndex(({ filename, args: a }) => filename === process && JSON.stringify(args) === JSON.stringify((a))) !== -1) {
			return true
		}
	}

	return false
}
