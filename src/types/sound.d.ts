declare module 'react-native-sound' {
    type SoundCategory = 'Ambient' | 'SoloAmbient' | 'Playback' | 'Record' | 'PlayAndRecord';

    class Sound {
        static setCategory(category: SoundCategory, mixWithOthers?: boolean): void;
        static MAIN_BUNDLE: string;
        static DOCUMENT: string;
        static LIBRARY: string;
        static CACHES: string;

        constructor(
            filename: string,
            basePath?: string,
            onError?: (error: Error | null) => void
        );

        play(onEnd?: (success: boolean) => void): Sound;
        pause(callback?: () => void): Sound;
        stop(callback?: () => void): Sound;
        reset(): Sound;
        release(): void;
        setVolume(value: number): Sound;
        setPan(value: number): Sound;
        setNumberOfLoops(value: number): Sound;
        setSpeed(value: number): Sound;
        getCurrentTime(callback: (seconds: number, isPlaying: boolean) => void): void;
        setCurrentTime(value: number): Sound;
        getDuration(): number;
        isPlaying(): boolean;
        isLoaded(): boolean;
    }

    export default Sound;
}
