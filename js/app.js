'use strict';

const savedState = JSON.parse(localStorage.getItem(localStorageKey));

app.setState(Object.assign({}, defaultState, savedState));

app.use({watcher: (state) => {
	localStorage.setItem(localStorageKey, JSON.stringify(state));
}});

// base url is different when hosted on github pages
if (window.location.hostname.match(/github\.io/)) {
	app.use({base: '/okwolo-todomvc'});
}

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
