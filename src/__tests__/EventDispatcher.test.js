import EventDispatcher from '../EventDispatcher'

class C extends EventDispatcher {
	constructor() {
		super()
	}
}

describe('EventDispatcher', () => {
	let instance = null
	let handler = null

	beforeEach(() => {
		instance = new C()
		handler = jest.fn()
	})

	afterEach(() => {
		instance.cleanup()
		instance = null
	})

	it('should addEventListener be defined', () => {
		expect(instance.addEventListener).toBeDefined()
	})

	it('should removeEventListener be defined', () => {
		expect(instance.removeEventListener).toBeDefined()
	})

	it('should dispatchEvent be defined', () => {
		expect(instance.dispatchEvent).toBeDefined()
	})

	it('should not trigger event if there no subscription', () => {
		const event = new Event('foo')

		instance.dispatchEvent(event)
		expect(handler).not.toHaveBeenCalled()
	})

	it('should trigger event if a subscription has been added', () => {
		const event = new Event('foo')

		instance.addEventListener('foo', handler)
		instance.dispatchEvent(event)
		expect(handler).toHaveBeenCalledWith(event)
	})

	it('should trigger multiple events if a subscription has been added', () => {
		const event = new Event('foo')

		instance.addEventListener('foo', handler)

		instance.dispatchEvent(event)
		instance.dispatchEvent(event)
		instance.dispatchEvent(event)

		expect(handler).toHaveBeenCalledTimes(3)
	})

	describe('`once` option', () => {
		it('should trigger multiple events if `once` option as been set to false', () => {
			const event = new Event('foo')

			instance.addEventListener('foo', handler, { once: false })

			instance.dispatchEvent(event)
			instance.dispatchEvent(event)
			instance.dispatchEvent(event)

			expect(handler).toHaveBeenCalledTimes(3)
		})

		it('should trigger single event if `once` option as been set to true', () => {
			const event = new Event('foo')

			instance.addEventListener('foo', handler, { once: true })

			instance.dispatchEvent(event)
			instance.dispatchEvent(event)
			instance.dispatchEvent(event)

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should trigger single event if `once` option as been set to whatever false-converted', () => {
			const event = new Event('foo')

			instance.addEventListener('foo', handler, { once: 0 })

			instance.dispatchEvent(event)
			instance.dispatchEvent(event)
			instance.dispatchEvent(event)

			expect(handler).toHaveBeenCalledTimes(3)
		})

		it('should trigger single event if `once` option as been set to whatever true-converted', () => {
			const event = new Event('foo')

			instance.addEventListener('foo', handler, { once: 'foo' })

			instance.dispatchEvent(event)
			instance.dispatchEvent(event)
			instance.dispatchEvent(event)

			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	it('should trigger single event if several subscriptions have been added for the same handler', () => {
		const event = new Event('foo')

		instance.addEventListener('foo', handler)
		instance.addEventListener('foo', handler)

		instance.dispatchEvent(event)

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should trigger single event if several subscriptions have been added for multiple handlers', () => {
		const fooEvent = new Event('foo')

		const handler2 = jest.fn()
		instance.addEventListener('foo', handler)
		instance.addEventListener('foo', handler2)

		instance.dispatchEvent(fooEvent)

		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler2).toHaveBeenCalledTimes(1)

		instance.removeEventListener('foo', handler2)
	})

	it('should not trigger event if a subscription has be removed', () => {
		const event = new Event('foo')

		instance.addEventListener('foo', handler)

		instance.removeEventListener('foo', handler)
		instance.removeEventListener('bar', handler)

		instance.dispatchEvent(event)
		expect(handler).not.toHaveBeenCalled()
	})

	it('should not trigger event for a specific type if instance has been clear for that event', () => {
		const fooEvent = new Event('foo')
		const barEvent = new Event('bar')

		instance.addEventListener('foo', handler)
		const barHandler = jest.fn()
		const barHandler2 = jest.fn()
		instance.addEventListener('bar', barHandler)
		instance.addEventListener('bar', barHandler2)

		instance.clearType('bar')
		instance.clearType('gag')

		instance.dispatchEvent(fooEvent)
		expect(handler).toHaveBeenCalled()

		instance.dispatchEvent(barEvent)
		expect(barHandler).not.toHaveBeenCalled()
		expect(barHandler2).not.toHaveBeenCalled()
	})

	it('should not trigger events if instance has been clean up', () => {
		const fooEvent = new Event('foo')
		const barEvent = new Event('bar')

		instance.addEventListener('foo', handler)
		const barHandler = jest.fn()
		const barHandler2 = jest.fn()
		instance.addEventListener('bar', barHandler)
		instance.addEventListener('bar', barHandler2)

		instance.cleanup()

		instance.dispatchEvent(fooEvent)
		expect(handler).not.toHaveBeenCalled()

		instance.dispatchEvent(barEvent)
		expect(barHandler).not.toHaveBeenCalled()
		expect(barHandler2).not.toHaveBeenCalled()
	})
})
