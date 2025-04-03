import type {Feature, Token} from './types.js';
import {getStat, mecabNaToUndefined} from './util.js';

export const parseFeature = (feature = ''): Feature => {
  const features = feature.split(',');

  	// 0: 感動詞,
	// 1:	一般,
	// 2: *,
	// 3:	*,
	// 4:	*,
	// 5:	*,
	// 6:	コンニチハ,
	// 7:	今日は,
	// 8:	こんにちは,
	// 9:	コンニチワ,
	// 10:	こんにちは,
	// 11:	コンニチワ,
	// 12:	混,
	// 13:	*,
	// 14:	*,
	// 15:	*,
	// 16:	*

  // '動詞',
  // '非自立可能',
  // '*',
  // '*',
  // '五段-ラ行',
  // '連用形-促音便',
  // 'ナル',
  // '成る',
  // 'なっ',
  // 'ナッ',
  // 'なる',
  // 'ナル',
  // '和',
  // '*',
  // '*',
  // '*',
  // '*'


  
  // UniDic format has more fields than IPADic
  if (features.length >= 17) { // Check if it's likely UniDic format
    const [
      pos, // 品詞 - Part of speech
      posSub1, // 品詞細分類1 - POS subdivision 1
      posSub2, // 品詞細分類2 - POS subdivision 2
      posSub3, // 品詞細分類3 - POS subdivision 3
      conjugatedType, // 活用型 - Conjugation type
      conjugatedForm, // 活用形 - Conjugation form
      basicFormPronunciation, // 語彙素読み - Lemma reading (コンニチハ)
      basicForm, // 語彙素 - Lemma/dictionary form (今日は)
    	reading, // 発音形 - Pronunciation (コンニチワ)
      pronunciation, // 発音形出現形 - Surface pronunciation
      basicFormReading, // 書字形出現形 - Surface written form
      word,
      language, // 語種 - Language type (漢, 混, etc.)
      // ... there might be more fields that we'll capture in _
    ] = features;

    return {
      pos: mecabNaToUndefined(pos),
      posSubs: [
        mecabNaToUndefined(posSub1),
        mecabNaToUndefined(posSub2),
        mecabNaToUndefined(posSub3),
      ],
      conjugatedType: mecabNaToUndefined(conjugatedType),
      conjugatedForm: mecabNaToUndefined(conjugatedForm),
      
      // These are the key fields being reordered/renamed for UniDic
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
      pos,
      posSub1,
      posSub2,
      posSub3,
      conjugatedType,
      conjugatedForm,
      basicForm,
      reading,
      pronunciation,
    ] = features;

    return {
      pos: mecabNaToUndefined(pos),
      posSubs: [
        mecabNaToUndefined(posSub1),
        mecabNaToUndefined(posSub2),
        mecabNaToUndefined(posSub3),
      ],
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
