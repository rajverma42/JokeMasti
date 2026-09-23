#!/usr/bin/env node
/* Validates joke data and prints a content report. Exit code 1 on errors. */
'use strict';
const path = require('path');
const { loadAll } = require('./lib');
const { languages, categories, jokes, errors, warnings } = loadAll(path.resolve(__dirname, '..'));
const count = (arr, key) => arr.reduce((m, j) => (m[j[key]] = (m[j[key]] || 0) + 1, m), {});
const byLang = count(jokes, 'language'), byCat = count(jokes, 'category');
console.log(`\nJokeMasti content report: ${jokes.length} jokes\n`);
console.log('By language:');
languages.forEach(l => console.log(`  ${l.name.padEnd(12)} ${String(byLang[l.code] || 0).padStart(4)}`));
console.log('\nBy primary category:');
categories.filter(c => !c.href && !c.rule).forEach(c => console.log(`  ${c.name.padEnd(28)} ${String(byCat[c.slug] || 0).padStart(4)}`));
const pending = jokes.filter(j => j.reviewStatus === 'pending-native-review').length;
const trad = jokes.filter(j => j.source === 'traditional').length;
console.log(`\nPending native-speaker review: ${pending}`);
console.log(`Marked as traditional retellings: ${trad}`);
warnings.forEach(w => console.warn('warn:', w));
if (errors.length) { errors.forEach(e => console.error('error:', e)); console.error(`\n${errors.length} error(s). Fix them before building.`); process.exit(1); }
console.log('\nNo errors.\n');
