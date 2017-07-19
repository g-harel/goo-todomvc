'use strict';

const savedState = JSON.parse(localStorage.getItem(localStorageKey));

app.setState(Object.assign({}, defaultState, savedState));

app.use({watcher: (state) => {
	localStorage.setItem(localStorageKey, JSON.stringify(state));
}});

app('/:currFilter?', ({currFilter}) => (state) => {
	if (!filters[currFilter]) {
		currFilter = 'all';
	}
	const show = !!state.items.length || null;
	state.currFilter = currFilter;
	return (
		['section.todoapp', {}, [
			[Header],
			show && [Main, state],
			show && [Footer, state],
		]]
	);
});

app.use({route: {
	path: '**',
	callback: () => app.redirect('/all'),
}});
