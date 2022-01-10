import BaseComponent from "/gui/component/BaseComponent.js"


const component = {
	name: "app-window",
	template: `
			<div class="window-container">
				<div
					ref="process"
					class="window"
					:class="[{ 'window--minimised': isMinimised }, \`window--theme-\${theme}\`]"
					style="visibility: hidden"
					:style="{
						transform: \`translate(\${left}px, \${top}px)\`,
						width: \`\${processWidth}px\`,
						height: \`\${processHeight}px\`,
						visibility: isHidden? 'hidden' : null
					}"
				>
					<div class="window__toolbar" @mousedown="beginGrabbing">
						<h1 class="window__title">{{ title }}</h1>
						<div class="window__cta-group">
							<button
								v-show="canRefresh"
								class="btn btn--small window__cta-refresh"
								@click="$emit('window:refresh')"
								@mousedown.stop
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65" class="icon icon--refresh">
									<path fill="currentColor" d="M32.5 4.999a27.31 27.31 0 0 0-14.699 4.282l-5.75-5.75v16.11h16.11l-6.395-6.395a21.834 21.834 0 0 1 10.734-2.82c12.171 0 22.073 9.902 22.073 22.074 0 2.899-.577 5.664-1.599 8.202l4.738 2.762A27.299 27.299 0 0 0 60 32.5C60 17.336 47.663 4.999 32.5 4.999zM43.227 51.746c-3.179 1.786-6.826 2.827-10.726 2.827-12.171 0-22.073-9.902-22.073-22.073 0-2.739.524-5.35 1.439-7.771l-4.731-2.851A27.34 27.34 0 0 0 5 32.5C5 47.664 17.336 60 32.5 60c5.406 0 10.434-1.584 14.691-4.289l5.758 5.759V45.358H36.838l6.389 6.388z"/>
								</svg>
							</button>
							<button
								class="btn btn--small window__cta-minimise"
								@click="isMinimised = !isMinimised"
								@mousedown.stop
							>
								<svg v-show="!isMinimised" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="icon icon--minimise">
									<path d="m3 13h12v2h-12z" fill="currentColor" />
								</svg>
								<svg v-show="isMinimised" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="icon icon--restore">
									<rect x="5" y="1.5" width="11" height="3" stroke="none" fill="#000"/>
									<g fill="currentColor">
										<rect x="5.8" y="4.3" width="9.4" height="6.5" stroke="#000" stroke-width="1.6"/>
										<rect x="1.8" y="9" width="9.4" height="6.5" stroke="#000" stroke-width="1.6"/>
									</g>
									<rect x="1" y="6.2" width="11" height="3" stroke="none" fill="#000"/>
								</svg>
							</button>
							<button
								class="btn btn--small window__cta-close"
								@click="$emit('window:close')"
								@mousedown.stop
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="icon icon--close">
									<g stroke="currentColor" stroke-width="1.5">
										<line x1="3" y1="3" x2="15" y2="15" />
										<line x2="3" y1="3" x1="15" y2="15" />
									</g>
								</svg>
							</button>
						</div>
					</div>
					<div class="window__content">
						<slot />				
					</div>
				</div>
			</div>
		`,
	props: {
		title: {
			type: String,
			required: true,
		},
		theme: {
			type: String,
			default: "terminal",
			validator (value) {
				return ["win95", "terminal"].includes(value)
			}
		},
		canRefresh: {
			type: Boolean,
			default: false,
		},
	},
	setup () {
		const { onMounted, onUnmounted, ref } = Vue
		const process = ref(null)
		const processWidth = ref()
		const processHeight = ref()
		const windowWidth = ref()
		const windowHeight = ref()
		const left = ref()
		const top = ref()
		let grabStart = {}
		let modalStart = {}
		const isMinimised = ref(false)
		const isHidden = ref(true)

		const setPosition = () => {
			const width = process.value.offsetWidth
			const height = process.value.offsetHeight
			windowWidth.value = globalThis.innerWidth
			windowHeight.value = globalThis.innerHeight
			left.value = windowWidth.value / 2 - width / 2
			top.value = windowHeight.value / 2 - height / 2
		}

		onMounted(() => {
			new ResizeObserver(([{ borderBoxSize: [{ inlineSize, blockSize }] }]) => {
				if (!isHidden.value) {
					processWidth.value = inlineSize
					processHeight.value = blockSize
				}
			}).observe(process.value)

			const showComponent = () => {
				isHidden.value = false
				setPosition()
			}
			let showComponentTimeout

			globalThis['document'].addEventListener('sass:compiled', () => {
				if (isHidden.value) {
					clearTimeout(showComponentTimeout)
					showComponentTimeout = setTimeout(showComponent, 100)
				}
			})
		})

		const beginGrabbing = ({ x, y, button }) => {
			const win = globalThis
			const body = globalThis["document"].body

			if (!button) {
				grabStart = { x, y }
				processWidth.value = process.value.offsetWidth
				processHeight.value = process.value.offsetHeight
				modalStart = { x: left.value, y: top.value }
				windowWidth.value = win.innerWidth
				windowHeight.value = win.innerHeight

				body.addEventListener("mousemove", mouseMove)
				body.addEventListener("mouseup", endGrabbing)
				body.addEventListener("mouseleave", endGrabbing)
			}
		}

		const endGrabbing = () => {
			const body = globalThis["document"].body
			body.removeEventListener("mousemove", mouseMove)
			body.removeEventListener("mouseup", endGrabbing)
			body.removeEventListener("mouseleave", endGrabbing)
		}

		onUnmounted(endGrabbing)

		const mouseMove = ({ x, y }) => {
			let leftFinal = modalStart.x + (x - grabStart.x)
			let topFinal = modalStart.y + (y - grabStart.y)

			const leftIsBeforeScreen = leftFinal < 0
			const leftIsAfterScreen = leftFinal + processWidth.value > windowWidth.value
			if (leftIsBeforeScreen || leftIsAfterScreen) {
				if (leftIsBeforeScreen) {
					leftFinal = 0
				} else {
					leftFinal = windowWidth.value - processWidth.value
				}

				modalStart.x = leftFinal
				grabStart.x = Math.max(Math.min(x, windowWidth.value - 5), 5)
			}

			const topIsBeforeScreen = topFinal < 0
			const topIsAfterScreen = topFinal + processHeight.value > windowHeight.value
			if (topIsBeforeScreen || topIsAfterScreen) {
				if (topIsBeforeScreen) {
					topFinal = 0
				} else {
					topFinal = windowHeight.value - processHeight.value
				}

				modalStart.y = topFinal
				grabStart.y = Math.max(Math.min(y, windowHeight.value), 5)
			}

			left.value = leftFinal
			top.value = topFinal
		}

		return {
			isHidden,
			isMinimised,
			left,
			processHeight,
			processWidth,
			top,
			process,
			beginGrabbing,
			endGrabbing,
			setPosition,
		}
	},
	style: `
		.window-container {
			bottom: 0;
			left: 0;
			pointer-events: none;
			position: fixed;
			top: 0;
			width: 100%;
			z-index: 9999;

			* {
				box-sizing: border-box;
			}

			.window {
				align-items: flex-start;
				display: inline-flex;
				flex-direction: column;
				left: 0;
				max-height: 100vh;
				max-width: 100vw;
				min-height: 120px;
				min-width: 120px;
				overflow: hidden;
				pointer-events: auto;
				position: absolute;
				resize: both;
				top: 0;
				width: 50vw;

				&--focused {
					z-index: 1501;
				}

				&--theme-terminal {
					border: 1px solid #4e4e4e6b;
					font-family: Consolas, 'Liberation Mono', 'Fira Code', monospace;

					.window {
						&__toolbar {
							background: #111;
							color: #FFF;
						}

						&__cta-group .btn {
							background: none;
							border: none;
							color: #A9A9A9;
						}

						&__content {
							background: #000000d6;
							color: #0f0;

							&::-webkit-scrollbar {
								display: block;
								width: 10px;
							}

							&::-webkit-scrollbar-track {
								background-color: #00cc0021;
							}

							&::-webkit-scrollbar-thumb {
								background-color: #0f0;
							}
						}

						.btn {
							background: none;
							box-shadow: none;
						}
					}
				}

				&--minimised {
					height: auto !important;
					max-width: 200px;
					min-height: 0;
					min-width: 0;
					resize: none;
					width: auto !important;

					.window__content,
					.window__cta-group .icon--minimise {
						display: none;
					}
				}

				&__toolbar {
					background: gray;
					display: flex;
					padding: 3px 3px 3px 8px;
					user-select: none;
					width: 100%;
				}

				&__title {
					align-self: center;
					flex: 0 1 100%;
					font-size: 13px;
					font-weight: bold;
					line-height: 20px;
					margin: 0 20px 0 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&__cta-group {
					align-items: center;
					display: flex;
					flex: 0 1 100%;
					justify-content: flex-end;
					margin-left: auto;

					> * {
						background-position: 50% 50%;
						background-size: 14px auto;
						flex: 0 1 auto;
					}

					.icon {
						width: 14px;
		
						&--restore {
							color: #d6cec8;
						}
					}
				}

				&__icon {
					align-self: center;
					max-height: 16px;
					margin-right: 6px;
					object-fit: contain;
					width: 16px;
				}

				&__menu {
					width: 100%;
					background: rgb(212, 208, 200);
					color: #333;
					padding-left: 5px;
					padding-bottom: 2px;

					span {
						border: 1px inset transparent;
						cursor: pointer;
						font-size: 15px;
						margin-right: 12px;
						padding: 0 1px;
		
						&:hover {
							border: 1px inset #bdbdbd;
						}
					}
				}

				&__content {
					background: #FFF;
					display: flex;
					flex: 0 1 100%;
					overflow: auto;
					padding: 6px;
		
					&, > * {
						width: 100%;
					}
				}
			}
		}
	`
}

export default class Window extends BaseComponent {
	constructor (app) {
		super(app, [component])
	}
}
