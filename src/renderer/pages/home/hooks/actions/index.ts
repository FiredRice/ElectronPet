import { IAnims } from './type';
import { anger } from './anger';
import { disdain } from './disdain';
import { singleBlink } from './singleBlink';
import { terrified } from './terrified';
import { upperRight } from './upperRight';
import { upperLeft } from './upperLeft';
import { doubleBlink } from './doubleBlink';
import { sad } from './sad';
import { happy } from './happy';

export const anims: IAnims[] = [
    singleBlink,
    doubleBlink,
    disdain,
    anger,
    terrified,
    upperRight,
    upperLeft,
    sad,
    happy
];
