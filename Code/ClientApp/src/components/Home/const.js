export const data = [
  {
    title: 'Headaches',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f1'
  },
  {
    title: 'Injections',
    description: 'Among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f2'
  },
  {
    title: 'Headaches Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f3'
  },
  {
    title: 'Botox Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f4'
  },
  {
    title: 'And  Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f5'
  },
  {
    title: 'Botox',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    image: 'image',
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f6'
  },
  {
    title: 'Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date(),
    id: '0825586e-9bf4-43ba-53fb-08d77e21eb9f7'
  }
];

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

export const filter = (filterData, text) => {
  if (text) {
    return filterData.filter(x => {
      return x.title.toLowerCase().includes(text.toLowerCase());
    });
  }
  return filterData.sort(compareDate);
};
