import CalendarLocale from './Calendar';
import TimePickerLocale from './TimePicker';

const lang = {
	placeholder: 'Оберіть дату',
	rangePlaceholder: ['Початкова дата', 'Кінцева дата']
};
var locale = {
	lang: { ...lang, ...CalendarLocale },
	timePickerLocale: TimePickerLocale
};

export default locale;
