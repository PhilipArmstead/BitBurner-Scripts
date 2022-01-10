import VueApp from "/gui/lib/VueApp.js"
import AppWindow from "/gui/component/Window.js"
import ServerListTree from "/gui/component/ServerListTree.js"
import { canRootServer, getCracksOwned } from "/gui/lib/cracks.js"
import { getServers, filterItem } from "/gui/lib/servers.js"
import { inputTerminalCommands } from "/gui/lib/terminal.js"


/** @param {NS} ns **/
export async function main (ns) {
	await VueApp.initialise()
	const app = new VueApp(ns)
	new ServerListTree(app)
	new AppWindow(app)
	app.mount({
		template: `
			<div>
				<app-window title="Server list" :can-refresh="true" class="window--server-list" @window:close="kill" @window:refresh="refresh">
					<div class="server-list__container">
						<server-list-tree
							class="server-list"
							:class="{ 'server-list--filtered': !!searchValue }"
							:servers="filteredServers"
							@click:backdoor="runBackdoor"
							@click:connect="runConnect"
							@click:hack="runHack"
						/>
						<input
							:type="inputType"
							class="server-list__search-input"
							:class="{ 'input--focused': isFocused }"
							placeholder="Search"
							v-model="searchValue"
							@focus="searchFocusHandler"
							@blur="searchBlurHandler"
							@keydown.stop
						/>
					</div>
				</app-window>
			</div>
		`,
		setup () {
			const terminal = globalThis["document"].getElementById("terminal-input")
			const playerHacking = ns.getPlayer().hacking
			const cracksOwned = getCracksOwned(ns)
			const servers = Object.entries(getServers(ns).connections)
				.map(([hostname, { connections }]) => getItem(hostname, connections))

			const { computed, ref } = Vue
			const inputType = ref(null)
			const isFocused = ref(false)
			const searchValue = ref("")

			const filteredServers = computed(() => servers.map((server) => filterItem(server, searchValue.value)))


			/**
			 * @param {String} hostname
			 * @param {Object[]} children
			 * @param {String[]} ancestors
			 * @return {{hostname: String, contractCount: Number, hasBackdoorTitle: String, hasBackdoorClass: String, hasRootTitle: String, hasRootClass: String, ancestors: {String}[], connections: {Object}[], purchasedByPlayer: {Boolean}}}
			 */
			function getItem (hostname, children, ancestors = ["home"]) {
				const server = ns.getServer(hostname)
				const { hasBackdoorClass, hasBackdoorTitle, hasRootClass, hasRootTitle } = getServerIsCompromisedStatus(server)
				const latestAncestors = [...ancestors, hostname]

				return {
					ancestors: latestAncestors,
					connections: children ?
						Object.entries(children)?.map(([hostname, { connections }]) => getItem(hostname, connections, latestAncestors)) :
						[],
					hostname,
					hasBackdoorClass,
					hasBackdoorTitle,
					hasRootClass,
					hasRootTitle,
					purchasedByPlayer: server.purchasedByPlayer,
					contractCount: ns.ls(hostname, ".cct").length,
				}
			}

			const kill = () => app.unmount()
			const searchBlurHandler = () => {
				isFocused.value = false

				if (!searchValue.value) {
					inputType.value = null
				}
			}
			const searchFocusHandler = () => {
				isFocused.value = true
				inputType.value = "search"
			}

			const refresh = () => {
				if (inputTerminalCommands(["home", "run /gui/server-list.js"])) {
					kill()
				}
			}

			const runBackdoor = ({ ancestors }) => inputTerminalCommands([
				...getConnectCommand(ancestors),
				"backdoor"
			])
			const runConnect = ({ ancestors }) => inputTerminalCommands(getConnectCommand(ancestors))
			const runHack = ({ ancestors, numOpenPortsRequired }) => inputTerminalCommands([
				...getConnectCommand(ancestors),
					...cracksOwned.slice(0, numOpenPortsRequired).map((crack) => `run ${crack}`),
				"run NUKE.exe"
			])


			/**
			 * @param {String[]} servers
			 * @return {String[]}
			 */
			const getConnectCommand = (servers) => ([
				"home",
				...servers.slice(1).map((node) => `connect ${node}`),
			])


			/**
			 * @param {{hasAdminRights: Boolean, backdoorInstalled: Boolean, requiredHackingSkill: Number }} server
			 * @return {{hasBackdoorTitle: {String}, hasBackdoorClass: {String}, hasRootTitle: {String}, hasRootClass: {String}}}
			 */
			function getServerIsCompromisedStatus (server) {
				let hasRootClass = server.hasAdminRights ? "icon--has-hacked" : ""
				let hasBackdoorClass = server.backdoorInstalled ? "icon--has-backdoored" : ""

				if (!hasRootClass && canRootServer(server, cracksOwned)) {
					hasRootClass = "icon--can-hack"
				}

				if (!hasBackdoorClass && hasRootClass && server.requiredHackingSkill < playerHacking) {
					hasBackdoorClass = "icon--can-backdoor"
				}

				const hasRootTitle = hasRootClass.indexOf("--can") !== -1 ?
					"Click for root access" :
					(!hasRootClass ? "Cannot Nuke this server yet" : "")
				const hasBackdoorTitle = hasBackdoorClass.indexOf("--can") !== -1 ?
					"Click to backdoor" :
					(!hasBackdoorClass ? "Cannot backdoor this server yet" : "")

				return { hasBackdoorClass, hasBackdoorTitle, hasRootClass, hasRootTitle }
			}

			return {
				filteredServers,
				inputType,
				isFocused,
				searchValue,
				kill,
				searchBlurHandler,
				searchFocusHandler,
				refresh,
				runBackdoor,
				runConnect,
				runHack
			}
		},
		style: `
			.window--server-list {
				.window {
					height: 70vh;
					width: 22vw;
				}
			}

			.server-list {
				list-style: none;
				margin: 0;
				padding: 0;
				width: 100%;

				&--filtered {
					&, .server-list {
						padding-left: 0;
					}
				}

				&__search, &__search-input {
					background: none;
					border: 1px solid;
					color: currentColor;
					cursor: pointer;
					margin: 0;
					min-width: 65px;
					padding: 4px;
					position: fixed;
					right: 26px;
				}

				&__search-input {
					top: 36px;
					transition: .2s cubic-bezier(0.4, 0.0, 0.2, 1);
					transition-property: color, width;
					width: 65px;

					&::-webkit-input-placeholder {
						color: #006F00;
					}

					&:not([type="search"])::-webkit-input-placeholder {
						color: inherit;
						text-align: center;
					}

					&[type="search"] {
						width: 130px;
					}
				}
			}
		`
	})
}
