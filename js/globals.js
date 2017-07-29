'use strict';

const localStorageKey = 'okwolo-todomvc';

const app = okwolo(document.body);

const defaultState = {
	items: [],
	editedItem: null,
};

const defaultItem = {
	completed: false,
	text: 'item',
};

const filters = {
	all: {
		name: 'All',
		filter: (item) => true,
	},
	active: {
		name: 'Active',
		filter: (item) => !item.completed,
	},
	completed: {
		name: 'Completed',
		filter: (item) => item.completed,
	},
};
