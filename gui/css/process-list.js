export default `
	.window.window--script-monitor {
		height: 400px;
		width: 300px;
	}

	.process-list__container .process-list__head button {
		background: none;
		border: none;
		color: #FFF;
		font: inherit;
		pointer-events: cursor;
	}

	.process-list > * {
		display: flex;
		flex-wrap: wrap;
	}

	.process-list__head {
		flex: 1 0 auto;
		margin-bottom: 4px;
	}

	.process-list__head .process-cell {
		display: block;
	}

	.process {
		display: flex;
		flex: 1 0 100%;
	}

	.process-cell {
		padding: 2px 1px;
		text-align: left;
	}

	.process-cell:last-child {
		margin-left: auto;
		text-align: right;
	}

	.process__progress-bar {
		background: currentColor;
		bottom: 0;
		left: 0;
		opacity: 0.3;
		position: absolute;
		top: 0;
	}

	.process {
		color: #00a5f3;
		display: flex;
		flex: 1 0 100%;
		position: relative;
	}

	.process--type-weaken {
		color: #f3f330;
	}

	.process--type-hack {
		color: #33d833;
	}
`
