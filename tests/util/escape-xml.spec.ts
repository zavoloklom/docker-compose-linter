import test from 'ava';

import { escapeXml } from '../../src/util/escape-xml';

// @ts-ignore TS2349
test('escapeXml: escapes all special XML characters', (t) => {
  const input = `<tag attribute="value & more">Text's & "quotes"</tag>`;
  const expected = `&lt;tag attribute=&quot;value &amp; more&quot;&gt;Text&apos;s &amp; &quot;quotes&quot;&lt;/tag&gt;`;
  t.is(escapeXml(input), expected);
});

// @ts-ignore TS2349
test('escapeXml: leaves non‑special characters intact', (t) => {
  const input = 'PlainText123 - no special chars';
  const expected = 'PlainText123 - no special chars';
  t.is(escapeXml(input), expected);
});

// @ts-ignore TS2349
test('escapeXml: handles empty string', (t) => {
  t.is(escapeXml(''), '');
});

// @ts-ignore TS2349
test('escapeXml: multiple occurrences of each character', (t) => {
  const input = `<<&&''"">>`;
  const expected = `&lt;&lt;&amp;&amp;&apos;&apos;&quot;&quot;&gt;&gt;`;
  t.is(escapeXml(input), expected);
});
