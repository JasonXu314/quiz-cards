import DifficultySelection from '$/DifficultySelection/DifficultySelection';
import DistroModal from '$/DistroModal/DistroModal';
import RoomReader from '$/RoomReader/RoomReader';
import SpeedSelector from '$/SpeedSelector/SpeedSelector';
import Timer from '$/Timer';
import UIModeSelector from '$/UIModeSelector/UIModeSelector';
import { someAnsweringState } from '@/atoms';
import { categories } from '@/constants';
import { appendLeaderboard, createLeaderboard, createRoom, createUser, getRoom, getUserById } from '@/db-utils';
import { capitalize, parseCookies, redirect } from '@/util';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import generate from 'project-name-generator';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import io from 'socket.io-client';
import styles from '../../sass/Room.module.scss';

interface RoomInitialProps {
	room: IRoom;
	isOwner: boolean;
	thisUser: UserWithoutScore;
}

const reducer: React.Reducer<RoomSettings, RoomSettingsAction> = (prevSettings, action) => {
	switch (action.type) {
		case 'SET_SPEED':
			return { ...prevSettings, speed: action.speed };
		case 'TOGGLE_DIFFICULTY':
			return {
				...prevSettings,
				difficulties: prevSettings.difficulties.includes(action.difficulty)
					? prevSettings.difficulties.filter((diff) => diff !== action.difficulty)
					: [...prevSettings.difficulties, action.difficulty]
			};
		case 'SET_DISTRO':
			return {
				...prevSettings,
				distro: action.distro
			};
		default:
			return prevSettings;
	}
};

const Room: NextPage<RoomInitialProps> = ({ isOwner, room, thisUser }) => {
	const [timeDisplay, setTimeDisplay] = useState<number>(0);
	const [timerActive, setTimerActive] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0);
	const [someAnswering, setSomeAnswering] = useRecoilState(someAnsweringState);
	const [settings, dispatch] = useReducer<typeof reducer>(reducer, room.settings);
	const [mpSettings, setMpSettings] = useState<IClientSettings>({ uiMode: 'tabled', user: thisUser });
	const [uiMode, setUiMode] = useState<UIMode>('tabled');
	const [eagerName, setEagerName] = useState<string>(thisUser.name);
	const [msg, setMsg] = useState<string>('');
	const [err, setErr] = useState<string>('');
	const [leaderboard, setLeaderboard] = useState<IUser[] | null>(null);
	const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
	const [distroModalShown, setDistroModalShown] = useState<boolean>(false);
	const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
	const readerRef = useRef<QuestionReaderMethods>(null);
	const router = useRouter();

	const tick = useCallback((remTime: number) => setTimeDisplay(remTime / 1000), []);

	const answerTimeout = useCallback(() => {
		setSomeAnswering(false);
		readerRef.current?.endQuestion();
	}, [setSomeAnswering]);

	const mainTimeout = useCallback(() => {
		readerRef.current?.endQuestion();
	}, []);

	const onScoreChange = useCallback((evt: IScoreEvent) => {
		setLeaderboard((lbd) => lbd!.map((user) => (user.id === evt.userId ? { ...user, score: user.score + evt.increment } : user)));
	}, []);

	const onDistroChange = useCallback((evt: IDistroChangeEvent) => {
		dispatch({ type: 'SET_DISTRO', distro: evt.newDistro });
	}, []);

	const onNameChange = useCallback((evt: NameChangeEvent) => {
		setMpSettings((prevSettings) => {
			if (prevSettings.user!.id === evt.userId) {
				return { ...prevSettings, user: { ...prevSettings.user!, name: evt.name } };
			} else {
				return prevSettings;
			}
		});
		setLeaderboard((leaderboard) => (leaderboard ? leaderboard.map((user) => (user.id === evt.userId ? { ...user, name: evt.name } : user)) : null));
	}, []);

	const onDifficultiesChange = useCallback((difficulty: Difficulty) => {
		dispatch({ type: 'TOGGLE_DIFFICULTY', difficulty });
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on(`ROOM-${room.name}-SCORE_POINT`, onScoreChange);
			socket.on(`ROOM-${room.name}-DISTRO_UPDATE`, onDistroChange);
			socket.on(`ROOM-${room.name}-DIFFICULTY_UPDATE`, onDifficultiesChange);
			socket.on('NAME_CHANGE', onNameChange);

			return () => {
				socket.off(`ROOM-${room.name}-SCORE_POINT`, onScoreChange);
				socket.off(`ROOM-${room.name}-DISTRO_UPDATE`, onDistroChange);
				socket.off(`ROOM-${room.name}-DIFFICULTY_UPDATE`, onDifficultiesChange);
				socket.off('NAME_CHANGE', onNameChange);
			};
		}
	}, [socket, onScoreChange, onNameChange, onDistroChange, onDifficultiesChange, room.name]);

	useEffect(() => {
		const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!);

		socket.emit('REGISTER', { userId: thisUser.id, room });
		setSocket(socket);

		return () => {
			socket.close();
		};
	}, [onScoreChange, onNameChange, onDistroChange, room, thisUser.id]);

	useEffect(() => {
		Cookies.set('mpSettings', mpSettings);
	}, [mpSettings]);

	useEffect(() => {
		axios
			.get<ILeaderboard>(`/api/rooms/leaderboard?room=${room.name}`)
			.then((res) => {
				setLeaderboard(res.data.leaderboard);
			})
			.catch((err: AxiosError<string>) => {
				setLeaderboardError(err.response?.data || 'Unknown Error');
			});
	}, [room]);

	if (isOwner) {
		return (
			<>
				<div className={styles.main + (distroModalShown ? ' ' + styles.blur : '')}>
					<Head>
						<title>QuizCards - {router.query.room}</title>
						<meta
							name="description"
							content="Carding application designed for studying for Quiz Bowl, combined with a Protobowl-style question reader"
						/>
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
					</Head>
					<div className={styles.title}>QuizCards</div>
					<div className={styles.sidebar}>
						<h3>{timeDisplay.toFixed(2)} s</h3>
						<Timer active={timerActive} time={time} tick={tick} timeout={mainTimeout} />
						{someAnswering && <Timer active={someAnswering} time={7500} timeout={answerTimeout} tick={tick} answerTimer />}
						<form className={styles.settings} onSubmit={(evt) => evt.preventDefault()}>
							<div className={styles.distro}>
								{categories.entries.map(([categoryName, category]) => (
									<div key={category.id} className={styles.category}>
										<span>{categoryName}: </span>
										<span onClick={() => setDistroModalShown(true)} className={styles.percentageWrapper}>
											<h4 className={styles.percentage}>{settings.distro[categoryName]}</h4>%
										</span>
									</div>
								))}
							</div>
							<hr />
							<UIModeSelector onChange={(evt) => setUiMode(evt.target.value as UIMode)} uiMode={uiMode} />
							<SpeedSelector
								onChange={(evt) => {
									if (/(\d*|\d*\.\d*|\.\d*)([eE][-+]?\d*)?/.test(evt.target.value)) {
										dispatch({ type: 'SET_SPEED', speed: evt.target.value === '' ? NaN : parseInt(evt.target.value) });
									}
								}}
								onBlur={(evt) => {
									if (evt.target.value === '' || parseInt(evt.target.value) < 10) {
										dispatch({ type: 'SET_SPEED', speed: 10 });
									} else if (parseInt(evt.target.value) > 1000) {
										dispatch({ type: 'SET_SPEED', speed: 1000 });
									}
								}}
								speed={settings.speed}
							/>
							<DifficultySelection
								onChange={(evt) => {
									const difficulty = parseInt(evt.target.value) as Difficulty;
									socket?.emit('TOGGLE_DIFFICULTY', { difficulty, roomId: room.id });
								}}
								difficulties={settings.difficulties}
							/>
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
										if (evt.target.value !== '') {
											socket?.emit('NAME_CHANGE', {
												id: mpSettings.user!.id,
												name: evt.target.value
											});
										} else {
											setEagerName(mpSettings.user!.name);
										}
									}}
								/>
							</div>
							<hr />
						</form>
						<div>
							<h4>Note:</h4> this site uses cookies to persist settings between sessions. Disable button coming soon!
						</div>
						<div className={styles.leaderboard}>
							{leaderboardError ? (
								<div className={styles.entry}>
									Error loading leaderboard...:
									<br />
									{leaderboardError}
								</div>
							) : leaderboard ? (
								leaderboard.map((user) => (
									<div key={user.id} className={styles.entry}>
										<h4>{user.name}</h4> {user.score}
									</div>
								))
							) : (
								<div className={styles.entry}>Loading...</div>
							)}
						</div>
					</div>

					<div className={styles.content}>
						<RoomReader
							uiMode={mpSettings.uiMode}
							userId={mpSettings.user!.id}
							roomName={room.name}
							roomId={room.id}
							speed={settings.speed}
							difficulties={settings.difficulties}
							setTimerActive={setTimerActive}
							setTime={setTime}
							ref={readerRef}
							startTime={room.startTime}
							roomQuestion={room.currentQuestion}
							socket={socket}
						/>
						<div className={styles.msg}>{msg}</div>
						<div className={styles.err}>{err}</div>
					</div>
				</div>
				{distroModalShown && (
					<>
						<DistroModal
							distro={settings.distro}
							save={(newDistro) => {
								socket?.emit('DISTRO_UPDATE', { roomId: room.id, newDistro });
								setDistroModalShown(false);
							}}
							close={() => {
								setDistroModalShown(false);
							}}
						/>
						<div
							className={styles.overlay}
							onClick={() => {
								setDistroModalShown(false);
							}}
						/>
					</>
				)}
			</>
		);
	} else {
		return (
			<>
				<div className={styles.main}>
					<Head>
						<title>QuizCards - {router.query.room}</title>
						<meta
							name="description"
							content="Carding application designed for studying for Quiz Bowl, combined with a Protobowl-style question reader"
						/>
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
					</Head>
					<div className={styles.title}>QuizCards</div>
					<div className={styles.sidebar}>
						<h3>{timeDisplay.toFixed(2)} s</h3>
						<Timer active={timerActive} time={time} tick={tick} timeout={mainTimeout} />
						{someAnswering && <Timer active={someAnswering} time={7500} timeout={answerTimeout} tick={tick} answerTimer />}
						<form className={styles.settings} onSubmit={(evt) => evt.preventDefault()}>
							<div className={styles.distro}>
								{categories.entries.map(([categoryName, category]) => (
									<div key={category.id} className={styles.category}>
										<span>{categoryName}: </span>
										<span className={styles.percentageWrapper}>
											<h4 className={styles.percentage}>{settings.distro[categoryName]}</h4>%
										</span>
									</div>
								))}
							</div>
							<hr />
							<UIModeSelector onChange={(evt) => setUiMode(evt.target.value as UIMode)} uiMode={uiMode} />
							<SpeedSelector onChange={() => {}} onBlur={() => {}} speed={settings.speed} />
							<DifficultySelection onChange={() => {}} difficulties={settings.difficulties} />
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
										if (evt.target.value !== '') {
											socket?.emit('NAME_CHANGE', {
												id: mpSettings.user!.id,
												name: evt.target.value
											});
										} else {
											setEagerName(mpSettings.user!.name);
										}
									}}
								/>
							</div>
							<hr />
						</form>
						<div>
							<h4>Note:</h4> this site uses cookies to persist settings between sessions. Disable button coming soon!
						</div>
						<div className={styles.leaderboard}>
							{leaderboardError ? (
								<div className={styles.entry}>
									Error loading leaderboard...:
									<br />
									{leaderboardError}
								</div>
							) : leaderboard ? (
								leaderboard.map((user) => (
									<div key={user.id} className={styles.entry}>
										<h4>{user.name}</h4> {user.score}
									</div>
								))
							) : (
								<div className={styles.entry}>Loading...</div>
							)}
						</div>
					</div>

					<div className={styles.content}>
						<RoomReader
							uiMode={mpSettings.uiMode}
							userId={mpSettings.user!.id}
							roomName={room.name}
							roomId={room.id}
							speed={settings.speed}
							difficulties={settings.difficulties}
							setTimerActive={setTimerActive}
							setTime={setTime}
							ref={readerRef}
							startTime={room.startTime}
							roomQuestion={room.currentQuestion}
							socket={socket}
						/>
						<div className={styles.msg}>{msg}</div>
						<div className={styles.err}>{err}</div>
					</div>
				</div>
			</>
		);
	}
};

export const getServerSideProps: GetServerSideProps<RoomInitialProps | { redirect: boolean }, { room: string }> = async ({ req, res, params }) => {
	axios.post(process.env.NEXT_PUBLIC_BACKEND_URL! + 'wakeup');
	const cookies = parseCookies(req);
	const settings: Settings | null = cookies.settings ? JSON.parse(cookies.settings) : null;
	const mpSettings: IClientSettings | null = cookies.mpSettings ? JSON.parse(cookies.mpSettings) : null;

	if (mpSettings && settings) {
		const thisUser = mpSettings.user;
		const room = await getRoom(params!.room);

		if (room) {
			if (thisUser) {
				return {
					props: {
						isOwner: thisUser.id === room.ownerId,
						room: room,
						thisUser
					}
				};
			} else {
				if (settings.user) {
					const newUser = await createUser(settings.user.name);

					if (newUser) {
						return {
							props: {
								isOwner: false,
								room: room,
								thisUser: newUser
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				} else {
					const newUser = await createUser(capitalize(generate({ alliterative: true }).raw as string[]).join(' '));

					if (newUser) {
						return {
							props: {
								isOwner: false,
								room: room,
								thisUser: newUser
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				}
			}
		} else {
			if (thisUser) {
				const newRoom = await createRoom(params!.room, thisUser, { difficulties: settings.difficulties, speed: settings.speed });

				if (newRoom) {
					await createLeaderboard(newRoom, [(await getUserById(thisUser.id))!]);

					return {
						props: {
							thisUser,
							isOwner: true,
							room: newRoom
						}
					};
				} else {
					return redirect(res, '/rooms');
				}
			} else if (settings.user) {
				const newUser = await createUser(settings.user.name);

				if (newUser) {
					const newRoom = await createRoom(
						params!.room,
						{ ...newUser, id: newUser.id },
						{ difficulties: settings.difficulties, speed: settings.speed }
					);

					if (newRoom) {
						await createLeaderboard(newRoom, [newUser]);

						return {
							props: {
								isOwner: true,
								room: newRoom,
								thisUser: newRoom
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				} else {
					return redirect(res, '/rooms');
				}
			} else {
				const newUser = await createUser(capitalize(generate({ alliterative: true }).raw as string[]).join(' '));

				if (newUser) {
					const newRoom = await createRoom(
						params!.room,
						{ id: newUser.id, name: newUser.name },
						{
							difficulties: settings.difficulties,
							speed: settings.speed
						}
					);

					if (newRoom) {
						await createLeaderboard(newRoom, [newUser]);

						return {
							props: {
								isOwner: true,
								room: newRoom,
								thisUser: newUser
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				} else {
					return redirect(res, '/rooms');
				}
			}
		}
	} else if (settings) {
		const user = settings.user;
		const room = await getRoom(params!.room);
		const newUser = settings.user ? null : await createUser(user?.name || capitalize(generate({ alliterative: true }).raw as string[]).join(' '));

		if (newUser) {
			if (room) {
				if (user) {
					appendLeaderboard(room, { ...user, score: 0 });
					return {
						props: {
							isOwner: false,
							room: room,
							thisUser: newUser
						}
					};
				} else {
					appendLeaderboard(room, newUser);
					return {
						props: {
							isOwner: false,
							room: room,
							thisUser: newUser
						}
					};
				}
			} else {
				if (user) {
					const newRoom = await createRoom(
						params!.room,
						{ id: newUser.id, name: newUser.name },
						{
							difficulties: settings.difficulties,
							speed: settings.speed
						}
					);

					if (newRoom) {
						await createLeaderboard(newRoom, [{ ...user, score: 0 }]);

						return {
							props: {
								isOwner: true,
								room: newRoom,
								thisUser: newUser
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				} else {
					const newRoom = await createRoom(
						params!.room,
						{ id: newUser.id, name: newUser.name },
						{
							difficulties: settings.difficulties,
							speed: settings.speed
						}
					);

					if (newRoom) {
						await createLeaderboard(newRoom, [newUser]);

						return {
							props: {
								isOwner: true,
								room: newRoom,
								thisUser: newUser
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				}
			}
		} else {
			return redirect(res, '/rooms');
		}
	} else if (mpSettings) {
		const room = await getRoom(params!.room);

		if (room) {
			if (mpSettings.user) {
				appendLeaderboard(room, { id: mpSettings.user.id, name: mpSettings.user.name, score: 0 });

				return {
					props: {
						isOwner: mpSettings.user.id === room.ownerId,
						room: room,
						thisUser: mpSettings.user
					}
				};
			} else {
				const newUser = await createUser(capitalize(generate({ alliterative: true }).raw as string[]).join(' '));

				if (newUser) {
					appendLeaderboard(room, newUser);

					return {
						props: {
							isOwner: false,
							room: room,
							thisUser: newUser
						}
					};
				} else {
					return redirect(res, '/rooms');
				}
			}
		} else {
			if (mpSettings.user) {
				const newRoom = await createRoom(params!.room, mpSettings.user);

				if (newRoom) {
					await createLeaderboard(newRoom, [(await getUserById(mpSettings.user.id))!]);

					return {
						props: {
							isOwner: true,
							room: newRoom,
							thisUser: mpSettings.user
						}
					};
				} else {
					return redirect(res, '/rooms');
				}
			} else {
				const newUser = await createUser(capitalize(generate({ alliterative: true }).raw as string[]).join(' '));

				if (newUser) {
					const newRoom = await createRoom(params!.room, { id: newUser.id, name: newUser.name });

					if (newRoom) {
						await createLeaderboard(newRoom, [newUser]);

						return {
							props: {
								isOwner: true,
								room: newRoom,
								thisUser: newUser
							}
						};
					} else {
						return redirect(res, '/rooms');
					}
				} else {
					return redirect(res, '/rooms');
				}
			}
		}
	} else {
		const newUser = await createUser(capitalize(generate({ alliterative: true }).raw as string[]).join(' '));

		if (newUser) {
			const room = await getRoom(params!.room);

			if (room) {
				appendLeaderboard(room, newUser);

				return {
					props: {
						isOwner: false,
						room: room,
						thisUser: newUser
					}
				};
			} else {
				const newRoom = await createRoom(params!.room, { id: newUser.id, name: newUser.name });

				if (newRoom) {
					await createLeaderboard(newRoom, [newUser]);

					return {
						props: {
							isOwner: true,
							room: newRoom,
							thisUser: newUser
						}
					};
				} else {
					return redirect(res, '/rooms');
				}
			}
		} else {
			return redirect(res, '/rooms');
		}
	}
};

export default Room;
