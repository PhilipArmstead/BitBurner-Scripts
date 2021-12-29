export async function main(ns) {
	if (typeof self.customBoundEvents !== 'object') {
		self.customBoundEvents = {}
	}

	if (self.customBoundEvents.tabber) {
		return
	}

	self.customBoundEvents.tabber = true

	self.document.body.addEventListener('keydown', ({ key, ctrlKey, shiftKey }) => {
		if (key.toLowerCase() === 'tab' && ctrlKey) {
			const tabs = [].slice.call(self.document.querySelectorAll('[data-rbd-draggable-context-id] button'))
			const activeTab = tabs.length ? tabs.find((tab) => tab.style.background) : null

			if (activeTab) {
				const tabParent = activeTab.parentElement
				const allTabs = tabParent.parentElement.children
				let nextTab

				if (!shiftKey) {
					nextTab = (tabParent.nextElementSibling ? tabParent.nextElementSibling : allTabs[0]).firstElementChild
				} else {
					nextTab = (tabParent.previousElementSibling ? tabParent.previousElementSibling : [].slice.call(allTabs, -1)[0]).firstElementChild
				}

				nextTab.click()
			}
		}
	})
}
