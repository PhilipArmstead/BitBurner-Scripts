import { Window } from "/gui/lib/Window.js"
import { icons } from "/gui/lib/constants.js"
import { getServers } from "/lib/servers.js"


/** @param {NS} ns **/
export async function main (ns) {
	const rootElement = globalThis["document"].createElement("div")
	rootElement.classList.add("server-list__container")
	rootElement.insertAdjacentHTML("beforeend", `
		<ul class="server-list"></ul>
		<button class="server-list__refresh">Refresh</button>
		<input class="server-list__search-input" placeholder="Search" />
	`)

	populateServers(ns, rootElement)
}


/**
 * @param {NS} ns
 * @param {HTMLElement} rootElement
 **/
const populateServers = (ns, rootElement) => {
	const servers = getServers(ns)
	addServersToDocument(ns, servers.connections, rootElement.firstElementChild, ["home"])

	const win = new Window("Server list", { theme: "terminal", content: rootElement.outerHTML })
	addEventListenersToListItems(ns, win.element)
}


/**
 * @param {NS} ns
 * @param {{connections: Object[]}} servers
 * @param {HTMLElement} fragment
 * @param {String[]} ancestors
 **/
const addServersToDocument = (ns, servers, fragment, ancestors) => {
	Object.entries(servers).forEach(([hostname, { connections }]) => {
		const listItem = renderServerAsListItem(ns, hostname, ancestors)

		fragment.appendChild(listItem)

		if (connections && Object.keys(connections).length) {
			addServersToDocument(ns, connections, listItem.querySelector("ul"), [...ancestors, hostname])
		}
	})
}


/**
 * @param {NS} ns
 * @param {String} hostname
 * @param {String[]} ancestors
 * @return {HTMLLIElement}
 **/
const renderServerAsListItem = (ns, hostname, ancestors) => {
	const server = ns.getServer(hostname)
	const contractCount = ns.ls(hostname, ".cct").length
	const { hasBackdoorClass, hasBackdoorTitle, hasRootClass, hasRootTitle } = getServerIsCompromisedStatus(ns, server)

	const listItem = globalThis["document"].createElement("li")
	listItem.classList.add("server")
	listItem.dataset.server = hostname
	listItem.dataset.ancestors = ancestors.join(",")
	listItem.insertAdjacentHTML("beforeend", `
		<span class="server__item">
		${!server.purchasedByPlayer ? `
			<button class="icon icon--hacked${hasRootClass}" ${hasRootTitle ? `title="${hasRootTitle}"` : ""}>${icons.hacked}</button>
			<button class="icon icon--backdoored${hasBackdoorClass}" ${hasBackdoorTitle ?
		`title="${hasBackdoorTitle}"` :
		""}>${icons.backdoored}</button>
			` : ""}
			<button class="server__connect">${server.hostname}</button>
			${contractCount ?
		`<span class="server__contract-count"><span class="icon icon--contract">${icons.contract}</span> x${contractCount}</span>` :
		""}
		</span>
		<ul class="server__children"></ul>
	`)

	return listItem
}


/**
 * @param {NS} ns
 * @param {HTMLElement} container
 **/
const addEventListenersToListItems = (ns, container) => {
	addRefreshListener(container)
	addSearchListener(container)

	Array.from(container.querySelectorAll(".server")).forEach((server) => {
		const ancestors = server.dataset.ancestors.split(",")

		addConnectListener(server, ancestors)
		addHackListener(ns, server, ancestors, getCracksOwned(ns))
		addBackdoorListener(server, ancestors)
	})
}


/**
 * @param {HTMLElement} server
 * @param {String[]} ancestors
 **/
const getConnectionCommand = (server, ancestors) => ([
	"home; ",
	...ancestors.slice(1).map((node) => `connect ${node}; `),
	`connect ${server.dataset.server}; `,
]).join("")


/**
 * @param {HTMLElement} container
 **/
const addRefreshListener = (container) => {
	container.querySelector(".server-list__refresh").addEventListener("click", () => {
		inputTerminalCommand("home; run /gui/server-list.js")
		container.remove()
	})
}


/**
 * @param {HTMLElement} container
 **/
const addSearchListener = (container) => {
	const search = container.querySelector(".server-list__search-input")
	const terminalInput = globalThis["document"].getElementById("terminal-input")
	const className = "input--focused"

	search.addEventListener("focus", () => {
		search.classList.add(className)
		search.setAttribute("type", "search")
		terminalInput.setAttribute("disabled", "disabled")
	})
	search.addEventListener("blur", () => {
		search.classList.remove(className)
		terminalInput.removeAttribute("disabled")

		if (!search.value.trim()) {
			search.removeAttribute("type")
		}
	})
	search.addEventListener("input", () => {
		filterServers(container, search.value.trim())
	})
}


/**
 * @param {HTMLElement} server
 * @param {String[]} ancestors
 **/
const addConnectListener = (server, ancestors) => {
	server.querySelector(".server__connect").addEventListener("click", () => {
		inputTerminalCommand(getConnectionCommand(server, ancestors))
	})
}


/**
 * @param {NS} ns
 * @param {HTMLElement} server
 * @param {String[]} ancestors
 * @param {String[]} cracksOwned
 **/
const addHackListener = (ns, server, ancestors, cracksOwned) => {
	const { numOpenPortsRequired } = ns.getServer(server.dataset.server)

	server.querySelector(".icon--hacked")?.addEventListener("click", () => {
		inputTerminalCommand([
			`${getConnectionCommand(server, ancestors)} `,
			cracksOwned.slice(0, numOpenPortsRequired).map((crack) => `run ${crack}; `).join(""),
			"run NUKE.exe"
		].join(""))
	})
}


/**
 * @param {HTMLElement} server
 * @param {String[]} ancestors
 **/
const addBackdoorListener = (server, ancestors) => {
	server.querySelector(".icon--backdoored")?.addEventListener("click", () => {
		inputTerminalCommand(`${getConnectionCommand(server, ancestors)} backdoor`)
	})
}


/**
 * @param {String} command
 **/
const inputTerminalCommand = (command) => {
	const terminalInput = globalThis["document"].getElementById("terminal-input")
	terminalInput.value = command
	const handler = Object.keys(terminalInput)[1]
	terminalInput[handler].onChange({ target: terminalInput })
	terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null })
}


/**
 * @param {NS} ns
 * @param {{numOpenPortsRequired: Number}} server
 * @return {Boolean}
 **/
const canRootServer = (ns, server) => getCracksOwned(ns).length >= server.numOpenPortsRequired


/**
 * @param {NS} ns
 * @return {String[]}
 **/
const getCracksOwned = (ns) => ([
	"BruteSSH.exe",
	"SQLInject.exe",
	"HTTPWorm.exe",
	"FTPCrack.exe",
	"relaySMTP.exe",
]).filter(crack => ns.fileExists(crack))


/**
 * @param {NS} ns
 * @param {{hasAdminRights: Boolean, backdoorInstalled: Boolean, requiredHackingSkill: Number, numOpenPortsRequired: Number}} server
 * @return {{ hasBackdoorClass: String, hasBackdoorTitle: String, hasRootClass: String, hasRootTitle: String }}
 **/
const getServerIsCompromisedStatus = (ns, server) => {
	let hasRootClass = server.hasAdminRights ? " icon--has-hacked" : ""
	let hasBackdoorClass = server.backdoorInstalled ? " icon--has-backdoored" : ""

	if (!hasRootClass && canRootServer(ns, server)) {
		hasRootClass = " icon--can-hack"
	}

	if (!hasBackdoorClass && hasRootClass && server.requiredHackingSkill < ns.getPlayer().hacking) {
		hasBackdoorClass = " icon--can-backdoor"
	}

	const hasRootTitle = hasRootClass.indexOf("--can") !== -1 ?
		"Click for root access" :
		(!hasRootClass ? "Cannot Nuke this server yet" : "")
	const hasBackdoorTitle = hasBackdoorClass.indexOf("--can") !== -1 ?
		"Click to backdoor" :
		(!hasBackdoorClass ? "Cannot backdoor this server yet" : "")

	return { hasBackdoorClass, hasBackdoorTitle, hasRootClass, hasRootTitle }
}


/**
 * @param {HTMLElement} container
 * @param {String} searchValue
 **/
const filterServers = (container, searchValue) => {
	const serverList = container.querySelector(".server-list")
	const filteredClassName = "server--filtered"
	const serverFilterClassName = "server-list--filtered"

	if (searchValue) {
		serverList.classList.add(serverFilterClassName)

		Array.from(container.querySelectorAll(".server__item")).forEach((element) => {
			if (element.querySelector(".server__connect").textContent.indexOf(searchValue) === -1) {
				element.classList.add(filteredClassName)
			} else {
				element.classList.remove(filteredClassName)
			}
		})
	} else {
		serverList.classList.remove(serverFilterClassName)

		Array.from(container.querySelectorAll(".server__item")).forEach((element) => {
			element.classList.remove(filteredClassName)
		})
	}
}
