export default `
	.window.window--macros {
		width: 10vw;
	}

	.window.window--macros .window__content {
		flex: 100%;
	}

	.window--macros .macro-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.window--macros .macro {
		margin: 0 15px 8px 3px;
	}

	.window--macros .macro__cta {
		background: none;
		border: none;
		border-radius: 2px
		box-shadow: 0 0 0px 1px #AAAAAA54;
		color: inherit;
		cursor: pointer;
		padding: 6px 8px;
		transition: box-shadow .2s linear;
	}

	.window--macros .macro__cta:hover {
		box-shadow: 0 0 0px 1px #AAA;
	}
`
