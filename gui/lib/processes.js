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
 * @param {NS} ns
 * @param {{ filename: String, args: String[], hosts: String[] }} process
 * @return {{duration: Number, isSleeping: Boolean, timeRunning: Number}|null}
 */
export const getProcessExpiryDetails = (ns, { filename, hosts, args }) => {
	const logs = ns.getScriptLogs(filename, hosts[0], ...args)
	let i = logs.length
	let log
	const { onlineRunningTime, offlineRunningTime } = ns.getRunningScript(filename, hosts[0], ...args)
	const timeRunning = onlineRunningTime + offlineRunningTime
	const pattern = new RegExp(/^sleep:.+?([\d.]+)/)
	const duration = logs.reduce((total, logOutput) => {
		const match = logOutput.match(pattern)
		return total + (!!match ? Number(match[1]) : 0)
	}, 0) / 1000
	const returnValue = {
		duration,
		timeRunning,
		isSleeping: true,
	}

	while (!log && i--) {
		if (logs[i].indexOf(": Executing") !== -1) {
			log = logs[i]
		}
	}

	if (log) {
		returnValue.isSleeping = false

		const time = log.match(/([0-9.])+ /g).map(Number).reverse()
		const multipliers = [1, 60, 3_600, 86_400]
		for (let i = 0; i < time.length; ++i) {
			returnValue.duration += time[i] * multipliers[i]
		}
	}

	return returnValue
}
