/** @param {NS} ns **/
export async function main(ns) {
	const self = globalThis

	if (self.observingForTerminal) {
		return
	}

	injectStyles()

	self.observingForTerminal = true

	const tags = [
		'red',
		'blue',
		'green',
		'white',
		'black',
		'yellow',
		'pink',
		'purple',
		'orange',
		'bold',
		'italic',
		'underline',
	]
	const patterns = tags.map((tag) => new RegExp(`&lt;(${tag})&gt;(.*?)&lt;\/${tag}&gt;`, 'ig'))

	const doc = self['document']
	const observer = new MutationObserver((records) =>
		records.forEach(({ addedNodes }) => Array.from(addedNodes).forEach(colourServerOutput))
	)

	setInterval(() => {
		const terminal = doc.querySelector('#terminal:not([data-observing])')
		if (terminal) {
			terminal.dataset.observing = true
			observer.observe(terminal, { childList: true });
			[].slice.call(terminal.querySelectorAll('li:not([hasBeenColoured])')).forEach(colourServerOutput)
		}
	}, 2000)


	function colourServerOutput(element) {
		if (!element.dataset.hasBeenColoured) {
			element.dataset.hasBeenColoured = true
			const p = element.querySelector('p')
			let content = p.innerHTML
			content = content.replace(/^(\[.+\]&gt;)/, (match) => `<span class="terminal__server-name">${match}</span>`)
			for (const pattern of patterns) {
				content = content.replaceAll(pattern, '<span class="$1">$2</span>')
			}

			p.innerHTML = content
		}
	}
}


const injectStyles = () => {
	const id = 'colourful-terminal'
	const doc = globalThis['document']

	let stylesheet = doc.getElementById(id)
	if (stylesheet) {
		stylesheet.remove()
	}

	stylesheet = doc.createElement('style')
	stylesheet.id = id
	stylesheet.innerHTML = `
		.terminal__server-name {
			color: #A0A0A0;
		}

		#terminal .red {
			color: #ff4b4b;
		}

		#terminal .blue {
			color: #3699ff;
		}

		#terminal .green {
			color: #9aff14;
		}

		#terminal .white {
			color: white;
		}

		#terminal .black {
			color: #505050;
		}

		#terminal .yellow {
			color: #f3f31f;
		}

		#terminal .pink {
			color: pink;
		}

		#terminal .orange {
			color: #fdaa13;
		}

		#terminal .purple {
			color: #ad37ad;
		}

		#terminal .bold {
			font-weight: bold;
		}

		#terminal .italic {
			font-style: italic;
		}

		#terminal .underline {
			text-decoration: underline;
		}
	`
	doc.head.insertAdjacentElement('beforeend', stylesheet)
}
