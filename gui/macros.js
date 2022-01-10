import VueApp from "/gui/lib/VueApp.js"
import AppWindow from "/gui/component/Window.js"
import UiButton from "/gui/component/UiButton.js"
import { inputTerminalCommands } from "/gui/lib/terminal.js"
import { macroList } from "/gui/config/macro-list.config.js"


export async function main () {
	await VueApp.initialise()
	const app = new VueApp()
	new AppWindow(app)
	new UiButton(app)
	app.mount({
		template: `
			<app-window title="Macros" :can-refresh="true" class="window--macros" @window:close="kill" @window:refresh="refresh">
				<div class="macro-list">
					<div v-for="(lists, category) in items" :key="category" class="macro__group">
						<h1 v-if="category !== 'uncategorised'" class="macro__title">{{ category }}</h1>
						<div v-for="(commands, label) in lists" :key="label" class="macro">
							<ui-button class="macro__cta" type="secondary" @click="inputTerminalCommands(commands)">{{ label }}</ui-button>
						</div>
					</div>
				</div>
			</app-window>
		`,
		setup () {
			const items = {
				uncategorised: Object.fromEntries(Object.entries(macroList).filter(([, list]) => Array.isArray(list)).map(([label, commands]) => [label, commands])),
				...Object.fromEntries(Object.entries(macroList).filter(([, list]) => !Array.isArray(list)).map(([label, commands]) => [label, commands]))
			}

			const kill = () => app.unmount()
			const refresh = () => {
				if (inputTerminalCommands(['home', 'run /gui/macros.js'])) {
					kill()
				}
			}

			return { inputTerminalCommands, items, kill, refresh }
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

					&__group {
						display: flex;
						flex: 1 0 100%;
						flex-wrap: wrap;
					}

					&__title {
						color: #FFF;
						flex: 1 0 100%;
						font-size: 16px;
					}
				}
			}
		`
	})
}
