import ToastManager from "/gui/lib/ToastManager.js"


/**
 * @param {String} command
 * @return {Boolean}
 **/
export const inputTerminalCommand = (command) => {
	const terminalInput = globalThis["document"].getElementById("terminal-input")
	if (!terminalInput) {
		ToastManager.instance.add("The terminal must be visible")
	} else if (terminalInput.hasAttribute("disabled")) {
		ToastManager.instance.add("The terminal must not be in use")
	} else {
		terminalInput.value = command
		const handler = Object.keys(terminalInput)[1]
		terminalInput[handler].onChange({ target: terminalInput })
		terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null })

		return true
	}

	return false
}


/**
 * @param {String[]} command
 * @return {Boolean}
 **/
export const inputTerminalCommands = (command) => inputTerminalCommand(command.join("; "))
