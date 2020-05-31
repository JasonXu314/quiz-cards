declare module 'recoil' {
	declare type RecoilState<T> = RecoilAtom<T> | RecoilSelector<T> | WritableRecoilSelector<T>;
	declare type WritableRecoilState<T> = RecoilAtom<T> | WritableRecoilSelector<T>;
	declare type Mutator<T> = (param: T) => void;
	declare type Reset = () => void;

	declare interface RecoilAtom<T> {
		key: string;
	}

	declare interface RecoilSelector<T> {
		key: string;
	}

	declare interface WritableRecoilSelector<T> {
		key: string;
	}

	declare interface RecoilAtomConfig<T> {
		key: string;
		default: T;
	}

	declare interface RecoilSelectorConfig<T> {
		key: string;
		get: ({ get }: { get: <S>(s: RecoilState<S>) => S }) => T;
	}

	declare interface WritableRecoilSelectorConfig<T> {
		key: string;
		get: ({ get }: { get: <S>(s: RecoilState<S>) => S }) => T;
		set: ({ set, newValue }: { set: <S>(s: RecoilState<S>) => void; newValue: T }) => void;
	}

	declare function useRecoilState<T>(s: RecoilAtom<T>): [T, Mutator<T>];
	declare function useRecoilState<T>(s: WritableRecoilSelector<T>): [T, Mutator<T>];
	declare function useRecoilValue<T>(s: RecoilState<T>): T;
	declare function useSetRecoilState<T>(s: WritableRecoilState<T>): Mutator<T>;
	declare function useResetRecoilState<T>(s: WritableRecoilState<T>): Reset;
	declare function atom<T>(config: RecoilAtomConfig<T>): RecoilAtom<T>;
	declare function selector<T>(config: WritableRecoilSelectorConfig<T>): WritableRecoilSelector<T>;
	declare function selector<T>(config: RecoilSelectorConfig<T>): RecoilSelector<T>;
}
