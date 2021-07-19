import _ from 'lodash';

export const getColorClass = (type = '') => {
  switch (type.toLowerCase()) {
    case 'medicaldiagnosis':
      return 'medicalDiagnosis';
    case 'medicalimage':
      return 'medicalImage';
    case 'medicaltest':
      return 'medicalTest';
    case 'healthreport':
      return 'healthReport';
    case 'prescription':
      return 'prescription';
    case 'insurancereport':
      return 'insurancereport';
    case 'consentandassentform':
      return 'consentandassentform';
    case 'other':
      return 'other';
    default:
      return 'no-selected';
  }
};

// TODO: These documents types should be coming from
// the backend. Once the backend is done, it should
// return a list of types directly.
export const getType = type => {
  switch (type.toLowerCase()) {
    case 'medicaldiagnosis':
      return 'Medical Diagnosis';
    case 'medicalimage':
      return 'Medical Image';
    case 'medicaltest':
      return 'Medical Test';
    case 'healthreport':
      return 'Health Report';
    case 'prescription':
      return 'Prescription';
    case 'insurancereport':
      return 'Insurance Report';
    case 'consentandassentform':
      return 'Consent And Assent Form';
    case 'other':
      return 'Other';
    default:
      return 'no-selected';
  }
};

export const sortingDocuments = (data, sorting, searchText) => {
  if (sorting.date === 'none' && sorting.type === 'none' && sorting.name === 'none') {
    const search = data.filter(x =>  x.fileName.toLowerCase().includes(searchText.toLowerCase()) || x.description.toLowerCase().includes(searchText.toLowerCase()));

    return (searchText) ? search : data;
  }

  if (sorting.date !== 'none' && sorting.type === 'none' && sorting.fileName === 'none') {
    const orderBy = _.orderBy(data, ['date'], [sorting.date]);
    const search = orderBy.filter(x =>  x.fileName.toLowerCase().includes(searchText.toLowerCase()) || x.description.toLowerCase().includes(searchText.toLowerCase()));

    return (searchText) ? search : orderBy;
  } else if (sorting.date === 'none' && sorting.type !== 'none' && sorting.name === 'none') {
    const orderBy = _.orderBy(data, ['type'], [sorting.type]);
    const search = orderBy.filter(x =>  x.fileName.toLowerCase().includes(searchText.toLowerCase()) || x.description.toLowerCase().includes(searchText.toLowerCase()));

    return (searchText) ? search : orderBy;
  } else if (sorting.date === 'none' && sorting.type === 'none' && sorting.name !== 'none') {
    const orderBy = _.orderBy(data, ['fileName'], [sorting.name]);
    const search = orderBy.filter(x =>  x.fileName.toLowerCase().includes(searchText.toLowerCase()) || x.description.toLowerCase().includes(searchText.toLowerCase()));

    return (searchText) ? search : orderBy;
  }
  const orderBy = _.orderBy(data, ['date', 'type'], [sorting.date, sorting.type]);
  const search = orderBy.filter(x =>  x.fileName.toLowerCase().includes(searchText.toLowerCase()) || x.description.toLowerCase().includes(searchText.toLowerCase()));

  return (searchText) ? search : orderBy;
};
