import type { CssValue } from '../types/style';
import type { AndArray } from '../types/utils';
import { hyphenateProperty } from './hyphenateProperty';

export const resolveDeclaration = (
  _property: string,
  styleValue: AndArray<CssValue>,
) => {
  const property = hyphenateProperty(_property);
  return Array.isArray(styleValue)
    ? styleValue.map((value) => `${property}:${resolveValue(value)};`).join('')
    : `${property}:${resolveValue(styleValue)};`;
};

const resolveValue = (value: CssValue) => (value === '' ? '""' : value);
