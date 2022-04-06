import { chinese } from './chinese';
import { english } from './english';
import { french } from './french';
import { italian } from './italian';
import { japanese } from './japanese';
import { korean } from './korean';
import { spanish } from './spanish';

export type Words = Record<string, string[]>;

export const words: Words = {
  CHINESE: chinese,
  ENGLISH: english,
  FRENCH: french,
  ITALIAN: italian,
  JAPANESE: japanese,
  KOREAN: korean,
  SPANISH: spanish,
};
