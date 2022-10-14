import { cssRuleObjectsToCssString, sortCss } from '@kaze-style/build-man';
import type { CssRuleObject } from '@kaze-style/core';
//@ts-expect-error type
import type { Plugin } from 'vite';
import { resolveTransform } from './utils/resolveTransform';

export const plugin = (): Plugin => {
  const cssRuleObjects: CssRuleObject[] = [];
  return {
    name: 'kaze-transform',
    resolveId(source) {
      const [validId] = source.split('?');
      if (/kaze.css$/.test(validId || '')) {
        return validId;
      }
      return;
    },
    load(id: string) {
      const [validId] = id.split('?');
      if (/kaze.css$/.test(validId || '')) {
        const cssString = cssRuleObjectsToCssString(cssRuleObjects);
        const sortedCssRules = sortCss(cssString);
        return sortedCssRules;
      }
      return;
    },

    async transform(_, id) {
      const [validId] = id.split('?');
      if (!/.(tsx|ts)$/.test(validId || '')) {
        return null;
      }
      const { code, cssRuleObjects: _cssRuleObjects } = await resolveTransform(
        validId || '',
      );
      let rootRelativeId = '';
      if (_cssRuleObjects.length !== 0) {
        rootRelativeId = `import "${validId}.kaze.css";`;
        cssRuleObjects.push(..._cssRuleObjects);
      }

      return {
        code: `${rootRelativeId}\n${code}`,
        map: { mappings: '' },
      };
    },
  };
};