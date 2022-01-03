/**
 * @param {{isFiltered: Boolean?, hostname: String, connections: {hostname: String}[]}} server
 * @param {String} searchValue
 **/
export function filterItem (server, searchValue) {
	server.isFiltered = searchValue && !server.hostname.toLowerCase().match(searchValue.toLowerCase())
	server.connections.map(((connection) => filterItem(connection, searchValue)))
	return server
}


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
