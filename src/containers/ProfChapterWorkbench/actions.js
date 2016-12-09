import * as types from '../../actionTypes';

export function switchChapterTabs(tab) {
  return { type: types.SWITCH_CHAPTER_TABS, tab };
}
