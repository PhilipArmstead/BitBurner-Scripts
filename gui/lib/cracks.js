/** @param {NS} ns */
export const getCracksOwned = (ns) => [
	"BruteSSH.exe",
	"SQLInject.exe",
	"HTTPWorm.exe",
	"FTPCrack.exe",
	"relaySMTP.exe",
].filter(crack => ns.fileExists(crack))


/**
 * @param {{numOpenPortsRequired: Number }} server
 * @param {String[]} cracksOwned
 * @return {Boolean}
 */
export const canRootServer = ({ numOpenPortsRequired }, cracksOwned) => {
	return cracksOwned.length >= numOpenPortsRequired
}
