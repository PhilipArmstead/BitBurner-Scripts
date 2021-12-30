import { Command, CommandScripts } from "./definitions.js"
import { Window } from "/gui/lib/Window.js"
import { getRunningProcesses } from "/gui/lib/processes.js"
import css from "/gui/css/script-monitor.js"


/** @param {NS} ns **/
export async function main (ns) {
	insertStylesheet()
	const rootElement = createRootElement()
	const body = rootElement.querySelector(".process-list__body")
	body.innerHTML = populateProcesses(ns)

	const win = new Window("Process list", { theme: "terminal", content: rootElement.outerHTML })
	win.element.classList.add("window--script-monitor")

	while (win.element.parentElement) {
		const body = rootElement.querySelector(".process-list__body")
		body.innerHTML = populateProcesses(ns)
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
 * @return {String}
 **/
const populateProcesses = (ns) => {
	const uniqueProcesses = new Set()
	const acceptedScripts = [CommandScripts[Command.GROW], CommandScripts[Command.HACK], CommandScripts[Command.WEAKEN]]
	let markup = ""

	// Pray you never have to edit this.
	getRunningProcesses(ns).map(([host, tasks]) => [
			...tasks
				.filter(({ args }) => args.length)
				.filter(({ filename }) => acceptedScripts.includes(filename))
				.map(({ filename, args: [target], threads }) => ({
					host,
					target,
					threads,
					filename,
					type: filename.replace("/attacks/", "").replace(".js", "")
				}))
		])
		.flat()
		.filter(({ target }) => {
			const isUnique = !uniqueProcesses.has(target)
			uniqueProcesses.add(target)
			return isUnique
		})
		.sort((a, b) => b.threads - a.threads)
		.forEach((process) => {
			markup += renderProcessAsRow(ns, process, getProcessExpiryDetails(ns, process))
		})

	return markup
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
			${
		progress ?
			`<span class="process__progress-bar" style="width: ${progress}%"></span` :
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
 * @return {{ duration: Number, timeRunning: Number }}
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
		return
	}

	const matches = log.match(/([0-9.,])+/g)
	matches.splice(2)
	const [minutes, seconds] = matches.map(Number)
	const duration = minutes * 60 + seconds
	const { onlineRunningTime, offlineRunningTime } = ns.getRunningScript(filename, host, target)
	const timeRunning = onlineRunningTime + offlineRunningTime

	return { duration, timeRunning }
}
