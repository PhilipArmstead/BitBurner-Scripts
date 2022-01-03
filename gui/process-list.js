import VueApp from "/gui/lib/VueApp.js"
import AppWindow from "/gui/component/Window.js"
import ProcessListItems from "/gui/component/ProcessListItems.js"
import { getProcessExpiryDetails, getRunningProcesses } from "/gui/lib/processes.js"
import { processListPayloads } from "/gui/config/process-list.config.js"


/** @param {NS} ns **/
export async function main (ns) {
	await VueApp.initialise()
	const app = new VueApp(ns)
	new AppWindow(app)
	new ProcessListItems(app)
	app.mount({
		template: `
			<app-window title="Process list" class="window--process-list" @window:close="kill">
				<div class="process-list__container">
					<div class="process-list">
						<div class="process-list__head">
							<button class="process-cell process-list__cta" @click="doSort('target')">Target</button>
							<button class="process-cell process-list__cta" @click="doSort('threads')">Threads</button>
						</div>
						<div class="process-list__body">
							<process-list-items :processes="processes.running" />
							<div v-show="processes.sleeping.length" class="process-list__category">
								<h2 class="category__name">Sleeping</h2>
							</div>
							<process-list-items :processes="processes.sleeping" />
						</div>
					</div>
				</div>
			</app-window>
		`,
		setup () {
			const { onMounted, ref } = Vue
			const processes = ref({ sleeping: [], running: [] })
			const disableGrouping = ns.flags([["no-group", false]])["no-group"]
			const sort = {
				param: "expiry",
				isDescending: true,
			}
			let isAlive = true

			onMounted(refreshProcessList)

			function refreshProcessList () {
				if (isAlive) {
					processes.value = populateProcesses()
					setTimeout(refreshProcessList, 200)
				}
			}


			/**
			 * @return {{running: ({expiry: {duration: Number, timeRunning: Number}|null})[], sleeping: ({expiry: {duration: Number, timeRunning: Number}|null})[]}}
			 */
			const populateProcesses = () => {
				const processes = getRunningProcesses(ns).map(([host, tasks]) => [
					...tasks
						.filter(({ args }) => args.length)
						.map(({ filename, args, threads }) => ({
							hosts: [host],
							args,
							target: args[0],
							threads,
							filename,
							type: Object.keys(processListPayloads).find((key) => processListPayloads[key].includes(filename)),
						}))
						.filter(({ type }) => type)
				]).flat()
					.map((process) => ({ ...process, expiry: getProcessExpiryDetails(ns, process) }))

				if (!disableGrouping) {
					for (let i = 0; i < processes.length; ++i) {
						let j = processes.length
						while (--j > i) {
							if (
								processes[i].type === processes[j].type &&
								JSON.stringify(processes[i].args) === JSON.stringify(processes[j].args)
							) {
								processes[i].threads += processes[j].threads
								processes[i].hosts = [...processes[i].hosts, ...processes[j].hosts]
								processes.splice(j, 1)
							}
						}
					}
				}

				processes.sort((a, b) => {
					const valueA = a[sort.param]
					const valueB = b[sort.param]

					if (sort.param === "expiry") {
						return (valueA.duration - valueA.timeRunning) - (valueB.duration - valueB.timeRunning)
					} else {
						if (typeof valueA === "string") {
							return sort.isDescending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB)
						} else {
							return sort.isDescending ? valueB - valueA : valueA - valueB
						}
					}
				})

				return {
					running: processes.filter(({ expiry }) => !expiry.isSleeping).map((treatProcess)),
					sleeping: processes.filter(({ expiry }) => expiry.isSleeping).map((treatProcess)),
				}
			}

			const treatProcess = (process) => ({
				...process,
				hosts: process.hosts.join(", "),
				progress: process.expiry ? Math.min(100, process.expiry.timeRunning / process.expiry.duration * 100).toFixed(2) : 0,
				threads: process.threads.toLocaleString(),
			})

			/** @ param {String} param */
			const doSort = (param) => {
				if (sort.param === param) {
					if (!sort.isDescending) {
						sort.param = "expiry"
					} else {
						sort.isDescending = !sort.isDescending
					}
				} else {
					sort.param = param
					sort.isDescending = true
				}
			}

			const kill = () => {
				isAlive = false
				app.unmount()
			}

			return {
				processes,
				doSort,
				kill,
			}
		},
		style: `
			.window--process-list {
				.window {
					height: 400px;
					width: 300px;
				}
			}

			.process-list {
				> * {
					display: flex;
					flex-wrap: wrap;
				}

				&__head {
					flex: 1 0 auto;
					margin-bottom: 4px;

					.process-cell {
						display: block;
					}
				}

				.process-list__cta {
					background: none;
					border: none;
					color: #FFF;
					cursor: pointer;
					font: inherit;
					pointer-events: auto;
				}

				.process-cell {
					padding: 2px 1px;
					text-align: left;

					&:last-child {
						margin-left: auto;
						text-align: right;
					}
				}

				&__category {
					position: relative;
					width: 100%;

					&::before {
						background: #FFF;
						content: '';
						height: 2px;
						left: 0;
						position: absolute;
						top: 53%;
						width: 100%;
						z-index: 0;
					}
				}

				.category__name {
					background: #000;
					color: #FFF;
					display: inline-block;
					font-size: 14px;
					margin-left: 5px;
					padding: 0 4px;
					position: relative;
				}
			}
		`
	})

	ns.atExit(() => app.unmount())
	while (app.isAlive) {
		await ns.asleep(1000)
	}
}
