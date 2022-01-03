import VueApp from "/gui/lib/VueApp.js"
import AppWindow from "/gui/component/Window.js"


export default async (message) => {
	let userInput = null
	let terminalTimeout
	let promiseResolution

	await VueApp.initialise()
	const app = new VueApp()
	new AppWindow(app)
	app.mount({
		template: `
			<app-window title="Prompt" class="window--prompt" @window:close="kill">
				<div class="user-prompt">
					<h1 class="user-prompt__message">{{ message }}</h1>
					<form class="user-prompt__controls" @submit.prevent="submit">
						<input ref="inputField" v-model="input" class="user-prompt__input" />
						<button class="user-prompt__confirm">Confirm</button>
					</div>
				</div>
			</app-window>
		`,
		setup() {
			const { onMounted, ref } = Vue
			const inputField = ref("")
			const input = ref("")
			const kill = () => {
				app.unmount()
				promiseResolution()
			}
			const submit = () => {
				userInput = input.value
				kill()
			}

			onMounted(() => {
				setTimeout(() => {
					inputField.value.focus()
				}, 300);
			})

			return { input, inputField, message, kill, submit }
		},
		style: `
			.window--prompt .window {
				width: 30vw;
			}

			.user-prompt {
				align-items: flex-start;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				padding: 20px;

				&__message {
					color: #FFF;
					flex: 1 0 100%;
					font-size: 20px;
					font-weight: 400;
					margin: 0px 0 16px;
				}

				&__controls {
					display: flex;
					flex: 1 0 100%;
				}

				&__input, &__confirm {
					background: none;
					box-shadow: none;
					color: #0C0;
					line-height: 1;
					margin: 0;
					width: auto;
				}

				&__input {
					border: none;
					border-bottom: 2px solid #080;
					flex: 1 0 auto;
					font-size: 16px;
					padding: 0 3px;

					&:focus {
						border-color: #0C0;
						outline: none;
					}
				}

				&__confirm {
					border: 2px solid #080;
					flex: 0 1 100px;
					font-size: 14px;
					padding: 10px;
				}
			}
		`
	})

	terminalTimeout = setInterval(disableTerminalInput, 100)

	await new Promise((resolve) => (promiseResolution = resolve))

	clearInterval(terminalTimeout)
	enableTerminalInput()

	return userInput
}

const disableTerminalInput = () => {
	const terminalInput = globalThis["document"].getElementById("terminal-input")
	if (terminalInput) {
		terminalInput.setAttribute('disabled', 'disabled')
	}
}

const enableTerminalInput = () => {
	const terminalInput = globalThis["document"].getElementById("terminal-input")
	if (terminalInput) {
		terminalInput.removeAttribute('disabled')
	}
}