'use strict';

const localStorageKey = 'goo-todomvc';

const app = goo(document.body);

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
