import { Window } from "/gui/lib/Window.js"
import { getRunningProcesses } from "/gui/lib/processes.js"
import css from "/gui/css/process-list.js"


/** @param {NS} ns **/
export async function main (ns) {
	const payloads = {
		grow: "/attacks/grow.js",
		hack: "/attacks/hack.js",
		weaken: "/attacks/weaken.js",
	}

	insertStylesheet()
	const rootElement = createRootElement()
	const body = rootElement.querySelector(".process-list__body")
	body.innerHTML = populateProcesses(ns, payloads)

	const win = new Window("Process list", { theme: "terminal", content: rootElement.outerHTML })
	win.element.classList.add("window--script-monitor")

	while (win.element.parentElement) {
		const body = rootElement.querySelector(".process-list__body")
		body.innerHTML = populateProcesses(ns, payloads)
		win.content = rootElement.outerHTML
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
		<table class="process-list">
			<thead class="process-list__head">
				<tr>
					<td>Target</td>
					<td>Threads</td>
				</tr>
			</thead>
			<tbody class="process-list__body"></tbody>
		</table>
	`)

	return rootElement
}


/**
 * @param {NS} ns
 * @param {{grow: String, hack: String, weaken: String}} ns
 * @return {String}
 **/
const populateProcesses = (ns, payloads) => {
	const processes = getRunningProcesses(ns).map(([host, tasks]) => [
		...tasks
			.filter(({ args }) => args.length)
			.map(({ filename, args: [target], threads }) => ({
				host,
				target,
				threads,
				filename,
				type: Object.keys(payloads).find((key) => payloads[key] === filename),
			}))
			.filter(({ type }) => type)
	]).flat()

	for (let i = 0; i < processes.length; ++i) {
		let j = processes.length
		while (--j > i) {
			if (processes[i].type === processes[j].type && processes[i].target === processes[j].target) {
				processes[i].threads += processes[j].threads
				processes.splice(j, 1)
			}
		}
	}

	return processes.sort((a, b) => b.threads - a.threads)
		.map((process) => renderProcessAsRow(ns, process, getProcessExpiryDetails(ns, process))).join("")
}


/**
 * @param {NS} ns
 * @param {{ type: String, target: String, threads: Number }} process
 * @param {{ duration: Number, timeRunning: Number }?} expiryDetails
 * @return {String}
 **/
const renderProcessAsRow = (ns, { type, target, threads }, expiryDetails) => {
	const row = globalThis["document"].createElement("tr")
	const progress = expiryDetails ?
		Math.min(100, expiryDetails.timeRunning / expiryDetails.duration * 100).toFixed(2) :
		null
	row.classList.add("process", `process--type-${type}`)
	row.insertAdjacentHTML("beforeend", `
		<td class="process-cell process__item">
			${target}
			${progress ?
		`<span class='process__progress-bar' style="width: ${progress}%"></span` :
		""
	}
		</td>
		<td class="process-cell process__threads">
			${threads.toLocaleString()}
		</td>
	`)

	return row.outerHTML
}


/**
 * @param {NS} ns
 * @param {{ filename: String, target: String, host: String }} process
 * @return {{duration: Number, timeRunning: Number}|null}
 */
const getProcessExpiryDetails = (ns, { filename, host, target }) => {
	const logs = ns.getScriptLogs(filename, host, target)
	let i = logs.length
	let log

	while (!log && i--) {
		if (logs[i].indexOf(": Executing") !== -1) {
			log = logs[i]
		}
	}

	if (!log) {
		return null
	}

	const matches = log.match(/([0-9.])+ /g)
	const time = matches.map(Number)
	const duration = time.length > 1 ? time[0] * 60 + time[1] : time[0]
	const { onlineRunningTime, offlineRunningTime } = ns.getRunningScript(filename, host, target)
	const timeRunning = onlineRunningTime + offlineRunningTime

	return { duration, timeRunning }
}
