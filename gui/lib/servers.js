/**
 * @param {NS} ns
 * @param {Object} tree
 * @param {Set} found
 * @param {String?} host
 **/
const scan = (ns, tree, found, host = "home") => {
	found.add(host)

	const targets = ns.scan(host).filter((server, i) => i || host === "home")

	if (targets.length) {
		tree.connections = {}
	}

	targets.forEach((server) => {
		tree.connections[server] = {}

		if (!found.has(server)) {
			scan(ns, tree.connections[server], found, server)
		} else {
			tree.connections[server].duplicate = true
		}
	})
}


/**
 * @param {NS} ns
 * @return {{ tree: Object, found: Set }} results
 **/
const runScan = (ns) => {
	const found = new Set()
	const tree = {}
	scan(ns, tree, found)

	return { tree, found }
}


/**
 * @param {NS} ns
 * @param {Number} threadsRequired
 * @param {String} script
 * @return {{servers: {host: String, threadCount: Number}[], isPartial: Boolean}}
 **/
export const getServersWithThreadCapacity = (ns, threadsRequired, script) => {
	const servers = []
	const scriptSize = ns.getScriptRam(script)
	const targets = getRootedServers(ns)
		.filter((server) => server !== "home")
		.filter((server) => ns.getServerMaxRam(server) - ns.getServerUsedRam(server) > 0)
	let target
	let i = 0

	// Create a list of all servers which can handle this task by itself
	const capableservers = targets.filter((server) =>
		Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / scriptSize) >= threadsRequired)

	if (capableservers.length) {
		// And return the smallest
		capableservers.sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b))
		servers.push({ host: capableservers[0], threadCount: threadsRequired })
		threadsRequired = 0
	} else {
		// Otherwise split the job across multiple servers
		while (threadsRequired > 0 && (target = targets[i++])) {
			const threadsAvailable = Math.floor((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / scriptSize)

			if (threadsAvailable > 0) {
				const threadsUsed = Math.min(threadsAvailable, threadsRequired)
				servers.push({ host: target, threadCount: threadsUsed })
				threadsRequired -= threadsUsed
			}
		}
	}

	return { servers, isPartial: threadsRequired > 0 }
}


/**
 * @param {NS} ns
 * @param {Function} fn
 **/
export const serversForEach = (ns, fn) => {
	const servers = getServers(ns)

	/**
	 * @param {[String, Object]} entry
	 * @param {String[]} ancestors
	 **/
	const serverIterator = ([hostname, server], ancestors = []) => {
		fn([hostname, server], ancestors)

		if (typeof server.connections == "object") {
			Object.entries(server.connections).forEach((entry) => serverIterator(entry, [...ancestors, hostname]))
		}
	}

	Object.entries(servers.connections).forEach((entry) => serverIterator(entry))
}


/**
 * @param {NS} ns
 * @param {{host: String, threadCount: Number}[]} slaves
 * @param {String} payload
 * @param {String[]?} args
 * @return {Boolean}
 */
export const deployPayloadToSlaves = async (ns, slaves, payload, args = []) => {
	for (const { host, threadCount } of slaves) {
		if (threadCount < 1) {
			return false
		}

		await ns.scp(payload, host)
		ns.exec(payload, host, threadCount, ...args)
	}

	return true
}


/**
 * @param {NS} ns
 * @param {Boolean?} includePurchased
 * @return {String[]}
 **/
export const getHackableServers = (ns, includePurchased = false) => {
	const hackingLevel = ns.getHackingLevel()
	const purchasedServers = ns.getPurchasedServers()

	const servers = getRootedServers(ns)
		.filter((server) => server !== "home")
		.filter((server) => ns.getServerRequiredHackingLevel(server) <= hackingLevel)

	return includePurchased ? servers : servers.filter((server) => !purchasedServers.includes(server))
}


/**
 * @param {NS} ns
 * @return {String[]}
 **/
export const getRootedServers = (ns) => getServersFlattened(ns).filter((server) => ns.hasRootAccess(server))


/**
 * @param {NS} ns
 * @return {Object[]}
 **/
export const getServers = (ns) => runScan(ns).tree


/**
 * @param {NS} ns
 * @return {String[]}
 **/
export const getServersFlattened = (ns) => [...runScan(ns).found.values()]
