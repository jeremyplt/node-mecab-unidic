import {
	analyze,
	analyzeSync,
	tokenize,
	tokenizeSync,
	wakati,
	wakatiSync,
} from 'node-mecab-unidic';

// const text = '日本に行くことになった時';
const text = "エマは聞きます。「渋谷へ、どうやっては行けますか？」"

Promise.all([analyze(text), tokenize(text), wakati(text)]).then((results) => {
	for (const result of results) {
		console.dir(result, {depth: null});
	}
});

const syncs = [analyzeSync, tokenizeSync, wakatiSync];

for (const sync of syncs) {
	console.dir(sync(text), {depth: null});
}
