import { IAnims } from './type';

const START = '/images/terrified/start.mp4';
const CIRCLE = '/images/terrified/circle.mp4';
const END = '/images/terrified/end.mp4';

// 不屑
export const terrified: IAnims = [
    {
        key: 'Terrified_Start',
        src: START,
        duration: 1000,
        loop: false
    },
    {
        key: 'Terrified_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'Terrified_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
