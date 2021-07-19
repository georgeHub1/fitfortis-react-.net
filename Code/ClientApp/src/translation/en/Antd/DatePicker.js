import CalendarLocale from './Calendar';
import TimePickerLocale from './TimePicker';

const lang = {
	placeholder: 'Select date',
	rangePlaceholder: ['Start date', 'End date']
};
var locale = {
	lang: { ...lang, ...CalendarLocale },
	timePickerLocale: TimePickerLocale
};

export default locale;
