import { IAnims } from './type';

const START = '/images/happy/start.mp4';
const CIRCLE = '/images/happy/circle.mp4';
const END = '/images/happy/end.mp4';

// 兴奋
export const happy: IAnims = [
    {
        key: 'Happy_Start',
        src: START,
        duration: 1000,
        loop: false
    },
    {
        key: 'Happy_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'Happy_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
