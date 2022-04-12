import { chinese } from './chinese';
import { czech } from './czech';
import { english } from './english';
import { french } from './french';
import { italian } from './italian';
import { japanese } from './japanese';
import { korean } from './korean';
import { portuguese } from './portuguese';
import { spanish } from './spanish';

export type Words = Record<string, string[]>;

export const words: Words = {
  CHINESE: chinese,
  CZECH: czech,
  ENGLISH: english,
  FRENCH: french,
  ITALIAN: italian,
  JAPANESE: japanese,
  KOREAN: korean,
  PORTUGUESE: portuguese,
  SPANISH: spanish,
};
