import { strict as assert } from 'assert';

export class Context {
	protected buffer: ArrayBuffer;
	protected pos: number;
	protected readonly littleEndian: boolean;

	constructor(p_buffer: ArrayBuffer, p_littleEndian?: boolean) {
		this.buffer = p_buffer;
		this.pos = 0;
		this.littleEndian = p_littleEndian === undefined || !!p_littleEndian;
	}

	sizeLeft() {
		return this.buffer.byteLength - this.pos;
	}

	tell() {
		return this.pos;
	}

	seek(p_bytes: number) {
		assert(this.pos + p_bytes >= 0);
		assert(this.pos + p_bytes <= this.buffer.byteLength);

		this.pos += p_bytes;
	}

	set(p_offset: number) {
		assert(p_offset >= 0 && p_offset <= this.buffer.byteLength);
		this.pos = p_offset;
	}

	isEOF() {
		return this.pos >= this.buffer.byteLength;
	}

	isLittleEndian() {
		return this.littleEndian;
	}

	rewind() {
		this.pos = 0;
	}
}
