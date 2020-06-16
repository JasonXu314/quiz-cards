import { EventWithTypes } from 'types';

export default class MySocket {
	private readonly socket: WebSocket;

	constructor(url: string) {
		this.socket = new WebSocket(url);
	}

	on<K extends keyof WebSocketEventMap>(evt: K, listener: (evt: WebSocketEventMap[K]) => void): () => void {
		this.socket.addEventListener(evt, listener);
		return () => {
			this.socket.removeEventListener(evt, listener);
		};
	}

	once<K extends keyof WebSocketEventMap>(evt: K, listener: (evt: WebSocketEventMap[K]) => void): () => void {
		this.socket.addEventListener(evt, listener, { once: true });
		return () => {
			this.socket.removeEventListener(evt, listener);
		};
	}

	json<T>(msg: T): void {
		this.socket.send(JSON.stringify(msg));
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
		this.socket.send(data);
	}

	onMsg<T extends EventWithTypes>(listener: (data: T) => void): () => void {
		return this.on('message', (evt) => {
			let data: any;
			try {
				data = JSON.parse(evt.data);
			} catch (_) {
				data = evt.data;
			}
			listener(data);
		});
	}

	onMsgOnce<T extends EventWithTypes>(listener: (data: T) => void): () => void {
		return this.once('message', (evt) => {
			listener(JSON.parse(evt.data));
		});
	}

	expect<T extends EventWithTypes>(type: T['type'], cb: (evt: T) => void, config: { once: boolean }): () => void {
		if (config.once) {
			const unsubscribe = this.onMsg<T>((msg) => {
				if (msg.type === type) {
					cb(msg);
					unsubscribe();
				}
			});
			return unsubscribe;
		} else {
			return this.onMsg<T>((msg) => {
				if (msg.type === type) {
					cb(msg);
				}
			});
		}
	}

	public get ready(): boolean {
		return this.socket.readyState === WebSocket.OPEN;
	}
}
