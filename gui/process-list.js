import { Window } from "/gui/lib/Window.js"
import { getRunningProcesses } from "/gui/lib/processes.js"
import css from "/gui/css/process-list.js"
import { processListPayloads } from "/gui/config/process-list.config.js"


/** @param {NS} ns **/
export async function main (ns) {
	const disableGrouping = ns.flags([["no-group", false]])["no-group"]
	const sort = {
		param: "expiry",
		isDescending: true,
	}

	insertStylesheet()
	const rootElement = createRootElement()
	const win = new Window("Process list", { theme: "terminal", content: rootElement.outerHTML })
	win.element.classList.add("window--script-monitor")

	Array.from(win.element.querySelectorAll("[data-sort]")).forEach((element) => {
		const param = element.dataset.sort
		element.addEventListener("click", () => {
			if (sort.param === param) {
				sort.isDescending = !sort.isDescending
			} else {
				sort.param = param
				sort.isDescending = true
			}
		})
	})

	while (win.element.parentElement) {
		win.element.querySelector(".process-list__body").innerHTML = populateProcesses(ns, disableGrouping, sort)
		await ns.sleep(200)
	}
}


const insertStylesheet = () => {
	const stylesheetId = "script-monitor-id"
	const doc = globalThis["document"]
	let stylesheet = doc.getElementById(stylesheetId)

	if (stylesheet) {
		stylesheet.remove()
	}

	stylesheet = doc.createElement("style")
	stylesheet.id = stylesheetId
	stylesheet.innerHTML = css
	doc.head.insertAdjacentElement("beforeend", stylesheet)
}


/** @return {HTMLDivElement} */
const createRootElement = () => {
	const rootElement = globalThis["document"].createElement("div")
	rootElement.classList.add("process-list__container")
	rootElement.insertAdjacentHTML("beforeend", `
		<div class="process-list">
			<div class="process-list__head">
				<button class="process-cell" data-sort="target">Target</button>
				<button class="process-cell" data-sort="threads">Threads</button>
			</div>
			<div class="process-list__body"></div>
		</div>
	`)

	return rootElement
}


/**
 * @param {NS} ns
 * @param {Boolean} disableGrouping
 * @param {{param: String, isDescending: Boolean}} sort
 * @return {String}
 **/
const populateProcesses = (ns, disableGrouping, sort) => {
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
				if (processes[i].type === processes[j].type && JSON.stringify(processes[i].args) === JSON.stringify(processes[j].args)) {
					processes[i].threads += processes[j].threads
					processes[i].hosts = [...processes[i].hosts, ...processes[j].hosts]
					processes.splice(j, 1)
				}
			}
		}
	}

	return processes.sort((a, b) => {
			const valueA = a[sort.param]
			const valueB = b[sort.param]

			if (sort.param === "expiry") {
				return valueB.timeRunning / valueB.duration - valueA.timeRunning / valueA.duration
			} else {
				if (typeof valueA === "string") {
					return sort.isDescending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB)
				} else {
					return sort.isDescending ? valueB - valueA : valueA - valueB
				}
			}
		})
		.map((process) => renderProcessAsRow(ns, process)).join("")
}


/**
 * @param {NS} ns
 * @param {{ type: String, target: String, hosts: String[], threads: Number, expiry: { duration: Number, timeRunning: Number }? }} process
 * @return {String}
 **/
const renderProcessAsRow = (ns, { type, target, hosts, threads, expiry }) => {
	const row = globalThis["document"].createElement("div")
	const progress = expiry ? Math.min(100, expiry.timeRunning / expiry.duration * 100).toFixed(2) : null

	row.classList.add("process", `process--type-${type}`)
	row.insertAdjacentHTML("beforeend", `
		<div class="process-cell process__item" title="Running on ${hosts.join(", ")}">
			${target}
			${progress ?
		`<span class="process__progress-bar" style="width: ${progress}%"></span>` :
		""
	}
		</div>
		<div class="process-cell process__threads">
			${threads.toLocaleString()}
		</div>
	`)

	return row.outerHTML
}


/**
 * @param {NS} ns
 * @param {{ filename: String, args: String[], hosts: String[] }} process
 * @return {{duration: Number, timeRunning: Number}|null}
 */
const getProcessExpiryDetails = (ns, { filename, hosts, args }) => {
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
		timeRunning
	}

	while (!log && i--) {
		if (logs[i].indexOf(": Executing") !== -1) {
			log = logs[i]
		}
	}

	if (log) {
		const time = log.match(/([0-9.])+ /g).map(Number)
		returnValue.duration += time.length > 1 ? time[0] * 60 + time[1] : time[0]
	}

	return returnValue
}
