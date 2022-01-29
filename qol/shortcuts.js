/**
 * Readme
 * ------
 * To configure the shortcut keys, modify the `shortcuts` variable below
 * If you're on Windows, you can't use numbers and you have to match the key's `code` property
 * If you're on Linux (and maybe MacOS) you can use anything, and either the `key` or `code` properties
 * If you're in the browser, you can't use this at all
 */

/** @param {NS} ns **/
export async function main(ns) {
	const debugMode = false // Toggle this to see codes in the console

	// Button indices are the clickable elements in the sidebar
	// Windows
	const shortcuts = [
		{ code: 'KeyT', buttonIndex: 0 }, // Terminal
		{ code: 'KeyE', buttonIndex: 1 }, // Editor
		{ code: 'BracketLeft', buttonIndex: 2 }, // Active scripts
		{ code: 'BracketRight', buttonIndex: 4 }, // Stats
		{ code: 'Backslash', buttonIndex: 5 }, // Factions
	]
	// Not Windows
	// const shortcuts = [
	// 	{ key: '1', buttonIndex: 0 }, // Terminal
	// 	{ key: '2', buttonIndex: 1 }, // Editor
	// 	{ key: '3'', buttonIndex: 2 }, // Active scripts
	// 	{ key: '4', buttonIndex: 4 }, // Stats
	// 	{ key: '5', buttonIndex: 5 }, // Factions
	// ]

	const win = globalThis
	const body = win['document'].body
	const buttons = body.querySelectorAll('ul > * .MuiButtonBase-root')

	// Create global storage for callbacks
	if (!win.qolShortcuts) {
		win.qolShortcuts = new Map()
	}

	shortcuts.forEach((shortcut) => {
		const { buttonIndex, code, key } = shortcut

		// Remove callback associated with this key
		if (win.qolShortcuts.has(shortcut)) {
			body.removeEventListener('keypress', win.qolShortcuts['get'](shortcut))
		}

		// Get button for this shortcut
		const button = buttons[buttonIndex]
		if (button) {
			// Create click-handler
			const callback = (e) => {
				if (debugMode) {
					console.log(e)
				}

				if (e.ctrlKey && (e.key === key || e.code === code)) {
					button[Object.keys(button)[1]].onClick()
				}
			}

			// Store it to global storage and bind to event-listener
			win.qolShortcuts.set(shortcut, callback)
			body.addEventListener('keypress', callback)
		}
	})
}
