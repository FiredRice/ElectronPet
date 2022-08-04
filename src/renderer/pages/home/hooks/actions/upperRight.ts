import { IAnims } from './type';

const START = '/images/upperRight/start.mp4';
const CIRCLE = '/images/upperRight/circle.mp4';
const END = '/images/upperRight/end.mp4';

// 右上看
export const upperRight: IAnims = [
    {
        key: 'UpperRight_Start',
        src: START,
        duration: 1000,
        loop: false
    },
    {
        key: 'UpperRight_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'UpperRight_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
