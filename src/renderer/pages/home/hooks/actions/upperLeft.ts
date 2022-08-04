import { IAnims } from './type';

const START = '/images/upperLeft/start.mp4';
const CIRCLE = '/images/upperLeft/circle.mp4';
const END = '/images/upperLeft/end.mp4';

// 左上看
export const upperLeft: IAnims = [
    {
        key: 'UpperLeft_Start',
        src: START,
        duration: 1000,
        loop: false
    },
    {
        key: 'UpperLeft_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'UpperLeft_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
