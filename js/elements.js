'use strict';

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
	const remainingItems = items.filter((item) => !item.completed).length;
	const s = remainingItems !== 1 ? 's' : '';
	return (
		['footer.footer', {}, [
			['span.todo-count', {}, [
				['strong', {}, [
					String(remainingItems),
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
