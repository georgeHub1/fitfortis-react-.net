import CalendarLocale from './Calendar';
import TimePickerLocale from './TimePicker';

const lang = {
	placeholder: 'Избор на дата',
	rangePlaceholder: ['Начална', 'Крайна']
};
var locale = {
	lang: { ...lang, ...CalendarLocale },
	timePickerLocale: TimePickerLocale
};

export default locale;
