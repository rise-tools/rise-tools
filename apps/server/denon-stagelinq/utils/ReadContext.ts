import { strict as assert } from 'assert';
import { Context } from './Context';

function fromCString(p_buffer: Uint8Array): string {
	const arr = String.fromCharCode.apply(null, p_buffer).split('\0');
	assert(arr.length > 0);
	return arr[0];
}

export class ReadContext extends Context {

	/**
	 * ReadContext Utility Class
	 * @internal
	 * @param p_buffer 
	 * @param p_littleEndian 
	 */
	constructor(p_buffer: ArrayBuffer, p_littleEndian = false) {
		super(p_buffer, p_littleEndian);
	}

	read(p_bytes: number): Uint8Array {
		const bytesToRead = Math.min(this.sizeLeft(), p_bytes);
		if (bytesToRead <= 0) {
			return null;
		}

		const view = new Uint8Array(this.buffer, this.pos, bytesToRead);
		this.pos += bytesToRead;
		assert(view.byteLength === bytesToRead);
		return view;
	}

	peek(p_bytes: number): Buffer {
		const bytesToRead = Math.min(this.sizeLeft(), p_bytes);
		if (bytesToRead <= 0) {
			return null;
		}

		const view = new Uint8Array(this.buffer, this.pos, bytesToRead); // Buffer.from(this.buffer.slice(this.pos, this.pos + p_bytes))
		//this.pos += bytesToRead;
		assert(view.byteLength === bytesToRead);
		return Buffer.from(view)
	}

	readRemaining(): Uint8Array {
		return this.read(this.sizeLeft());
	}

	readRemainingAsNewBuffer(): Buffer {
		const view = this.readRemaining();
		const newArrayBuffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.length);
		return Buffer.from(newArrayBuffer);
	}

	readRemainingAsNewArrayBuffer(): ArrayBuffer {
		const view = this.readRemaining();
		const newArrayBuffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.length);
		return newArrayBuffer;
	}

	readRemainingAsNewCtx(): ReadContext {

		const newArrayBuffer = this.buffer.slice(this.pos, this.pos + this.sizeLeft());
		return new ReadContext(newArrayBuffer, false);
	}

	getString(p_bytes: number): string {
		const buf = this.read(p_bytes);
		return fromCString(buf);
	}

	readNetworkStringUTF16(): string {
		// node.js only supports little endian of UTF16, and we need big endian, so read one by one
		const bytes = this.readUInt32();
		assert(bytes <= this.sizeLeft());
		assert(bytes % 2 === 0); // Should be 2 bytes per character; otherwise assert

		let result = '';
		for (let i = 0; i < bytes / 2; ++i) {
			result += String.fromCharCode(this.readUInt16());
		}
		return result;
	}

	readFloat64(): number {
		const offset = this.pos;
		if (offset + 8 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getFloat64(this.pos, this.littleEndian);
			this.pos += 8;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return null;
	}

	readUInt64(): bigint {
		const offset = this.pos;
		if (offset + 8 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getBigUint64(this.pos, this.littleEndian);
			this.pos += 8;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return null;
	}

	readUInt32(): number {
		const offset = this.pos;
		if (offset + 4 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getUint32(this.pos, this.littleEndian);
			this.pos += 4;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return null;
	}

	readInt32(): number {
		const offset = this.pos;
		if (offset + 4 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getInt32(this.pos, this.littleEndian);
			this.pos += 4;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return null;
	}

	readUInt16(): number {
		const offset = this.pos;
		if (offset + 2 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getUint16(this.pos, this.littleEndian);
			this.pos += 2;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return null;
	}

	readUInt8(): number {
		const offset = this.pos;
		if (offset + 1 <= this.buffer.byteLength) {
			const value = new DataView(this.buffer).getUint8(this.pos);
			this.pos += 1;
			return value;
		}

		assert.fail(`Read outside buffer`);
		return null;
	}

	/*
	fastForward(ctx: ReadContext, targetString: string, msgId: number): ReadContext {
	
	assert(targetString.length % 2 === 0);
	const shiftLeft = (collection:Uint8Array, value:any) => {
		for (let i = 0; i < collection.length - 1; i++) {
		collection[i] = collection[i + 1]; // Shift left
		}
		collection[collection.length - 1] = value; // Place new value at tail
		return collection;
	}

	const ctxSize = ctx.sizeLeft();
	const bufferSize = (targetString.length / 2);
	let checkBufferArray = new Uint8Array(bufferSize);
	checkBufferArray.fill(0);
	let count = 0;

	while (Buffer.from(checkBufferArray).toString('hex') !== targetString) {
		shiftLeft(checkBufferArray, ctx.read(1));
		count++
		if (ctx.isEOF()) {
		ctx.seek(0-ctxSize)
		Logger.debug(`[${msgId}] fastForwarded checked ${count} bytes, returned original`);
		return ctx
		}
	} 
	ctx.seek(0-bufferSize);
	if (count !== bufferSize) {
		Logger.debug(`[${msgId}] fastForwarded ${count} bytes`);
	}
	return ctx
	};
	*/
}

