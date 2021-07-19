export const removeSelectedItem = (items, selected) => {
	for (const i in selected) {
		const index = items.findIndex(x => x.id === selected[i].id &&  x.name === selected[i].name);

		if (index > -1) {
			items.splice(index, 1);
		}
	}
	return items;
};
