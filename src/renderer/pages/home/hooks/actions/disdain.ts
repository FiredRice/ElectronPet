import { IAnims } from './type';

const START = '/images/disdain/start.mp4';
const CIRCLE = '/images/disdain/circle.mp4';
const END = '/images/disdain/end.mp4';


// 不屑
export const disdain: IAnims = [
    {
        key: 'Disdain_Start',
        src: START,
        duration: 1000,
        loop: false
    },
    {
        key: 'Disdain_Circle',
        src: CIRCLE,
        duration: 3000,
        loop: true
    },
    {
        key: 'Disdain_End',
        src: END,
        duration: 1000,
        loop: false
    },
];
