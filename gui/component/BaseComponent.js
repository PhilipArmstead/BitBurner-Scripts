export default class BaseComponent {
	/**
	 * @param {{registerComponent: Function}} app
	 * @param {{name: String, template: String?, setup: Function?, style: String?}[]} components
	 */
	constructor (app, components) {
		components.forEach((component) => BaseComponent.register(app, component.name, component))
	}


	/**
	 * @param {{registerComponent: Function}} app
	 * @param {String} name
	 * @param {{name: String, template: String, setup: Function?, style: String}} component
	 */
	static register (app, name, component) {
		app.registerComponent(name, component)
	}
}
