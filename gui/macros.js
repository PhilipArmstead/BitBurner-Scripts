import VueApp from "/gui/lib/VueApp.js"
import AppWindow from "/gui/component/Window.js"
import { inputTerminalCommands } from "/gui/lib/terminal.js"
import { macroList } from "/gui/config/macro-list.config.js"


/** @param {NS} ns **/
export async function main (ns) {
	await VueApp.initialise()
	const app = new VueApp(ns)
	new AppWindow(app)
	app.mount({
		template: `
			<div>
				<app-window title="Macros" class="window--macros" @window:close="kill">
					<div class="macro-list">
						<div v-for="[label, commands] in listItems" :key="label" class="macro">
							<button class="macro__cta" @click="inputTerminalCommands(commands)">{{ label }}</button>
						</div>
					</div>
				</app-window>
			</div>
		`,
		setup () {
			const kill = () => app.unmount()
			const listItems = Object.entries(macroList).map(([label, commands]) => [label, commands])

			return { kill, listItems, inputTerminalCommands }
		},
		style: `
			.window--macros {
				.window {
					width: 10vw;
				}
			
				.window__content {
					flex: 100%;
				}

				.macro-list {
					align-content: flex-start;
					display: flex;
					flex-wrap: wrap;
					justify-content: flex-start;
				}

				.macro {
					margin: 0 15px 8px 3px;
				}

				.macro__cta {
					background: none;
					border: none;
					border-radius: 2px;
					box-shadow: 0 0 0px 1px #AAAAAA54;
					color: inherit;
					cursor: pointer;
					padding: 6px 8px;
					transition: box-shadow .2s linear;

					&:hover {
						box-shadow: 0 0 0px 1px #AAA;
					}
				}
			}
		`
	})
}
