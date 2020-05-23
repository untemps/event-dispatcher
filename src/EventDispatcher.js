class EventDispatcher {
	_listeners = null

	constructor() {
		this._listeners = {}
	}

	addEventListener(type, callback) {
		if (!!this._listeners[type] && this._listeners[type].includes(callback)) {
			return
		}
		if (!this._listeners[type]) {
			this._listeners[type] = []
		}
		this._listeners[type].push(callback)
	}

	removeEventListener(type, callback) {
		if (!this._listeners[type]) {
			return
		}
		this._listeners[type] = this._listeners[type].filter((c) => c !== callback)
	}

	dispatchEvent(event) {
		if (!this._listeners[event.type]) {
			return true
		}
		this._listeners[event.type].forEach((c) => c.call(this, event))
		return !event.defaultPrevented
	}

	clearType(type) {
		if (!this._listeners[type]) {
			return
		}
		this._listeners[type].forEach((c) => this.removeEventListener(type, c))
	}

	cleanup() {
		for (let type in this._listeners) {
			if (!!this._listeners[type]) {
				this._listeners[type].forEach((c) => this.removeEventListener(type, c))
			}
		}
	}
}

export default EventDispatcher
