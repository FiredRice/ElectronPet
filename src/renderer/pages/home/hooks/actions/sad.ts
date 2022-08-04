import { IAnims } from './type';

const START = '/images/sad/start.mp4';
const CIRCLE = '/images/sad/circle.mp4';
const END = '/images/sad/end.mp4';

// 难过
export const sad: IAnims = [
    {
        key: 'Sad_Start',
        src: START,
        duration: 1000,
        loop: false
    },
    {
        key: 'Sad_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'Sad_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
