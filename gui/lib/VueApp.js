export default class VueApp {
	#app
	#ns
	#element
	#id
	#isAlive

	/** @param {NS?} ns */
	constructor (ns) {
		if (!globalThis.Vue) {
			throw new Error("Vue is not initialised; call `VueApp.initialise()` first")
		}

		this.#ns = ns
		this.#id = `vue-app-${+new Date()}`
		this.#app = Vue.createApp({})
	}

	/** @return {NS} */
	get ns () {
		return this.#ns
	}

	/** @return {String} */
	get id () {
		return this.#id
	}

	/** @return {Boolean} */
	get isAlive () {
		return this.#isAlive
	}

	/**
	 * @param {String} name
	 * @param {{style: String?, template: String, setup: String}} component
	 **/
	registerComponent (name, component) {
		this.#app.component(name, component)
	}


	/**
	 * @param {{style: String?, template: String, setup: String}} component
	 **/
	mount (component) {
		this.#app.component("app-root", component)

		const appStyles = []
		Object.values(this.#app._context.components).filter(({ style }) => style).forEach((cmp) => {
			appStyles.push(cmp.style.trim())
		})

		const doc = globalThis["document"]
		this.#element = doc.createElement("div")
		this.#element.id = `${this.#id}__wrapper`
		this.#element.insertAdjacentHTML("beforeend", `
			<div id="${this.#id}">
				<app-root />
			</div>
			<style type="text/scss">#${this.#id} { ${appStyles.join("\n")} }</style>
    `)
		doc.body.insertAdjacentElement("beforeend", this.#element)

		this.#app.mount(`#${this.#id}`)
		this.#isAlive = true
		VueApp.addScssCompiler(this.#id)
	}

	unmount () {
		this.#app?.unmount()
		this.#element?.remove()
		this.#isAlive = false
	}

	static async initialise () {
		if (!globalThis.Vue) {
			globalThis.Vue = await import("https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/vue.esm-browser.prod.js")
		}
	}


	/** @param {String} appId */
	static addScssCompiler (appId) {
		const win = globalThis
		const doc = globalThis["document"]

		if (typeof Sass === "undefined" || typeof Sass.compile !== "function") {
			const sassJSScript = doc.createElement("script")
			sassJSScript.type = "text/javascript"
			sassJSScript.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.min.js"
			sassJSScript.onload = () => VueApp.findAndConvertTags(appId)

			// Monkey patch `window.define` to ensure sass installs properly
			win._defineBak = win.define
			win.define = undefined
			doc.head.appendChild(sassJSScript)
		} else {
			VueApp.findAndConvertTags(appId)
		}

		if (typeof win !== "undefined" && win !== null && typeof Sass !== "undefined" && typeof Sass.compile === "function") {
			setTimeout(() => VueApp.findAndConvertTags(appId), 0)
		}
	}


	/** @param {String} appId */
	static findAndConvertTags (appId) {
		const win = globalThis
		const doc = globalThis["document"]

		win.define = win._defineBak
		for (const tag of doc.getElementsByTagName("style")) {
			if (tag.type.toLowerCase() === "text/scss" && tag.dataset.compiled !== "true") {
				Sass.compile(tag.innerHTML, function (compiledCSS) {
					const rawStyle = doc.createElement("style")
					rawStyle.type = "text/css"
					rawStyle.innerHTML = compiledCSS.text
					doc
						.getElementById(`${appId}__wrapper`)
						.appendChild(rawStyle)
				})
				tag.dataset.compiled = "true"
			}
		}

		doc.dispatchEvent(new CustomEvent('sass:compiled', { detail: appId }))
	}
}
