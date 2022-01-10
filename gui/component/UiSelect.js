import BaseComponent from "/gui/component/BaseComponent.js"

const component = {
	name: "ui-select",
	template: `
		<div class="select" :class="[\`select--theme-\${theme}\`, { 'select--is-visible': isVisible }]">
			<p ref="selectToggle" class="select__cta" @click="toggleMenuVisibility">{{ displayValue }}</p>
			<teleport to="body">
				<ul class="ui-select select__list">
					<li v-for="(label, value) in choices" class="select__choice">
						<button class="select__cta" @click.prevent="select(value)">{{ label }}</button>
					</li>
				</ul>
			</teleport>
		</div>
		`,
	props: {
		theme: {
			type: String,
			default: "terminal",
			validator (value) {
				return ["win95", "terminal"].includes(value)
			}
		},
		choices: {
			type: [Array, Object],
			required: true,
		},
	},
	setup (props, { emit }) {
		const { computed, ref } = Vue
		const selectToggle = ref(null)
		const isVisible = ref(false)
		const selected = ref()
		const displayValue = computed(() => selected.value || "Select an option")
		const select = (value) => {
			selected.value = props.choices[value]
			emit('select:input', value)
		}
		const toggleMenuVisibility = () => isVisible.value = !isVisible.value

		const setListPosition = () => {
			console.log(selectToggle.value.getBoundingClientRect())
		}

		return { displayValue, isVisible, selected, selectToggle, select, toggleMenuVisibility }
	},
	style: `
		.select {
			display: flex;
			flex-direction: column;
			position: relative;
		
			&:not(.select--is-visible) .select__list {
				opacity: 0;
				transform: scale(0.4);
			}
		
			&--theme-terminal {
				background-color: rgb(18, 20, 21);
				border: 1px solid rgb(64, 64, 64);
				box-shadow: #0003 0 5px 5px -3px, #00000024 0px 8px 10px 1px, #0000001f 0px 3px 14px 2px;
		
				.select__cta {
					color: #17af17;
		
					&:hover {
						color: #0C0;
					}
		
					&--selected {
						background-color: rgba(33, 168, 33, 0.08);
					}
				}
			}
		
			&__list.ui-select, &__choice {
				list-style: none;
				margin: 0;
			}
		
			&__list.ui-select {
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
