export const HOME = "home"
export const LAST_COMMAND_LOG = "last-command.txt"
export const CUSTOM_STYLESHEET_NAME = "custom-styles"
export const EMPTY_PORT_DATA = "NULL PORT DATA"
export const Port = {
	SERVER_LIST: 0,
	GROW_IN_PROGRESS: 1,
	HACK_IN_PROGRESS: 2,
	WEAKEN_IN_PROGRESS: 3,
}
export const Command = {
	WEAKEN: 0,
	HACK: 1,
	GROW: 2,
}
export const CommandScripts = {
	[Command.WEAKEN]: "/attacks/weaken.js",
	[Command.HACK]: "/attacks/hack.js",
	[Command.GROW]: "/attacks/grow.js",
}
