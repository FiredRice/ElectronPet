import { ReactNode } from 'react';

export type IAnims = {
    key: string;
    src: string;
    duration: number;
    loop: boolean;
} | IAnims[];