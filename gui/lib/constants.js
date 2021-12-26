export const windowContainerId = "window-container"
export const stylesheetId = `${windowContainerId}-styles`
export const windowFocusedClass = "window--focused"

export const icons = {
	hacked: `
		<svg viewBox="0 0 512 512" fill="currentColor">
			<path d="M251.092.049C121.207 2.652 16.552 109.664 16.696 239.575c.083 75.073 34.866 141.875 89.043 185.668v70.062c0 9.22 7.475 16.696 16.696 16.696h33.391c9.22 0 16.696-7.475 16.696-16.696v-32.919c0-8.99 6.909-16.726 15.889-17.149 9.588-.451 17.503 7.188 17.503 16.677v33.391c0 9.22 7.475 16.696 16.696 16.696s16.696-7.475 16.696-16.696v-32.919c0-8.99 6.909-16.726 15.889-17.149 9.588-.451 17.503 7.188 17.503 16.677v33.391c0 9.22 7.475 16.696 16.696 16.696s16.696-7.475 16.696-16.696v-32.919c0-8.99 6.909-16.726 15.889-17.149 9.588-.451 17.503 7.188 17.503 16.677v33.391c0 9.22 7.475 16.696 16.696 16.696h33.391c9.22 0 16.696-7.475 16.696-16.696v-70.062c54.242-43.845 89.043-110.756 89.043-185.938C495.305 105.508 385.502-2.643 251.092.049zM150.261 322.783c-36.883 0-66.783-29.9-66.783-66.783s29.9-66.783 66.783-66.783 66.783 29.9 66.783 66.783-29.9 66.783-66.783 66.783zm150.934 61.891a16.642 16.642 0 0 1-11.804 4.892 16.643 16.643 0 0 1-11.805-4.892L256 363.087l-21.587 21.587c-6.521 6.521-17.087 6.521-23.609 0-6.521-6.521-6.521-17.087 0-23.609l33.391-33.391c6.521-6.521 17.087-6.521 23.609 0l33.391 33.391c6.523 6.522 6.523 17.087 0 23.609zm60.544-61.891c-36.883 0-66.783-29.9-66.783-66.783s29.9-66.783 66.783-66.783 66.783 29.9 66.783 66.783-29.9 66.783-66.783 66.783z"/>
		</svg>
	`,
	backdoored: `
		<svg viewBox="0 0 53.25 53.25" fill="currentColor">
			<path d="M43.375 0h-33.5c-.101 0-.199.011-.295.03h-.004a1.49 1.49 0 0 0-.307.1c-.025.011-.047.026-.071.039-.071.036-.14.076-.204.123-.012.008-.025.012-.035.021-.02.014-.034.034-.053.05a1.474 1.474 0 0 0-.337.413c-.018.032-.037.063-.052.096-.032.07-.057.143-.078.218-.008.028-.02.055-.026.084a1.468 1.468 0 0 0-.038.326v43.378c0 .156.031.303.075.444.008.025.014.05.023.074.05.134.117.258.201.371.015.02.031.038.047.057.093.113.198.217.32.299l.004.002c.125.083.265.142.412.185.014.004.024.014.038.017l26.199 6.872a1.495 1.495 0 0 0 1.297-.264 1.5 1.5 0 0 0 .583-1.188V8.372a1.5 1.5 0 0 0-1.12-1.451L21.505 3h20.37v41.878a1.5 1.5 0 1 0 3 0V1.5a1.5 1.5 0 0 0-1.5-1.5zM23.933 28.838a1.502 1.502 0 0 1 1.855-1.03l7 2a1.5 1.5 0 0 1-.824 2.884l-7-2a1.5 1.5 0 0 1-1.031-1.854z"/>
		</svg>
	`,
}

export const css = `
	.btn {
		background-color: #d6cec8;
		border: none;
		box-shadow: inset -1px -1px #404040,inset 1px 1px #fff,inset -2px -2px gray,inset 2px 2px #eceae7;
		font-size: 13px;
		height: 26px;
		padding: 4px 6px;
		text-decoration: none;
		vertical-align: middle;
	}
	
	.btn:active {
		box-shadow: inset -1px -1px #fff,inset 1px 1px #404040,inset -2px -2px #eceae7,inset 2px 2px gray;
		padding: 5px 5px 3px 7px;
	}
	
	.btn--small {
		font-size: 10px;
		height: 18px;
		min-width: 18px;
	}
	
	.btn--small, .btn--small:active {
		padding: 3px;
	}
	
	.btn > * {
		pointer-events: none;
	}
	
	.window-container {
		bottom: 0;
		left: 0;
		pointer-events: none;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 9999;
	}
	
	.window--focused {
		z-index: 1501;
	}
	
	.window-container * {
		box-sizing: border-box;
	}
	
	.window {
		align-items: center;
		display: inline-flex;
		flex-wrap: wrap;
    left: 0;
		max-width: 65vw;
		min-width: 35vw;
		pointer-events: auto;
		position: absolute;
    top: 0;
	}

	.window--minimised {
		min-width: 0;
	}

	.window--minimised .window__content {
		display: none;
	}
	
	.window__toolbar {
		background: gray;
		display: flex;
		padding: 3px 3px 3px 8px;
		user-select: none;
		width: 100%;
	}
	
	.window__icon {
		align-self: center;
		max-height: 16px;
		margin-right: 6px;
		object-fit: contain;
		width: 16px;
	}
	
	.window__menu {
		width: 100%;
		background: rgb(212, 208, 200);
		color: #333;
		padding-left: 5px;
		padding-bottom: 2px;
	}

	.window__menu span {
		padding: 0 1px;
		margin-right: 12px;
		font-size: 15px;
		border: 1px inset transparent;
		cursor: pointer;
	}
	.window__menu span:hover{
		border: 1px inset #bdbdbd;
	}
	
	.window__title {
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
	
	.window__cta-group {
		align-items: center;
		display: flex;
		flex: 1 0 auto;
		margin-left: auto;
	}
	
	.window__cta-group > * {
		background-position: 50% 50%;
		background-size: 14px auto;
	}
	
	.window__content {
		background: #FFF;
		display: flex;
		flex: 1 0 auto;
		height: inherit;
		max-height: 75vh;
		min-height: 27vh;
		overflow: auto;
		padding: 6px;
		width: 100%;
	}
	
	.file-list {
		align-content: flex-start;
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		margin: 0;
		overflow: auto;
		padding: 0;
	}
	
	.file-list__item {
		margin-bottom: 8px;
		text-align: center;
		width: 100px;
	}
	
	.file-list__button {
		align-items: center;
		appearance: none;
		border: 1px dotted transparent;
		border-radius: 2px;
		background: none;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 2px;
		width: inherit;
	}
	
	.file-list__button:focus {
		background: rgba(15, 75, 255, .3);
		border-color: #222;
	}
	
	.file-list__icon {
		height: 38px;
		width: 32px;
	}
	
	.file-list__label {
		color: #222;
		text-shadow: none;
		word-wrap: anywhere;
	}
	
	.block-but-hidden {
		display: block !important;
		visibility: hidden !important;
	}
	
	/** Apps **/
	.server-list__container {
		overflow-y: scroll;
		position: relative;
		width: 100%;
	}

	.server-list__container::-webkit-scrollbar {
		display: block;
		width: 10px;
	}

	.server-list__container::-webkit-scrollbar-track  {
		background-color: #00cc0021;
	}
	
	.server-list__container::-webkit-scrollbar-thumb {
		background-color: #0c0;
	}

	.server-list__refresh {
		background: none;
		border: 1px solid;
		color: currentColor;
		cursor: pointer;
		margin: 0;
		padding: 4px;
		position: absolute;
		right: 14px;
		top: 0;
	}

	.server-list {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}

	.server-list, .server-list ul, .server-list li {
		list-style: none;
	}

	.server-list ul {
		padding-left: 20px;
	}

	.server-list .server__item {
		display: inline-block;
		padding: 1px 5px;
		vertical-align: middle;
	}

	.server-list .icon * {
		pointer-events: none;
	}

	.server-list button.icon {
		background: none;
		border: none;
		color: #F00;
		cursor: pointer;
		display: inline-block;
		height: 13px;
		padding: 0;
		transition: opacity linear .2s;
		width: 13px;
	}

	.server-list button.icon:hover {
		opacity: 0.6;
	}

	.server-list .icon--hacked.icon--has-hacked, .server-list .icon--backdoored.icon--has-backdoored {
		color: inherit;
	}

	.server-list .server__connect {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0;
		text-decoration: dotted underline;
		transition: text-decoration linear .2s;
	}

	.server-list .server__connect:hover {
    text-decoration-style: double;
	}

	/** Themes */
	/** Terminal */
	.window.window--theme-terminal {
		border: 1px solid #666;
		font-family: Consolas, 'Liberation Mono', 'Fira Code', monospace;
	}

	.window.window--theme-terminal .window__toolbar {
		background: #111;
		color: #FFF;
	}

	.window.window--theme-terminal .window__content {
		background: #000000d6;
		color: #0c0;
	}

	/** Windows */
	.window.window--theme-windows {
		box-shadow: inset -1px -1px #404040,inset 1px 1px #eceae7,inset -2px -2px gray,inset 2px 2px #fff;
		font-family: Tahoma, "Segoe UI", Geneva, sans-serif;
		padding: 2px;
	}

	.window.window--theme-windows .window__toolbar {
		border: 1px solid #D4D0C8;
	}

	.window.window--theme-windows .window__content {
		background: #FFF;
		border: 2px solid #D4D0C8;
		border-top: none;
	}
	
	.window.window--theme-windows.window--focused .window__toolbar {
		background: linear-gradient(to right,#0A246A 0%,#A6CAF0 100%);
		color: #fff;
	}
`
