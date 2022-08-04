import { IAnims } from './type';

const START = '/images/anger/start.mp4';
const CIRCLE = '/images/anger/circle.mp4';
const END = '/images/anger/end.mp4';

// 不屑
export const anger: IAnims = [
    {
        key: 'Anger_Start',
        src: START,
        duration: 800,
        loop: false
    },
    {
        key: 'Anger_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'Anger_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
