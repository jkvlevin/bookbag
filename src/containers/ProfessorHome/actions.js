import * as types from '../../actionTypes';

export function switchTabs(tab) {
  return { type: types.SWITCH_TABS, tab };
}
