import { stylesheetId, windowContainerId, windowFocusedClass } from "/gui/lib/constants.js"
import { windowCss } from "/gui/lib/css.js"

export class Window {
	#left
	#top
	#elementWidth
	#elementHeight
	#windowWidth
	#windowHeight
	#grabStart = {}
	#modalStart = {}
	#boundBeginGrabbing = this.#beginGrabbing.bind(this)
	#boundEndGrabbing = this.#endGrabbing.bind(this)
	#boundMouseMove = this.#mouseMove.bind(this)


	/**
	 * @param {String?} title
	 * @param {{theme?: "windows"|"terminal", content?: String}} options
	 */
	constructor (title, { content = "", theme = "windows" } = {}) {
		this.#initialise(theme)

		this.title = title
		this.addContent(content)
	}


	/** @param {String} title */
	set title (title) {
		this.element.querySelector(".window__title").textContent = title
	}


	/** @param {String} content */
	set content (content) {
		this.element.querySelector(".window__content").innerHTML = content
	}


	/**
	 * @param {String} content
	 * @param {"beforeend"|"beforebegin"|"afterend"|"afterbegin"} position
	 */
	addContent (content, position = "beforeend") {
		if (content) {
			this.element.querySelector(".window__content").insertAdjacentHTML(position, content)
		}
	}


	destroy () {
		this.element.remove()
	}


	#initialise (theme) {
		Window.initialiseWindowContainer()
		Window.initialiseWindowStyles()

		this.element = Window.createWindow(theme)

		this.#addWindowEventListeners()
		this.#initialiseWindowPosition()
	}


	#addWindowEventListeners () {
		this.element.querySelector(".window__cta-close").addEventListener("click", () => this.destroy())
		this.element.querySelector(".window__cta-minimise")
			.addEventListener("click", () => this.element.classList.toggle("window--minimised"))
		this.element.querySelector(".window__toolbar").addEventListener("mousedown", this.#boundBeginGrabbing)
		this.element.addEventListener("mousedown", (e) => {
			e.stopPropagation()
			stealFocusHandler()
			this.element.classList.add(windowFocusedClass)
		})

		if (!globalThis.hasBoundWindowFocusListener) {
			globalThis.hasBoundWindowFocusListener = true
			globalThis["document"].body.addEventListener("mousedown", stealFocusHandler)
		}
	}


	#initialiseWindowPosition () {
		const hiddenClass = "block-but-hidden"
		this.element.classList.add(hiddenClass)

		setTimeout(() => {
			this.#left = globalThis.innerWidth / 2 - this.element.offsetWidth / 2
			this.#top = globalThis.innerHeight / 2 - this.element.offsetHeight / 2

			this.#updateWindowPosition()

			this.element.classList.remove(hiddenClass)
		}, 50)
	}


	#updateWindowPosition () {
		this.element.style.transform = `translate(${this.#left}px, ${this.#top}px)`
	}


	#beginGrabbing ({ x, y, button }) {
		if (!button) {
			const win = globalThis["window"]
			this.#grabStart = { x, y }
			this.#elementWidth = this.element.offsetWidth
			this.#elementHeight = this.element.offsetHeight
			this.#modalStart = { x: this.#left, y: this.#top }
			this.#windowWidth = win.innerWidth
			this.#windowHeight = win.innerHeight

			const body = globalThis["document"].body
			body.addEventListener("mousemove", this.#boundMouseMove)
			body.addEventListener("mouseup", this.#boundEndGrabbing)
			body.addEventListener("mouseleave", this.#boundEndGrabbing)
		}
	}

	#endGrabbing () {
		const body = globalThis["document"].body
		body.removeEventListener("mousemove", this.#boundMouseMove)
		body.removeEventListener("mouseup", this.#boundEndGrabbing)
		body.removeEventListener("mouseleave", this.#boundEndGrabbing)
	}

	#mouseMove ({ x, y }) {
		let leftFinal = this.#modalStart.x + (x - this.#grabStart.x)
		let topFinal = this.#modalStart.y + (y - this.#grabStart.y)

		const leftIsBeforeScreen = leftFinal < 0
		const leftIsAfterScreen = leftFinal + this.#elementWidth > this.#windowWidth
		if (leftIsBeforeScreen || leftIsAfterScreen) {
			if (leftIsBeforeScreen) {
				leftFinal = 0
			} else {
				leftFinal = this.#windowWidth - this.#elementWidth
			}

			this.#modalStart.x = leftFinal
			this.#grabStart.x = Math.max(Math.min(x, this.#windowWidth - 5), 5)
		}

		const topIsBeforeScreen = topFinal < 0
		const topIsAfterScreen = topFinal + this.#elementHeight > this.#windowHeight
		if (topIsBeforeScreen || topIsAfterScreen) {
			if (topIsBeforeScreen) {
				topFinal = 0
			} else {
				topFinal = this.#windowHeight - this.#elementHeight
			}

			this.#modalStart.y = topFinal
			this.#grabStart.y = Math.max(Math.min(y, this.#windowHeight), 5)
		}

		this.#left = leftFinal
		this.#top = topFinal
		this.#updateWindowPosition()
	}


	/**
	 * @param {String?} theme
	 * @return {HTMLElement}
	 * */
	static createWindow (theme) {
		const doc = globalThis["document"]
		const element = doc.createElement("div")
		element.innerHTML = `
				<div class="window__toolbar">
					<h1 class="window__title"></h1>
					<div class="window__cta-group">
						<button class="btn btn--small window__cta-minimise">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="icon icon--minimise">
								<path d="m3 13h12v2h-12z" fill="#000" />
							</svg>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="icon icon--restore">
								<rect x="5" y="1.5" width="11" height="3" stroke="none" fill="#000"/>
								<g fill="currentColor">
									<rect x="5.8" y="4.3" width="9.4" height="6.5" stroke="#000" stroke-width="1.6"/>
									<rect x="1.8" y="9" width="9.4" height="6.5" stroke="#000" stroke-width="1.6"/>
								</g>
								<rect x="1" y="6.2" width="11" height="3" stroke="none" fill="#000"/>
							</svg>
						</button>
						<button class="btn btn--small window__cta-close">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
								<g stroke="#000" stroke-width="1.5">
									<line x1="3" y1="3" x2="15" y2="15" />
									<line x2="3" y1="3" x1="15" y2="15" />
								</g>
							</svg>
						</button>
					</div>
				</div>
				<div class="window__content"></div>
		`

		element.classList.add("window")
		if (theme) {
			element.classList.add(`window--theme-${theme}`)
		}

		setTimeout(() => element.classList.add(windowFocusedClass), 50)

		doc.getElementById(windowContainerId).insertAdjacentElement("beforeend", element)

		return element
	}

	static initialiseWindowContainer () {
		const doc = globalThis["document"]

		if (!doc.getElementById(windowContainerId)) {
			doc.body.insertAdjacentHTML("beforeend", `<div id="${windowContainerId}" class="window-container" />`)
		}
	}

	static initialiseWindowStyles () {
		const doc = globalThis["document"]
		let stylesheet = doc.getElementById(stylesheetId)

		if (stylesheet) {
			stylesheet.remove()
		}

		stylesheet = doc.createElement("style")
		stylesheet.id = stylesheetId
		stylesheet.innerHTML = windowCss
		doc.head.insertAdjacentElement("beforeend", stylesheet)
	}
}

function stealFocusHandler () {
	Array.from(globalThis["document"].querySelectorAll(`.window.${windowFocusedClass}`))
		.forEach((win) => win.classList.remove(windowFocusedClass))
}
