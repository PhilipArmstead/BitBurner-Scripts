import BaseComponent from "/gui/component/BaseComponent.js"
import { icons } from "/gui/lib/constants.js"

const component = {
	name: "server-list-tree",
	template: `
		<ul class="server-list">
			<li
				v-for="(server, index) in servers"
				:key="index"
				class="server"
				:class="{ 'server--is-filtered': server.isFiltered }"
			>
				<span class="server__item">
					<template v-if="!server.purchasedByPlayer">
						<button
							class="icon icon--hacked"
							:class="server.hasRootClass"
							:title="server.hasRootTitle"
							v-html="icons.hacked"
							@click="$emit('click:hack', server)"
						/>
						<button
							class="icon icon--backdoored"
							:class="server.hasBackdoorClass"
							:title="server.hasBackdoorTitle"
							v-html="icons.backdoor"
							@click="$emit('click:backdoor', server)"
						/>
					</template>
					<button class="server__connect" @click="$emit('click:connect', server)">{{ server.hostname }}</button>
					<span v-if="server.contractCount" class="server__contract-count">
						<span class="icon icon--contract" v-html="icons.contract" /> x{{ server.contractCount }}
					</span>
				</span>
				<server-list-tree
					v-if="server.connections.length"
					:servers="server.connections"
					@click:backdoor="$emit('click:backdoor', $event)"
					@click:connect="$emit('click:connect', $event)"
					@click:hack="$emit('click:hack', $event)"
				/>
			</li>
		</ul>
		`,
	props: {
		servers: {
			type: Array,
			required: true,
		},
	},
	setup () {
		return { icons }
	},
	style: `
		.server-list {
			&, .server-list, .server-list .server {
				list-style: none;
			}
		
			.server-list {
				padding-left: 20px;
			}

			.server {
				&--is-filtered {
					> .server__item {
						display: none;
					}
				}
			}
		
			.server__item {
				display: inline-block;
				padding: 1px 5px;
				vertical-align: middle;
				white-space: nowrap;
			}
		
			.icon {
				background: none;
				border: none;
				color: #F00;
				display: inline-block;
				height: 13px;
				padding: 0;
				transition: opacity linear .2s;
				width: 13px;

				&.icon--hacked, &.icon--backdoored {
					margin-right: 4px;
				}
		
				* {
					pointer-events: none;
				}
			}
		
			button.icon {
				cursor: pointer;
		
				&:hover {
					opacity: 0.6;
				}
			}
		
			.icon--hacked.icon--can-hack, .icon--backdoored.icon--can-backdoor {
				color: #64a9ff;
			}
		
			.icon--hacked.icon--has-hacked, .icon--backdoored.icon--has-backdoored, .icon--contract {
				color: inherit;
			}
		
			.server__contract-count {
				color: yellow;
				margin-left: 10px;
			}
		
			.server__connect {
				background: none;
				border: none;
				color: inherit;
				cursor: pointer;
				padding: 0;
				text-decoration: dotted underline;
				transition: text-decoration linear .2s;
		
				&:hover {
					text-decoration-style: double;
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
