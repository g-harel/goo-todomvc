'use strict';

app.use({action: {
	type: 'ADD',
	target: ['items'],
	handler: (items, item) => {
		items.push(Object.assign({}, defaultItem, item));
		return items;
	},
}});

app.use({action: {
	type: 'REMOVE',
	target: ['items'],
	handler: (items, index) => {
		items.splice(index, 1);
		return items;
	},
}});

app.use({action: {
	type: 'TOGGLE',
	target: ['items'],
	handler: (items, index) => {
		items[index].completed = !items[index].completed;
		return items;
	},
}});

app.use({action: {
	type: 'START_EDIT',
	target: ['editedItem'],
	handler: (items, index) => index,
}});

app.use({middleware: (next, state, type) => {
	if (type !== 'START_EDIT') {
		state.editedItem = null;
	}
	next(state);
}});

app.use({action: {
	type: 'END_EDIT',
	target: ['items'],
	handler: (items, {index, value}) => {
		items[index].text = value;
		return items;
	},
}});

app.use({action: {
	type: 'COMPLETE_ALL',
	target: ['items'],
	handler: (items) => items.map((item) => {
		item.completed = true;
		return item;
	}),
}});

app.use({action: {
	type: 'TOGGLE_ALL',
	target: ['items'],
	handler: (items) => {
		let value = false;
		if (items.find((item) => !item.completed)) {
			value = true;
		}
		return items.map((item) => {
			item.completed = value;
			return item;
		});
	},
}});

app.use({action: {
	type: 'CLEAR_COMPLETED',
	target: ['items'],
	handler: (items) => items.filter((item) => !item.completed),
}});
