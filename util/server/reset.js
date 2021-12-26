import { getHackableServers } from "/lib/servers.js"


/**
 * Kill all scripts on all hackable servers
 * @param {NS} ns
 **/
export const main = async (ns) => {
	for (const server of getHackableServers(ns, true)) {
		ns.killall(server)
	}
}
