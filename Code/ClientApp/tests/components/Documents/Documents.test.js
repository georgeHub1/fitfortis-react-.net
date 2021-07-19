import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter  } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Documents from '../../../src/components/Documents/Documents.js';

const Container = Documents;
const mockStore = configureStore([]);

describe('Documents', () => {
  it('renders correctly', () => {
    const account = {
      avatar: '',
      firstName: '',
      lastName: '',
      email: '',
      id: '123456'
    }
    const documents = {
      isLoading: false,
      documents: [],
      removedDocuments: [],
      msg: null,
      isAllDocumentLoaded: false,
      isRemovedDocumentLoaded: false,
      isDeleting: false
    }
    let store = mockStore({
      document: documents,
      profile: { account }
    });
    store.dispatch = jest.fn();

    const wrapper = renderer
      .create(<Provider store={store}>
          <MemoryRouter location="/documents/Medical%20service">
            <Container />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});

// 35000000  : 30 MB
// 3000000   : 2 MB

const getImage = (name, size = 3000000, mimeType) => {
  name = name || 'mock.txt';
  size = size || 500000;
  mimeType = mimeType || 'plain/txt';

  function range (count) {
    var output = '';
    for (var i = 0; i < count; i++) {
        output += 'a';
    }
    return output;
  }

  var blob = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = name;

  return blob;
};

