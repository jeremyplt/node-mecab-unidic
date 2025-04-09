import type {Feature, Token} from './types.js';
import {getStat, mecabNaToUndefined} from './util.js';

export const parseFeature = (feature = ''): Feature => {
  // Split by comma, but respecting quoted values
  const features = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < feature.length; i++) {
    const char = feature[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
      current += char;
    } else if (char === ',' && !insideQuotes) {
      features.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Don't forget the last part
  if (current) {
    features.push(current);
  }

  // UniDic format has more fields than IPADic
  if (features.length >= 17) { // Check if it's likely UniDic format
    const [
      pos1, // 品詞 - Part of speech
      pos2, // 品詞細分類1 - POS subdivision 1
      pos3, // 品詞細分類2 - POS subdivision 2
      pos4, // 品詞細分類3 - POS subdivision 3
      conjugatedType, // 活用型 - Conjugation type
      conjugatedForm, // 活用形 - Conjugation form
      basicFormReading, // 語彙素読み - Lemma reading (コンニチハ)
      lemma, // 語彙素 - Lemma/dictionary form (今日は)
      null0, // 発音形 - Pronunciation (コンニチワ)
      pronunciation, // 発音形出現形 - Surface pronunciation
      basicForm, // 書字形出現形 - Surface written form
      basicFormPronunciation,
      null1,
      null2,
      null3,
      null4,
      null5,
      null6,
      null7,
      null8,
      reading
      // ... there might be more fields that we'll capture in _
    ] = features;

    return {
      pos1: mecabNaToUndefined(pos1),
      pos2: mecabNaToUndefined(pos2),
      pos3: mecabNaToUndefined(pos3),
      pos4: mecabNaToUndefined(pos4),
      conjugatedType: mecabNaToUndefined(conjugatedType),
      conjugatedForm: mecabNaToUndefined(conjugatedForm),
      
      // These are the key fields being reordered/renamed for UniDic
      lemma: mecabNaToUndefined(lemma),
      basicForm: mecabNaToUndefined(basicForm),
      basicFormPronunciation: mecabNaToUndefined(basicFormPronunciation),
      basicFormReading: mecabNaToUndefined(basicFormReading), // Map to what was basicForm in IPADic

      reading: mecabNaToUndefined(reading),
      pronunciation: mecabNaToUndefined(pronunciation),
      
      // Store all fields for reference
      _original: features,
    };
  } else {
    // Fall back to IPADic format for backward compatibility
    const [
      pos1,
      pos2,
      pos3,
      pos4,
      conjugatedType,
      conjugatedForm,
      basicForm,
      reading,
      pronunciation,
    ] = features;

    return {
      pos1: mecabNaToUndefined(pos1),
      pos2: mecabNaToUndefined(pos2),
      pos3: mecabNaToUndefined(pos3),
      pos4: mecabNaToUndefined(pos4),
      conjugatedType: mecabNaToUndefined(conjugatedType),
      conjugatedForm: mecabNaToUndefined(conjugatedForm),
      basicForm: mecabNaToUndefined(basicForm),
      reading: mecabNaToUndefined(reading),
      pronunciation: mecabNaToUndefined(pronunciation),
    };
  }
};



export const parseDump = (dump: string): Token[] => {
	return dump.split(/\r?\n/).map<Token>((row) => {
		const values = row.split(' ');
		return {
			id: Number(values[0]),
			surface: values[1] ?? '',
			feature: parseFeature(values[2]),
			startPosition: Number(values[3]),
			endPosition: Number(values[4]),
			rcAttr: Number(values[5]),
			lcAttr: Number(values[6]),
			posid: Number(values[7]),
			charType: Number(values[8]),
			stat: getStat(values[9]),
			isbest: Boolean(Number(values[10])),
			alpha: Number(values[11]),
			beta: Number(values[12]),
			prob: Number(values[13]),
			cost: Number(values[14]),
			_: values.slice(15),
		};
	});
};
