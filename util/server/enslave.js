import { getHackableServers } from "/lib/servers.js"


/**
 * Pass a payload as argument #1 to have it copied to all hackable servers and directed at argument #2
 * @param {NS} ns
 **/
export async function main (ns) {
	const payload = ns.args[0]
	const scriptRamRequirements = ns.getScriptRam(payload)

	for (const server of getHackableServers(ns, true)) {
		const maxThreads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / scriptRamRequirements)

		if (maxThreads > 0) {
			await ns.scp(payload, server)
			ns.exec(payload, server, maxThreads, ns.args[1])
		}
	}
}
