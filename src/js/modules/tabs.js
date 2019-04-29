import {initState, saveState} from 'modules/saveable';
import uuid from 'uuid/v4';

const init = initState('tabs');
const save = saveState('tabs');

export const ADD_TAB    = `${PACKAGE_NAME}/tabs/add-tab`;
export const EDIT_TAB   = `${PACKAGE_NAME}/tabs/edit-tab`;
export const REMOVE_TAB = `${PACKAGE_NAME}/tabs/remove-tab`;

export function addTab(name, url)
{
  return {
    type: ADD_TAB,
    tab: {
      id: uuid(),
      name,
      url
    }
  }
}

export function editTab(id, name, url)
{
  return {
    type: EDIT_TAB,
    id,
    changes: {
      name,
      url
    }
  };
}

export function removeTab(id)
{
  return {
    type: REMOVE_TAB,
    id
  };
}

const initialState = init({
  tabs: []
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_TAB:
      return {
        ...state,
        ...save({
          tabs: [...state.tabs, action.tab]
        })
      };
      break;
    case EDIT_TAB:
      var newTabs = _.cloneDeep(state.tabs);
      var tab = _.find(newTabs, {id: action.id});
      tab.name = action.changes.name;
      tab.url = action.changes.url;
      return {
        ...state,
        ...save({
          tabs: newTabs
        })
      };
      break;
    case REMOVE_TAB:
      return {
        ...state,
        ...save({
          tabs: _.filter(state.tabs, tab => tab.id != action.id)
        })
      };
      break;
    default:
      return state;
  }
}
