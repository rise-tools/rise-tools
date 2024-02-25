
class InvalidDeviceIdError extends Error {
	constructor(m?: string) {
		super(m || 'Error: invalid DeviceId !');

		// Set the prototype explicitly.
		Object.setPrototypeOf(this, InvalidDeviceIdError.prototype);
	}
}


export class DeviceId {
	protected m_str: string;
	protected m_array: Uint8Array;
	/**
	 * DeviceId
	 * @constructor
	 * @param {(string | Uint8Array)} deviceId string or Uint8Array to initialize new DeviceId
	 */
	constructor(deviceId: string | Uint8Array) {
		switch (typeof deviceId) {
			case "string": {
				const reg: RegExp = new RegExp('[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}', 'i');
				if (!reg.test(deviceId)) throw new InvalidDeviceIdError();
				this.m_str = deviceId;
				this.m_array = Buffer.from(deviceId.split('-').join(), 'hex') as Uint8Array;
				break;
			}
			case "object": {
				this.m_array = deviceId;
				this.m_str = /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/i
					.exec(Buffer.from(deviceId as Uint8Array).toString('hex'))
					.splice(1)
					.join('-') as string;
				break;
			}
			default: {
				throw new InvalidDeviceIdError();
				break;
			}
		}
	}

	/**
	 * Return DeviceId as string
	 */
	get string() {
		return this.m_str
	}

	/**
	 * Return DeviceId as Uint8Array
	 */
	get array() {
		return this.m_array
	}

}