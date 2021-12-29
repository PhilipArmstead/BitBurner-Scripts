import css from "/gui/css/toasts.js"


export default class {
	static get instance () {
		if (!globalThis.toastInstance) {
			globalThis.toastInstance = new ToastManagerInternal()
		}

		return globalThis.toastInstance
	}
}


/**
 * @typedef Toast
 * @property {Number} id
 * @property {String} message
 * @property {Number} duration
 * @property {Number} state
 * @property {HTMLElement} element
 * @property {Number?} timeout
 */

const state = {
	CAN_SHOW: 0, SHOWING: 1, DISMISSING: 2,
}

class ToastManagerInternal {
	/** @type {Toast[]} **/
	#toasts = []
	#id = 1
	#container


	constructor () {
		this.#initialiseContainer()
		ToastManagerInternal.#initialiseStyles()
	}


	/**
	 * @param {String} message
	 * @param {{duration: Number, type: String?}} options
	 */
	add (message, { duration = 2000, type } = {}) {
		const element = ToastManagerInternal.createElement(message, type) // TODO: theme/status
		this.#container.insertAdjacentElement("beforeend", element)
		this.#toasts.push({
			id: ++this.#id, duration, message, state: state.CAN_SHOW, element,
		})

		setTimeout(() => this.#displayToasts(), 50)
	}


	#initialiseContainer () {
		const doc = globalThis["document"]
		this.#container = doc.querySelector(".toast-container")
		if (!this.#container) {
			this.#container = globalThis["document"].createElement("div")
			this.#container.classList.add("toast-container")
			globalThis["document"].body.insertAdjacentElement("beforeend", this.#container)
		}
	}


	/**
	 * @param {Toast} toast
	 */
	#displayToast (toast) {
		toast.element.classList.add("toast--show")
		toast.state = state.SHOWING
		this.#queueToastForClearance((toast))
	}


	/**
	 * @param {Toast} toast
	 */
	#queueToastForClearance (toast) {
		toast.timeout = setTimeout(() => {
			toast.element.classList.remove("toast--show")
			toast.state = state.DISMISSING

			this.#displayToasts()

			setTimeout(() => {
				this.#destroyToast(toast.id)
			}, 1000)
		}, toast.duration)
	}


	/**
	 * @param {Number} toastId
	 */
	#destroyToast (toastId) {
		const index = this.#toasts.findIndex(({ id }) => id === toastId)

		if (index !== 1) {
			this.#toasts[index].element.remove()
			this.#toasts.splice(index, 1)
		}
	}


	#displayToasts () {
		const visibleToasts = this.#toasts.reduce((count, { state: s }) => count + Number(s === state.SHOWING), 0)
		let toastsToShow = ToastManagerInternal.maxToasts - visibleToasts

		if (toastsToShow > 0) {
			for (let i = 0; i < this.#toasts.length && toastsToShow > 0; ++i) {
				if (this.#toasts[i].state === state.CAN_SHOW) {
					this.#displayToast(this.#toasts[i])
					--toastsToShow
				}
			}
		}
	}


	/** @return {Number} */
	static get maxToasts () {
		return 8
	}


	static #initialiseStyles () {
		const doc = globalThis["document"]
		let stylesheet = doc.getElementById("toasty-styles")
		if (stylesheet) {
			stylesheet.remove()
		}

		stylesheet = doc.createElement("style")
		stylesheet.id = "toasty-styles"
		stylesheet.innerHTML = css
		doc.head.insertAdjacentElement("beforeend", stylesheet)
	}


	/**
	 * @param {String} message
	 * @param {String?} theme
	 * @return {HTMLElement}
	 */
	static createElement (message, theme = "info") {
		const element = globalThis["document"].createElement("div")
		element.classList.add("toast__message", `toast__message--theme-${theme}`)
		element.innerHTML = `
			<div class="toast__message-inner">
				<p class="toast__text">${message}</p>
			</div>
		`

		return element
	}


	// /**
	//  * @param {String} message
	//  * @param {Number[]} args
	//  * @return {String}
	//  */
	// static parseMessage (message, args) {
	// 	let i = 0
	// 	return message.replace(/(%i)/g, function (match) {
	// 		return typeof args[i] != "undefined" ? args[i++] : match
	//
	// 	})
	// }


	// /**
	//  * @param {String} message
	//  * @param {{args: Number[], duration: Number, type: String?}} options
	//  */
	// add (message, { args, duration = 2000, type } = {}) {
	// 	const existingToast = this.#toasts.find(({ message: m, state: s }) => s !== state.DISMISSING && m === message)
	// 	if (existingToast) {
	// 		this.#updateExistingToast(existingToast, args)
	// 	} else {
	// 		const element = ToastManagerInternal.createElement(message, args, type)
	// 		this.#container.insertAdjacentElement("beforeend", element)
	// 		this.#toasts.push({
	// 			id: ++this.#id, args: [args], duration, message, state: state.CAN_SHOW, element,
	// 		})
	//
	// 		setTimeout(() => this.#displayToasts(), 50)
	// 	}
	// }


	// /**
	//  * @param {Toast} toast
	//  * @param {Number[]} args
	//  */
	// #updateExistingToast (toast, args) {
	// 	toast.args.push(args)
	// 	const compiledArgs = toast.args.reduce((acc, cur) => acc.map((value, key) => value + cur[key]),
	// 		Array.from({ length: args.length }, () => 0)
	// 	)
	// 	toast.element.querySelector(".toast__text").textContent = ToastManagerInternal.parseMessage(toast.message, compiledArgs)
	//
	// 	if (toast.state === state.SHOWING) {
	// 		clearTimeout(toast.timeout)
	// 		this.#queueToastForClearance(toast)
	// 	}
	// }
}
