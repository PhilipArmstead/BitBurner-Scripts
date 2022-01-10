import VueApp from "/gui/lib/VueApp.js"
import AppWindow from "/gui/component/Window.js"
import UiButton from "/gui/component/UiButton.js"
import UiSelect from "/gui/component/UiSelect.js"


/**
 * @param {String} message
 * @param {Array|Object?} options
 */
export default async (message, options) => {
	let userInput = null
	let promiseResolution

	await VueApp.initialise()
	const app = new VueApp()
	new AppWindow(app)
	new UiButton(app)
	new UiSelect(app)
	app.mount({
		template: `
			<app-window title="Prompt" class="window--prompt" @window:close="kill">
				<div class="user-prompt">
					<h1 class="user-prompt__message">{{ message }}</h1>
					<form class="user-prompt__controls" @submit.prevent="submit">
						<input v-if="!options" ref="inputField" v-model="input" class="user-prompt__input" @keydown.stop />
						<ui-select v-else v-model="input" teleport-id="${app.id}" :choices="options" class="user-prompt__input" />
						<ui-button class="user-prompt__confirm">Confirm</ui-button>
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
					if (!!inputField.value) {
						inputField.value.focus()
					}
				}, 300);
			})

			return { input, inputField, message, options, kill, submit }
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

				&__input {
					background: none;
					box-shadow: none;
					border: none;
					border-bottom: 2px solid #080;
					color: #0C0;
					flex: 1 0 auto;
					font-size: 16px;
					line-height: 1;
					margin: 0;
					padding: 0 3px;
					width: auto;

					&:focus {
						border-color: #0C0;
						outline: none;
					}
				}

				&__confirm {
					flex: 0 1 100px;
				}
			}
		`
	})

	await new Promise((resolve) => (promiseResolution = resolve))

	return userInput
}
