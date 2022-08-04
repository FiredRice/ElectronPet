import { useEffect, useRef } from 'react';
import { useFetchState } from 'renderer/hooks/useFetchState';
import { useElectActions } from './hooks';
import './style/index.less';

const Home = () => {
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);

    const { src1, loop1, src2, loop2, videoNum } = useElectActions(videoRef1, videoRef2);

    const [top, setTop] = useFetchState<string>('48%');

    const timer = useRef<any>(null);

    const count = useRef<number>(0);

    useEffect(() => {
        chaneTop();
    }, []);

    const chaneTop = () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            clearTimeout(timer.current);
            (count.current % 2 === 0) ? (count.current = 1) : (count.current = 0);
            setTop((count.current % 2 === 0) ? '45%' : '55%');
            chaneTop();
        }, 1000);
    };

    return (
        <div className='circle-radius'>
            <div className='circle-radius-background' style={{ top }}>
                <div className='circle-radius-position'>
                    <video
                        className='circle-radius-video'
                        ref={videoRef1}
                        src={src1}
                        loop={loop1}
                        muted
                        style={{ opacity: videoNum === 1 ? 1 : 0 }}
                    >

                    </video>
                    <video
                        className='circle-radius-video'
                        ref={videoRef2}
                        src={src2}
                        loop={loop2}
                        muted
                        style={{ opacity: videoNum === 2 ? 1 : 0 }}
                    >

                    </video>
                </div>
            </div>
        </div>
    );
};

export default Home;
