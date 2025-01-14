import type {
  Properties,
  AtRule,
  Pseudos,
  HtmlAttributes,
  SvgAttributes,
} from 'csstype';
import type { IncludeString, Prettify, ValueAndArray } from './utils';

export type CssValue = string | number;

type SelectorChar =
  | ':'
  | '&'
  | ' '
  | '@'
  | ','
  | '>'
  | '~'
  | '+'
  | '['
  | '.'
  | '#';

type AndPrefix<T extends string> = T | `&${T}`;

type AutoCompleteSelector =
  | '@media (max-width: 0)'
  | '@media (min-width: 0)'
  | '@media (prefers-color-scheme: dark)'
  | '@media (prefers-color-scheme: light)'
  | '@layer utilities'
  | '@layer base'
  | '@supports ()'
  | '@supports not ()'
  | AndPrefix<Pseudos | HtmlAttributes | SvgAttributes>;

type PseudosSuffix<T extends string> = T | `${T}${Pseudos}`;

type AutoCompleteGlobalSelector = PseudosSuffix<
  '*' | keyof HTMLElementTagNameMap
>;

type SupportProperties = Prettify<
  Omit<ValueAndArray<Properties<CssValue>>, 'animationName'> & {
    animationName?: string | string[] | KeyframesRules;
  }
>;

type FontFaceRules = ValueAndArray<AtRule.FontFace<CssValue>>;

export type KeyframesRules = {
  [_ in 'from' | 'to']?: SupportProperties;
} & {
  [_ in string]?: SupportProperties;
};

export type SupportStyle = SupportProperties & {
  [_ in AutoCompleteSelector]?: SupportStyle;
} & {
  [_ in IncludeString<SelectorChar>]?: SupportStyle;
} & {
  [_ in `(${string})`]?: SupportStyle;
};

export type KazeStyle<T extends string> = Record<T, SupportStyle>;

export type KazeGlobalStyle<T extends string> = {
  '@font-face'?: FontFaceRules;
} & {
  [K in T]: K extends '@font-face' ? FontFaceRules : SupportStyle;
} & {
  [_ in AutoCompleteGlobalSelector]?: SupportStyle;
};
