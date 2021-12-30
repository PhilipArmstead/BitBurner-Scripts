/**
 * @param {NS} ns
 * @param {String} host
 * @param {Number?} targetBalance
 * @return Boolean
 **/
export const getThreadsRequiredForGrowing = (ns, host, targetBalance = ns.getServerMaxMoney(host)) =>
	Math.ceil(ns.growthAnalyze(host, targetBalance / Math.max(ns.getServerMoneyAvailable(host), 1)))


/**
 * @param {NS} ns
 * @param {String} host
 * @param {Number?} targetBalance
 * @return Boolean
 **/
export const getThreadsRequiredForHacking = (ns, host, targetAmount = ns.getServerMaxMoney(host) * 0.25) =>
	Math.ceil(ns.hackAnalyzeThreads(host, targetAmount))


/**
 * @param {NS} ns
 * @param {String} host
 * @param {Number?} targetSecurityLevel
 * @return Boolean
 **/
export const getThreadsRequiredForWeakening = (ns, host, targetSecurityLevel = ns.getServerMinSecurityLevel(host)) => {
	return Math.ceil((
		ns.getServerSecurityLevel(host) - Math.max(targetSecurityLevel, ns.getServerMinSecurityLevel(host))
	) / ns.weakenAnalyze(1))
}
