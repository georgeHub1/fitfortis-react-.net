export const causesAndDiagnosis = [
  {
    category: 'acute bronchitis',
    name: 'Acute bronchitis',
    shortDescription:
      'Acute bronchitis is an inflammation of the lining of bronchial tubes, which carry air to and from the lungs. It is often caused by a viral respiratory infection and improves by itself. Treatments usually includes soothing remedies to help with coughing, which may last weeks. Antibiotics are not usually recommended.'
  },
  {
    category: 'cold',
    name: 'Cold',
    shortDescription:
      'The common cold is a viral infection of your nose and throat (upper respiratory tract). It\'s usually harmless, although it might not feel that way. Many types of viruses can cause a common cold. Children younger than 6 are at greatest risk of colds, but healthy adults can also expect to have two or three colds annually. Most people recover from a common cold in a week or 10 days. Symptoms might last longer in people who smoke. If symptoms don\'t improve, see your doctor.'
  },
  {
    category: 'flu',
    name: 'Flu',
    shortDescription:
      'Influenza, or flu, is a respiratory illness caused by a virus. Flu is highly contagious and is normally spread by the coughs and sneezes of an infected person. A person can also catch flu by touching an infected person, for instance, by shaking hands. Adults are contagious 1–2 days before getting symptoms and up to 7 days after becoming ill. This means that you can spread the influenza virus before you even know you are infected. In this article, we explain the symptoms of flu, how it is treated, how it differs from a cold, and the best ways to prevent flu occurring.'
  },
  {
    category: 'pneumonia',
    name: 'Pneumonia',
    shortDescription:
      'Pneumonia is an infection of the lungs that may be caused by bacteria, viruses, or fungi. The infection causes the lungs\' air sacs (alveoli) to become inflamed and fill up with fluid or pus. That can make it hard for the oxygen you breathe in to get into your bloodstream. The symptoms of pneumonia can range from mild to severe, and include cough, fever, chills, and trouble breathing. Many factors affect how serious a case of pneumonia is, such as the type of germ causing the lung infection, the person’s age, and their overall health. '
  },
  {
    category: 'sinusitis (sinus infection)',
    name: 'Sinusitis (sinus infection)',
    shortDescription:
      'Sinusitis is an inflammation or swelling of the tissue lining the sinuses. Healthy sinuses are filled with air. But when they become blocked and filled with fluid, germs can grow and cause an infection.'
  },
  {
    category: 'strep throat',
    name: 'Strep throat',
    shortDescription:
      'Strep throat is a bacterial infection that can make your throat feel sore and scratchy. Strep throat accounts for only a small portion of sore throats. If untreated, strep throat can cause complications, such as kidney inflammation or rheumatic fever. Rheumatic fever can lead to painful and inflamed joints, a specific type of rash, or heart valve damage. Strep throat is most common in children, but it affects people of all ages. If you or your child has signs or symptoms of strep throat, see your doctor for prompt testing and treatment. '
  },
  {
    category: 'stroke',
    name: 'Stroke',
    shortDescription:
      'A stroke is a “brain attack”. It can happen to anyone at any time. It occurs when blood flow to an area of brain is cut off. When this happens, brain cells are deprived of oxygen and begin to die. When brain cells die during a stroke, abilities controlled by that area of the brain such as memory and muscle control are lost. How a person is affected by their stroke depends on where the stroke occurs in the brain and how much the brain is damaged. For example, someone who had a small stroke may only have minor problems such as temporary weakness of an arm or leg.'
  },
  {
    category: 'tonsillitis',
    name: 'Tonsillitis',
    shortDescription:
      'Tonsillitis is inflammation of the tonsils, two oval-shaped pads of tissue at the back of the throat — one tonsil on each side. Signs and symptoms of tonsillitis include swollen tonsils, sore throat, difficulty swallowing and tender lymph nodes on the sides of the neck. Most cases of tonsillitis are caused by infection with a common virus, but bacterial infections also may cause tonsillitis.'
  }
  ];
export const twoMonths = +(2 / 12).toFixed(2);

export const years = [
  { value: '0_2m', name: 'Newborn 0-2 months', ageRange: [0, twoMonths] },
  { value: '2m_1', name: 'Infant 2-12 months', ageRange: [twoMonths, 1] },
  { value: '1_4', name: 'Toddler 1-4 years', ageRange: [1, 4] },
  { value: '5_11', name: 'Child 5-11 years', ageRange: [5, 11] },
  { value: '12_19', name: 'Teen 12-19 years', ageRange: [12, 19] },
  { value: '20_29', name: 'Adult 20-29 years', ageRange: [20, 29] },
  { value: '30_39', name: 'Adult 30-39 years', ageRange: [30, 39] },
  { value: '40_49', name: 'Adult 40-49 years', ageRange: [40, 49] },
  { value: '50_59', name: 'Adult 50-59 years', ageRange: [50, 59] },
  { value: '60_plus', name: 'Adult 60+ years', ageRange: [60, 150] }
];


export const calculateAge = dateString => {
  const today = new Date();
  const birthDate = new Date(dateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
};


export const getAgeRange = dateString => {
  const age = calculateAge(dateString);

  let range;

  for (const i in years) {
    const ageRange = years[i].ageRange;

    if (age >= ageRange[0] && age <= ageRange[1]) {
      range = years[i];
      break;
    }
  }
  return range;
};
