'use strict';

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

let app = goo(document.body);

app.use({watcher: (state, type, params) => console.log(type, params)});
app.use({watcher: (state) => console.log(JSON.stringify(state))});

app.setState({
	items: [
		{
			completed: false,
			text: 'test',
		},
	],
	editedItem: null,
});

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

const Header = () => {
	const onsubmit = (e) => {
		e.preventDefault();
		const input = e.target.querySelector('input');
		const text = input.value.trim();
		if (text) {
			app.act('ADD', {text});
			input.value = '';
		}
	};
	return (
		['header.header', {}, [
			['h1', {}, [
				'todos',
			]],
			['form', {onsubmit}, [
				['input.new-todo', {
					autofocus: true,
					placeholder: 'What needs to be done?',
				}],
			]],
		]]
	);
};

const EditInput = ({index, text}) => {
	const submit = (value) => {
		value = value.trim();
		if (!value) {
			app.act('REMOVE', index);
			return;
		}
		app.act('END_EDIT', {index, value});
	};
	const onsubmit = (e) => {
		e.preventDefault();
		submit(e.target.querySelector('input').value);
	};
	const onblur = (e) => {
		submit(e.target.value);
	};
	return (
		['form', {onsubmit}, [
			['input.edit', {value: text, onblur}],
		]]
	);
};

const Item = ({item, index, currFilter, editedItem}) => {
	if (!filters[currFilter].filter(item)) {
		return null;
	}
	const {completed, text} = item;
	let className = completed ? 'completed' : '';
	if (index === editedItem) {
		className += ' editing';
		setTimeout(() => {
			document.querySelectorAll('input.edit')[index].focus();
		}, 0);
	}
	return (
		['li', {className}, [
			['div.view', {}, [
				['input.toggle', {
					type: 'checkbox',
					checked: completed,
					onclick: () => app.act('TOGGLE', index),
				}],
				['label', {
					ondblclick: () => app.act('START_EDIT', index),
				}, [
					text,
				]],
				['button.destroy', {
					onclick: () => app.act('REMOVE', index),
				}],
			]],
			[EditInput, {index, text}],
		]]
	);
};

const Main = ({currFilter, items, editedItem}) => {
	return (
		['section.main', {}, [
			['input#toggle-all.toggle-all', {type: 'checkbox'}],
			['label', {
				for: 'toggle-all',
				onclick: () => app.act('TOGGLE_ALL'),
			}, [
				'Mark all as complete',
			]],
			['ul.todo-list', {},
				items.map((item, index) => (
					[Item, {item, index, currFilter, editedItem}]
				)),
			],
		]]
	);
};

const Filter = ({key, name, currFilter}) => {
	const className = key === currFilter ? 'selected' : null;
	const onclick = () => app.redirect(`/${key}`);
	return (
		['li', {}, [
			['a', {className, onclick}, [
				name,
			]],
		]]
	);
};

const ClearButton = ({items}) => {
	if (!items.find((item) => item.completed)) {
		return null;
	}
	const onclick = () => app.act('CLEAR_COMPLETED');
	return (
		['button.clear-completed', {onclick}, [
			'Clear Completed',
		]]
	);
};

const Footer = ({items, currFilter}) => {
	const s = items.length !== 1 ? 's' : '';
	return (
		['footer.footer', {}, [
			['span.todo-count', {}, [
				['strong', {}, [
					String(items.length),
				]],
				` item${s} left`,
			]],
			['ul.filters', {},
				Object.keys(filters).map((key) => (
					[Filter, {key, name: filters[key].name, currFilter}]
				)),
			],
			[ClearButton, {items}],
		]]
	);
};

app('/:currFilter?', ({currFilter = 'all'}) => (state) => {
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
