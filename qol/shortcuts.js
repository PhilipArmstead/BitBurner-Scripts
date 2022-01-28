/** @param {NS} ns **/
export async function main (ns) {
	// Ctrl + $key will trigger the shortcut
	// Button indices are the clickable elements in the sidebar
	const shortcuts = [
		{ key: '1', buttonIndex: 0 }, // Terminal
		{ key: '2', buttonIndex: 1 }, // Editor
		{ key: '3', buttonIndex: 2 }, // Active scripts
		{ key: '4', buttonIndex: 4 }, // Stats
		{ key: '5', buttonIndex: 5 }, // Factions
	]

	const win = globalThis
	const body = win['document'].body
	const buttons = body.querySelectorAll('ul > * .MuiButtonBase-root')

	// Create global storage for callbacks
	if (!win.qolShortcuts) {
		win.qolShortcuts = {}
	}

	shortcuts.forEach(({ key, buttonIndex }) => {
		// Remove callback associated with this key
		if (win.qolShortcuts[key]) {
			body.removeEventListener('keypress', win.qolShortcuts[key])
		}

		// Get button for this shortcut
		const button = buttons[buttonIndex]
		if (button) {
			// Create click-handler
			const callback = ({ key: pressedKey, ctrlKey }) => {
				if (pressedKey === key && ctrlKey) {
					button[Object.keys(button)[1]].onClick()
				}
			}

			// Store it to global storage and bind to event-listener
			win.qolShortcuts[key] = callback
			body.addEventListener('keypress', callback)
		}
	})
}
