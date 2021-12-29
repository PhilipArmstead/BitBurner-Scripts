export default `
	.toast-container {
		align-items: flex-end;
		bottom: 20px;
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-start;
		left: 0;
		pointer-events: none;
		position: fixed;
		right: 17px;
		top: 0;
	}
	
	.toast__message {
		background: #000c;
		margin-top: 10px;
		overflow: visible;
		transition: .3s cubic-bezier(0.4, 0.0, 0.2, 1);
		transition-property: margin, opacity, transform;
	}
	
	.toast__message:not(.toast--show) {
		margin-top: -50px;
		opacity: 0;
		transform: translateX(100%);
	}
	
	.toast__message--theme-success .toast__message-inner {
		border-color: #33d8337a;
	}
	
	.toast__message--theme-success .toast__text {
		color: #33d833;
	}
	
	.toast__message-inner {
		align-items: center;
		border: 2px solid #00a5f37a;
		border-radius: 4px;
		box-sizing: border-box;
		display: flex;
		font-family: "Lucida Console", "Lucida Sans Unicode", "Fira Mono", Consolas, "Courier New", Courier, monospace;
		font-weight: 400;
		font-size: 0.875rem;
		line-height: 1.43;
		min-height: 50px;
		padding: 6px 16px;
		pointer-events: auto;
	}
	
	.toast__text {
		color: #00a5f3;
		margin: 0;
	}
`
