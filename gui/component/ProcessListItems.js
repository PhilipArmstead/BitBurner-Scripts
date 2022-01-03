import BaseComponent from "/gui/component/BaseComponent.js"

const component = {
	name: "process-list-items",
	template: `
		<div
			v-for="({ hosts, expiry, progress, target, threads, type }, index) in processes"
			class="process"
			:class="[\`process--type-\${type}\`]"
			:key="index"
		>
			<div class="process-cell process__item" :title="\`Running on \${hosts}\`">
				{{ target }}
				<span v-show="progress" class="process__progress-bar" :style="{ width: \`\${progress}%\` }" />
			</div>
			<div class="process-cell process__threads">
				{{ threads }}
			</div>
		</div>
		`,
	props: {
		processes: {
			type: Array,
			required: true,
		},
	},
	style: `
		.process {
			color: #00a5f3;
			display: flex;
			flex: 1 0 100%;
			position: relative;
	
			&.process--type-weaken {
				color: #f3f330;
			}
	
			&.process--type-hack {
				color: #33d833;
			}
	
			&__progress-bar {
				background: currentColor;
				bottom: 0;
				left: 0;
				opacity: 0.3;
				position: absolute;
				top: 0;
			}
		}
	`
}

export default class Window extends BaseComponent {
	constructor (app) {
		super(app, [component])
	}
}
