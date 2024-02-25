'use strict';
const assert = require('assert');
import { Context } from './Context';

interface WriteContextConstructOptions {
	size?: number;
	autoGrow?: boolean;
	littleEndian?: boolean;
}

export class WriteContext extends Context {
	autoGrow: boolean;

	/**
	 * WriteContext Utility Class
	 * @internal
	 * @param {WriteContextConstructOptions} p_options 
	 */
	constructor(p_options?: WriteContextConstructOptions) {
		const buffer = new ArrayBuffer(p_options && p_options.size > 0 ? p_options.size : 128);
		super(buffer, !p_options ? false : !!p_options.littleEndian);
		this.autoGrow = !p_options || (p_options.autoGrow ? !!p_options.autoGrow : true);
	}

	getBuffer(): Buffer {
		const newBuf = Buffer.from(this.buffer, 0, this.pos);
		return newBuf;
	}

	sizeLeft(): number {
		return this.buffer.byteLength - this.pos;
	}

	checkSize(p_size: number): void {
		while (true) {
			const diff = this.sizeLeft() - p_size;
			if (diff >= 0) {
				break;
			}
			if (this.autoGrow) {
				this.resize();
				continue;
			}
			assert.fail(`Writing ${-diff} bytes OOB of fixed size buffer`);
		}
	}

	resize(): void {
		assert(this.autoGrow);
		const size = this.buffer.byteLength;
		const newBuffer = new ArrayBuffer(size * 2);
		new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
		this.buffer = newBuffer;
	}

	write(p_buffer: Uint8Array, p_bytes: number = -1): number {
		if (p_bytes <= 0) {
			p_bytes = p_buffer.byteLength;
		}

		this.checkSize(p_bytes);

		new Uint8Array(this.buffer).set(p_buffer, this.pos);
		this.pos += p_bytes;
		return p_bytes;
	}

	writeFixedSizedString(p_string: string): number {
		for (let i = 0; i < p_string.length; ++i) {
			this.writeUInt8(p_string.charCodeAt(i));
		}
		return p_string.length;
	}

	writeNetworkStringUTF16(p_string: string): number {
		let written = this.writeUInt32(p_string.length * 2);
		for (let i = 0; i < p_string.length; ++i) {
			written += this.writeUInt16(p_string.charCodeAt(i));
		}
		return written;
	}

	writeUInt64(p_value: bigint): number {
		this.checkSize(8);
		new DataView(this.buffer).setBigUint64(this.pos, p_value, this.littleEndian);
		this.pos += 8;
		return 8;
	}

	writeUInt32(p_value: number): number {
		this.checkSize(4);
		new DataView(this.buffer).setUint32(this.pos, p_value, this.littleEndian);
		this.pos += 4;
		return 4;
	}

	writeInt32(p_value: number): number {
		this.checkSize(4);
		new DataView(this.buffer).setInt32(this.pos, p_value, this.littleEndian);
		this.pos += 4;
		return 4;
	}

	writeUInt16(p_value: number): number {
		this.checkSize(2);
		new DataView(this.buffer).setUint16(this.pos, p_value, this.littleEndian);
		this.pos += 2;
		return 2;
	}

	writeUInt8(p_value: number): number {
		this.checkSize(1);
		new DataView(this.buffer).setUint8(this.pos, p_value);
		this.pos += 1;
		return 1;
	}
}
