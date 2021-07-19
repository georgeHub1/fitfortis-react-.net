export const getActivePathName = path => {
  if (path.includes('/encyclopedia/')) {
    path = '/encyclopedia';
  }
  if (path.includes('/newsfeed/')) {
    path = '/';
  }

  switch (path) {
    case '/devices': {
      return 'Hub.devices';
    }
    case '/documents': {
      return 'Hub.documents';
    }
    case '/alerts': {
      return 'Hub.alerts';
    }
    case '/metrics': {
      return 'Hub.metrics';
    }
    case '/encyclopedia': {
      return 'Hub.encyclopedia';
    }
    case path.includes('/encyclopedia'): {
      return 'Hub.encyclopedia';
    }
    case '/symptomChecker': {
      return 'Hub.symptomChecker';
    }
    case '/adminTools': {
      return 'Hub.adminTools';
    }
    case '/profile': {
      return 'Hub.profile';
    }
    case '/': {
      return 'Hub.home';
    }
    case '/about': {
      return 'Hub.about';
    }
    case '/about/privacyAndLegal': {
      return 'Hub.privacyAndLegal';
    }
    default: {
      return 'Hub.home';
    }
  }
};
