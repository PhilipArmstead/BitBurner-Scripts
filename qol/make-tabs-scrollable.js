/** @param {NS} ns **/
export async function main (ns) {
	const doc = globalThis["document"]

	if (!globalThis.isScrolling) {
		globalThis.isScrolling = true
		setTimeout(() => makeTabsScrollable(doc), 1000)
	} else {
		console.warn("Scroll monitor is already running")
	}
}


/** @param {HTMLDocument} doc */
function makeTabsScrollable (doc) {
	const element = doc.querySelector("[data-rbd-droppable-id=\"tabs\"]:not([data-can-be-scrolled])")
	if (element) {
		addEventListeners(element)
	}

	setTimeout(() => makeTabsScrollable(doc), 1000)
}


/** @param {HTMLElement} element */
function addEventListeners (element) {
	if (element.dataset.canBeScrolled) {
		return
	}

	element.removeEventListener("wheel", scrollTabs)
	element.addEventListener("wheel", scrollTabs)
}


/** @param {Event} e */
function scrollTabs (e) {
	e.preventDefault()
	this.scrollLeft += e.deltaY
	this.dataset.canBeScrolled = "true"
}
