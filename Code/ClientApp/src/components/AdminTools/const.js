export const data = [
  {
    title: 'Headaches Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly.',
    date: '2020-02-08',
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f3',
    language: 'EN'
  },
  {
    title: 'Botox Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: '2020-02-07',
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f4',
    language: 'UA'
  },
  {
    title: 'And  Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: '2020-02-06',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f5',
    language: 'BG'
  },
  {
    title: 'Botox',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: '2020-02-05',
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f6',
    language: 'EN'
  },
  {
    title: 'Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: '2020-02-04',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f7',
    language: 'UA'
  }
];

export const emails = [
  {
    'email': 'test@user.com'
  },
  {
    'email': 'test1@user.com'
  },
  {
    'email': 'abc@user.com'
  },
  {
    'email': 'test3@user.com'
  },
  {
    'email': 'xyx@user.com'
  }
];


function compare (a, b) {
  const _a = a.email.toUpperCase();
  const _b = b.email.toUpperCase();

  let comparison = 0;

  if (_a > _b) {
  comparison = 1;
  } else if (_a < _b) {
  comparison = -1;
  }
  return comparison;
}

function compareDate (a, b) {
  const _a = a.date;
  const _b = b.date;

  let comparison = 0;

  if (new Date(_a) > new Date(_b)) {
  comparison = -1;
  } else if (new Date(_a) < new Date(_b)) {
  comparison = 1;
  }
  return comparison;
}

export const sorting = data => {
  return data.sort(compare);
};

export const filter = (filterData, text) => {
  if (text) {
    return filterData.filter(x => {
      return (x.titleEnUs || x.titleUkUa || x.titleBgBg).toLowerCase().includes(text.toLowerCase())
        || (x.descriptionEnUs || x.descriptionUkUa || x.descriptionBgBg).toLowerCase().includes(text.toLowerCase());
    });
  }
  return filterData ? filterData.sort(compareDate) : [];
};
