import BaseComponent from "/gui/component/BaseComponent.js"

const component = {
	name: "ui-button",
	template: `
		<button class="btn" :class="[\`btn--theme-\${theme}\`, \`btn--type-\${type}\`]"><slot /></button>
		`,
	props: {
		theme: {
			type: String,
			default: "terminal",
			validator (value) {
				return ["win95", "terminal"].includes(value)
			}
		},
		type: {
			type: String,
			default: "primary",
			validator (value) {
				return ["primary", "secondary", "tertiary"].includes(value)
			}
		},
	},
	style: `
		.btn {
			background: none;
			border: none;
			border-radius: 2px;
			box-shadow: none;
			cursor: pointer;
			line-height: 1;
			margin: 0;
			padding: 6px 8px;
			transition: box-shadow .2s linear;
			width: auto;

			&--theme-terminal {
				box-shadow: 0 0 0px 1px #AAAAAA54;

				&:hover {
					box-shadow: 0 0 0px 1px #AAA;
				}

				&.btn--type-primary {
					border-color: #080;
					color: #0C0;
				}

				&.btn--type-secondary {
					border-color: #080;
					color: #17af17;
				}
			}

			&--type-primary {
				border: 2px solid;
				font-size: 14px;
				padding: 10px;
			}
		}
	`
}

export default class Button extends BaseComponent {
	constructor (app) {
		super(app, [component])
	}
}
