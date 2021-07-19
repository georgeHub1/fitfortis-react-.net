export const data = [
  {
    title: 'Headaches',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  },
  {
    title: 'Injections',
    description: 'Among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  },
  {
    title: 'Headaches Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  },
  {
    title: 'Botox Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  },
  {
    title: 'And  Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  },
  {
    title: 'Botox',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  },
  {
    title: 'Injections',
    description: 'The 21st century is the golden age for surgical procedures, among them an increasingly popular method of corrective eye surgery known as LASIK. LASIK is an acronym for the surgery, which stands for Laser Assisted In Situ Keratomileusis. This procedure has become increasingly reliable, with unresolved complications reported in, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: new Date()
  }
];

export const filter = (filterData, text) => {
  if (text) {
    return filterData.filter(x => {
      return x.title.toLowerCase().includes(text.toLowerCase());
    });
  }
  return filterData;
};

export const alertList = [
  {
    title: 'Time for your annual checkup!',
    descrption: 'It\'s time for your anual checkup! Please call your doctor to schedule an appointment. You can generate a health report and bring it to your appointment, to have a high-bandwitdh conversation with your doctor.',
    date: new Date(),
    type: 'red'
  },
  {
    title: 'Time for your annual checkup!',
    descrption: 'It\'s time for your anual checkup! Please call your doctor to schedule an appointment. You can generate a health report and bring it to your appointment, to have a high-bandwitdh conversation with your doctor.',
    date: new Date(),
    type: 'blue'
  },
  {
    title: 'Time for your annual checkup!',
    descrption: 'It\'s time for your anual checkup! Please call your doctor to schedule an appointment. You can generate a health report and bring it to your appointment, to have a high-bandwitdh conversation with your doctor.',
    date: new Date(),
    type: 'red',
    image: 'image'
  },
  {
    title: 'Time for your annual checkup!',
    descrption: 'It\'s time for your anual checkup! Please call your doctor to schedule an appointment. You can generate a health report and bring it to your appointment, to have a high-bandwitdh conversation with your doctor.',
    date: new Date(),
    image: 'image',
    type: 'blue'
  }
];
