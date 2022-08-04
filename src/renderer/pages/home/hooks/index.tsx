import { isArray, random } from 'lodash';
import { useCallback } from 'react';
import { useEffect, useRef } from 'react';
import { useFetchImmer } from 'renderer/hooks/useFetchState';
import { useIpcRenders } from 'renderer/hooks/useIpcRenders';
import { anims } from './actions';

const videoToBlob = (src: string) => {
    const { getAssetPath, readFile } = useIpcRenders();
    const file = readFile(getAssetPath(src));
    const uintBuffer = Uint8Array.from(file);
    const blob = new Blob([uintBuffer]);
    return window.URL.createObjectURL(blob);
};

export const useElectActions = (videoRef1: React.RefObject<HTMLVideoElement>, videoRef2: React.RefObject<HTMLVideoElement>) => {
    const SINGLE = '/images/static/single.mp4';

    const blobRef = useRef({
        [SINGLE]: videoToBlob(SINGLE)
    });

    const [state, setState] = useFetchImmer({
        loop1: false,
        src1: blobRef.current[SINGLE],
        loop2: false,
        src2: blobRef.current[SINGLE],
        videoNum: 1
    });

    const stateRef = useRef({
        loop1: false,
        src1: SINGLE,
        loop2: false,
        src2: SINGLE,
        videoNum: 1
    });

    const timerRef = useRef<any>(null);
    const subTimerRef = useRef<any>(null);

    const delayRef = useRef(300);

    const useVideoNum = (src: string) => {
        let play = true;
        if (stateRef.current.src1 === src) {
            stateRef.current.videoNum = 1;
            play = false;
        } else if (stateRef.current.src2 === src) {
            stateRef.current.videoNum = 2;
            play = false;
        }
        return {
            videoNum: stateRef.current.videoNum,
            play
        };
    };

    const createAction = (anim: { src: string, duration: number, loop: boolean; }, call: Function) => {
        const { src: path, duration, loop } = anim;

        const { videoNum, play } = useVideoNum(path);

        let src = '';
        if (blobRef.current[path]) {
            src = blobRef.current[path];
        } else {
            src = videoToBlob(path);
            blobRef.current[path] = src;
        }

        const setAnim = () => {
            setState(draft => {
                if (videoNum === 1) {
                    draft.src1 = src;
                    draft.loop1 = loop;
                    draft.videoNum = 2;
                    stateRef.current.src1 = path;
                    stateRef.current.loop1 = loop;
                    stateRef.current.videoNum = 2;
                } else {
                    draft.src2 = src;
                    draft.loop2 = loop;
                    draft.videoNum = 1;
                    stateRef.current.src2 = path;
                    stateRef.current.loop2 = loop;
                    stateRef.current.videoNum = 1;
                }
            });
            clearTimeout(subTimerRef.current);
            subTimerRef.current = setTimeout(() => {
                clearTimeout(subTimerRef.current);
                loop && setState(draft => {
                    if (videoNum === 2) {
                        draft.loop1 = false;
                        stateRef.current.loop1 = false;
                    } else {
                        draft.loop2 = false;
                        stateRef.current.loop2 = false;
                    }
                });
                delayRef.current = loop ? random(2000, 5000) + duration : duration;
                call && call();
            }, delayRef.current);
        };

        const video = videoNum === 1 ? videoRef2.current : videoRef1.current;
        if (video) {
            if (play) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(setAnim)
                        .catch((error: any) => {
                            console.log('videoError', error);
                        });
                }
            } else {
                setAnim();
            }
        }
    };

    const createAnim = (anim: any) => {
        if (isArray(anim)) {
            return (call: Function) => {
                let count = 0;
                const callFun = () => {
                    if (count === anim.length) {
                        call && call();
                    } else {
                        createAction(anim[count], callFun);
                    }
                    count++;
                };
                createAction(anim[count], callFun);
            };
        } else {
            return (call: Function) => {
                createAction(anim, call);
            };
        }
    };

    const actions = useRef(anims.map(item => createAnim(item)));

    const getRandomAction = useCallback(() => {
        const num = random(0, actions.current.length - 1);
        return actions.current[num];
    }, []);

    useEffect(() => {
        run();
    }, []);

    const run = () => {
        clearTimeout(timerRef.current);
        clearTimeout(subTimerRef.current);
        timerRef.current = setTimeout(() => {
            clearTimeout(timerRef.current);
            clearTimeout(subTimerRef.current);
            delayRef.current = random(3000, 7000);
            const action = getRandomAction();
            action && action(run);
        }, delayRef.current);
    };

    return { ...state };
};
