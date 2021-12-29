export default `
	.btn {
		background-color: #d6cec8;
		border: none;
		box-shadow: inset -1px -1px #404040, inset 1px 1px #fff, inset -2px -2px gray, inset 2px 2px #eceae7;
		font-size: 13px;
		height: 26px;
		padding: 4px 6px;
		text-decoration: none;
		vertical-align: middle;
	}
	
	.btn:active {
		box-shadow: inset -1px -1px #fff, inset 1px 1px #404040, inset -2px -2px #eceae7, inset 2px 2px gray;
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
		align-items: flex-start;
		display: inline-flex;
		flex-direction: column;
		left: 0;
		min-height: 220px;
		min-width: 220px;
		overflow: hidden;
		pointer-events: auto;
		position: absolute;
		resize: both;
		top: 0;
		width: 50vw;
	}
	
	.window--minimised {
		height: auto !important;
		min-height: 0;
		min-width: 0;
		resize: none;
		width: auto !important;
	}
	
	.window--minimised .window__content,
	.window--minimised .window__cta-group .icon--minimise,
	.window:not(.window--minimised) .window__cta-group .icon--restore {
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
	
	.window__menu span:hover {
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
	
	.window__cta-group .icon--restore {
		color: #d6cec8;
	}
	
	.window__content {
		background: #FFF;
		display: flex;
		flex: 0 1 100%;
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
	.window--server-list {
		height: 70vh;
		width: 22vw;
	}

	.server-list__refresh, .server-list__search, .server-list__search-input {
		background: none;
		border: 1px solid;
		color: currentColor;
		cursor: pointer;
		margin: 0;
		min-width: 65px;
		padding: 4px;
		position: fixed;
		right: 26px;
	}
	
	.server-list__refresh {
		top: 36px;
	}
	
	.server-list__search-input {
		top: 69px;
		transition: .2s cubic-bezier(0.4, 0.0, 0.2, 1);
		transition-property: color, width;
		width: 65px;
	}
	
	.server-list__search-input::-webkit-input-placeholder {
		color: #006F00;
	}
	
	.server-list__search-input:not([type="search"])::-webkit-input-placeholder {
		color: inherit;
		text-align: center;
	}
	
	.server-list__search-input[type="search"] {
		width: 130px;
	}
	
	.server-list {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	
	.server-list.server-list--filtered ul {
		padding-left: 0;
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
	
	.server-list .server__item.server--filtered {
		display: none;
	}
	
	.server-list .icon * {
		pointer-events: none;
	}
	
	.server-list .icon {
		background: none;
		border: none;
		color: #F00;
		display: inline-block;
		height: 13px;
		padding: 0;
		transition: opacity linear .2s;
		width: 13px;
	}
	
	.server-list button.icon {
		cursor: pointer;
	}
	
	.server-list button.icon:hover {
		opacity: 0.6;
	}
	
	.server-list .icon--hacked.icon--can-hack, .server-list .icon--backdoored.icon--can-backdoor {
		color: #64a9ff;
	}
	
	.server-list .icon--hacked.icon--has-hacked, .server-list .icon--backdoored.icon--has-backdoored, .server-list .icon--contract {
		color: inherit;
	}
	
	.server-list .server__contract-count {
		color: yellow;
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
	.window.window--theme-terminal .window__content::-webkit-scrollbar {
		display: block;
		width: 10px;
	}

	.window.window--theme-terminal .window__content::-webkit-scrollbar-track {
		background-color: #00cc0021;
	}

	.window.window--theme-terminal .window__content::-webkit-scrollbar-thumb {
		background-color: #0c0;
	}

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
		box-shadow: inset -1px -1px #404040, inset 1px 1px #eceae7, inset -2px -2px gray, inset 2px 2px #fff;
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
		background: linear-gradient(to right, #0A246A 0%, #A6CAF0 100%);
		color: #fff;
	}
	`
