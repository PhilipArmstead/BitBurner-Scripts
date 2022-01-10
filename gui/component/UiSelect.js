import BaseComponent from "/gui/component/BaseComponent.js"

const component = {
	name: "ui-select",
	template: `
		<div class="select" :class="[\`select--theme-\${theme}\`]">
			<p ref="selectToggle" class="select__cta" @click.stop="toggleMenuVisibility">{{ displayValue }}</p>
			<teleport :to="\`#\${teleportId}\`">
				<ul class="select__list" :class="[\`select--theme-\${theme}\`, { 'select--is-visible': isVisible }]" :style="{ left, top }" @click.stop>
					<li v-for="(label, value) in choices" class="select__choice">
						<button class="select__cta" @click.prevent="select(value)">{{ label }}</button>
					</li>
				</ul>
			</teleport>
		</div>
		`,
	props: {
		teleportId: {
			type: String,
			default: "body",
		},
		theme: {
			type: String,
			default: "terminal",
			validator (value) {
				return ["win95", "terminal"].includes(value)
			}
		},
		modelValue: {
			type: [Number, String],
			default: null,
		},
		choices: {
			type: [Array, Object],
			required: true,
		},
	},
	setup (props, { emit }) {
		const { computed, onUnmounted, ref } = Vue
		const selectToggle = ref(null)
		const isVisible = ref(false)
		const left = ref()
		const top = ref()
		const displayValue = computed(() => props.choices[props.modelValue] || "Select an option")

		onUnmounted(() => {
			globalThis['document'].removeEventListener('click', closeMenu)
		})

		const select = (value) => {
			closeMenu()
			emit("update:modelValue", value)
		}

		const setListPosition = () => {
			const { x, y } = selectToggle.value.getBoundingClientRect()
			left.value = `${Math.floor(x - 3)}px`
			top.value = `${Math.floor(y)}px`
		}
		const toggleMenuVisibility = () => {
			isVisible.value = !isVisible.value
			setListPosition()
		}

		const closeMenu = () => isVisible.value = false

		globalThis['document'].addEventListener('click', closeMenu)

		return { displayValue, isVisible, left, selectToggle, top, select, toggleMenuVisibility }
	},
	style: `
		.select {
			display: flex;
			flex-direction: column;
			position: relative;
			
			&__cta, &__list {
				user-select: none;
			}

			&__list, &__choice {
				list-style: none;
				margin: 0;
			}

			&__list {
				background: #000000e8;
				border: 1px solid;
				max-width: calc(100% - 32px);
				max-height: calc(100% - 32px);
				min-width: 16px;
				min-height: 16px;
				overflow: hidden auto;
				padding: 0;
				position: fixed;
				transition: opacity 368ms cubic-bezier(0.4, 0, 0.2, 1), transform 245ms cubic-bezier(0.4, 0, 0.2, 1);
				transform-origin: 50% 0;
				z-index: 10000;

				&:not(.select--is-visible) {
					opacity: 0;
					transform: scale(0.4);

					&, * {
						pointer-events: none;
					}
				}

				&.select--theme-terminal {
					background-color: rgba(#121212, 0.95);
					border: 1px solid #080;

					.select__cta {
						color: #17af17;

						&:hover {
							background: rgba(#0A0, 0.33);
							color: #0C0;
						}

						&--selected {
							background-color: rgba(33, 168, 33, 0.08);
						}
					}
				}
			}

			&__cta {
				background: none;
				border: none;
				box-shadow: none;
				cursor: pointer;
				font-size: 14px;
				line-height: 1;
				margin: 0;
				outline: 0;
				padding: 9px 15px;
				pointer-events: auto;
				text-align: left;
				transition: color .2s linear;
				width: 100%;
			}
		}
	`
}

export default class Button extends BaseComponent {
	constructor (app) {
		super(app, [component])
	}
}
