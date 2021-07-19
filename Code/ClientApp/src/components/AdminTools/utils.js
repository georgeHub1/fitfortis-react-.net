import React from 'react';
import { ReactComponent as FlagBgBg } from '../../img/languages/bg-BG.svg';
import { ReactComponent as FlagEnUs } from '../../img/languages/en-US.svg';
import { ReactComponent as FlagUkUa } from '../../img/languages/uk-UK.svg';
import { ReactComponent as FlagEnIn } from '../../img/languages/en-INTERNATIONAL.svg';

export const getCountryIcon = name => {
  const str = (name) ? name.toLowerCase() : '';

  switch (str) {
    case 'en-us': {
      return <FlagEnUs />;
    }
    case 'bg-bg': {
      return <FlagBgBg />;
    }
    case 'uk-ua': {
      return <FlagUkUa />;
    }
    default: {
      return <FlagEnIn />;
    }
  }
};

export const getValidFormat = data => {
  if (data.language && data.language.includes('uk')) {
    return {
      ...data,
      title: data.titleUkUa,
      description: data.descriptionUkUa
    };
  } else if (data.language && data.language.includes('bg')) {
    return {
      ...data,
      title: data.titleBgBg,
      description: data.descriptionBgBg
    };
  } else if (data.language && data.language.includes('en-us')) {
    return {
      ...data,
      title: data.titleEnUs,
      description: data.descriptionEnUs
    };
  }
  return {
    ...data,
    title: data.titleEn,
    description: data.descriptionEn
  };
};
