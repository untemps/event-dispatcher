class EventDispatcher {
	_listeners = null

	constructor() {
		this._listeners = {}
	}

	addEventListener(type, callback, options = { once: false }) {
		if (this._listeners.hasOwnProperty(type) && !!this._listeners[type].find(({ callback: c }) => c === callback)) {
			return
		}
		if (!this._listeners.hasOwnProperty(type)) {
			this._listeners[type] = []
		}
		this._listeners[type].push({ callback, options })
	}

	removeEventListener(type, callback) {
		if (!this._listeners.hasOwnProperty(type)) {
			return
		}
		this._listeners[type] = this._listeners[type].filter(({ callback: c }) => c !== callback)
	}

	dispatchEvent(event) {
		if (!this._listeners.hasOwnProperty(event.type)) {
			return true
		}
		this._listeners[event.type].forEach(({ callback: c, options: o }) => {
			c.call(this, event)
			if (!!o.once) {
				this.removeEventListener(event.type, c)
			}
		})
		return !event.defaultPrevented
	}

	clearType(type) {
		if (!this._listeners.hasOwnProperty(type)) {
			return
		}
		this._listeners[type].forEach(({ callback: c }) => this.removeEventListener(type, c))
	}

	cleanup() {
		for (let type in this._listeners) {
			this._listeners[type].forEach(({ callback: c }) => this.removeEventListener(type, c))
		}
	}
}

export default EventDispatcher
