import {
	analyze,
	analyzeSync,
	tokenize,
	tokenizeSync,
	wakati,
	wakatiSync,
} from 'node-mecab-unidic';

// const text = '日本に行くことになった時';
const text = "「今度は美術館に行ってみようかな」とピエールは笑顔で言います"

Promise.all([analyze(text), tokenize(text), wakati(text)]).then((results) => {
	// for (const result of results) {
	// 	console.dir(result, {depth: null});
	// }
});

const syncs = [analyzeSync, tokenizeSync, wakatiSync];

for (const sync of syncs) {
	// console.dir(sync(text), {depth: null});
}
