import { Window } from "/gui/lib/Window.js"
import { inputTerminalCommand } from "/gui/lib/terminal.js"
import { macroList } from "/gui/config/macro-list.config.js"
import css from "/gui/css/macros.js"


/** @param {NS} ns **/
export async function main (ns) {
	insertStylesheet()

	const doc = globalThis["document"]
	const oldWindow = doc.querySelector(".window--macros")
	if (oldWindow && oldWindow.parentElement) {
		oldWindow.remove()
	}

	const rootElement = createRootElement()
	populateMacroList(rootElement.firstElementChild)
	const win = new Window("Macros", { theme: "terminal" })
	win.element.classList.add("window--macros")
	win.element.querySelector(".window__content").insertAdjacentElement("beforeend", rootElement)
}


const insertStylesheet = () => {
	const stylesheetId = "macro-id"
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
	rootElement.classList.add("macro-list__container")
	rootElement.insertAdjacentHTML("beforeend", `<div class="macro-list"></div>`)

	return rootElement
}


/**
 * @param {HTMLDivElement} element
 **/
const populateMacroList = (element) => {
	Object.entries(macroList).forEach(([label, commands]) => {
		const button = globalThis["document"].createElement("button")
		button.classList.add("macro__cta")
		button.textContent = label
		button.addEventListener("click", () => {
			console.log(commands)
			inputTerminalCommand(commands.join("; "))
		})

		const container = globalThis["document"].createElement("div")
		container.classList.add("macro")
		container.insertAdjacentElement("beforeend", button)
		element.insertAdjacentElement("beforeend", container)
	})
}
