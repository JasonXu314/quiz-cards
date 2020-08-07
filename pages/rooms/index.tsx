import { parseCookies } from '@/util';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import styles from '../../sass/RoomIndex.module.scss';

interface IndexInitialProps {
	initSettings: IClientSettings | null;
}

const Index: NextPage<IndexInitialProps> = ({ initSettings }) => {
	const [roomList, setRoomList] = useState<IRoom[]>([]);
	const [eagerName, setEagerName] = useState<string>(initSettings?.user?.name || '');
	const [settings, setSettings] = useState<IClientSettings>(initSettings || { uiMode: 'tabled', user: null });
	const [err, setErr] = useState<string>('');

	useEffect(() => {
		axios.get<IRoomIndexResponse>('/api/rooms').then((res) => {
			setRoomList(res.data.rooms);
		});

		const pusherClient = new Pusher('fe3b8164d0dd3aff71b6', { cluster: 'us2' });

		pusherClient.subscribe('quiz-cards-rooms').bind('ROOM_CREATED', (evt: NewRoomEvent) => {
			setRoomList((roomList) => [...roomList, evt.room]);
		});
	}, []);

	useEffect(() => {
		Cookies.set('mpSettings', settings);
	}, [settings]);

	return (
		<div className={styles.main}>
			<Head>
				<title>QuizCards - Rooms</title>
				<meta name="description" content="Carding application designed for studying for Quiz Bowl, combined with a Protobowl-style question reader" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
			</Head>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				<form onSubmit={(evt) => evt.preventDefault()}>
					<div>
						<label htmlFor="username">Username: </label>
						<input
							type="text"
							name="username"
							id="username"
							autoComplete="off"
							value={eagerName}
							onChange={(evt) => setEagerName(evt.target.value)}
							onBlur={(evt) => {
								if (!settings.user && evt.target.value !== '') {
									axios
										.post<CreateUserResponse>('/api/rooms/user', {
											name: evt.target.value
										})
										.then((res) => {
											setSettings((prev) => ({ ...prev, user: res.data.user }));
										})
										.catch((err: AxiosError<string>) => {
											setErr(err.response?.data || '');
										});
								} else if (evt.target.value !== '') {
									axios.patch('/api/gateway/user', {
										_id: settings.user!.id,
										name: evt.target.value
									});
								} else {
									setSettings((prev) => ({ ...prev, user: null }));
								}
							}}
						/>
					</div>
					<hr />
				</form>
				<div>
					<h4>Note:</h4> this site uses cookies to persist settings between sessions. Disable button coming soon!
				</div>
			</div>

			<div className={styles.content}>
				<div>
					{roomList.map((room) => (
						<div key={room.id}>
							<h4>{room.name}</h4>
							<p>Owner: {room.users.find((user) => user.id === room.ownerId)?.name}</p>
						</div>
					))}
					{roomList.length === 0 && <div>No rooms available...</div>}
				</div>
				{/* <div className={styles.msg}>{msg}</div> */}
				<div className={styles.err}>{err}</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<IndexInitialProps> = async ({ req }) => {
	const cookies = parseCookies(req);

	return {
		props: {
			initSettings: cookies.mpSettings ? JSON.parse(cookies.mpSettings) : null
		}
	};
};

export default Index;
