import { useRef } from 'react';

const SPLITTER_WIDTH = 2;

const CSSValueToNumber = (value: string) => {
  return Number(value.replace('px', ''));
};

const useSplitPanel = (
  containerRef: React.RefObject<any>,
  ...paneRefs: React.RefObject<any>[]
) => {
  const isDragging = useRef(false);
  const activeSplitterIndex = useRef(0);

  const onResizeStart = (ev: React.BaseSyntheticEvent) => {
    isDragging.current = true;
    ev.target.classList.toggle('draggable');
    activeSplitterIndex.current = ev.target.dataset['index'] ?? 0;
  };
  const onResizeEnd = (ev: React.BaseSyntheticEvent) => {
    isDragging.current = false;
    ev.target.classList.toggle('draggable');
  };

  const calculatePaneLeftPWidth = (ev: React.MouseEvent) => {
    if (Number(activeSplitterIndex.current) === 0) {
      const minWidth = CSSValueToNumber(
        getComputedStyle(paneRefs[0].current).minWidth,
      );
      return ev.clientX < minWidth ? minWidth : ev.clientX;
    }
    return paneRefs[0].current.clientWidth;
  };

  const calculatePaneRightWidth = (ev: React.MouseEvent) => {
    if (Number(activeSplitterIndex.current) === 1) {
      const minWidth = CSSValueToNumber(
        getComputedStyle(paneRefs[1].current).minWidth,
      );
      const newWidth = containerRef.current.clientWidth - ev.clientX;
      return newWidth < minWidth ? minWidth : newWidth;
    }
    return paneRefs[1].current.clientWidth;
  };
  const onResizing = (ev: React.MouseEvent) => {
    if (!isDragging.current) {
      return;
    }
    const container = containerRef.current;
    const leftColWidth = calculatePaneLeftPWidth(ev);
    const rightColWidth = calculatePaneRightWidth(ev);

    const cols = [
      leftColWidth,
      SPLITTER_WIDTH,
      container.clientWidth - 2 * SPLITTER_WIDTH - leftColWidth - rightColWidth,
      SPLITTER_WIDTH,
      rightColWidth,
    ];

    const newColDefinition = cols.map(c => `${c}px`).join(' ');
    container.style.gridTemplateColumns = newColDefinition;
    ev.preventDefault();
  };

  return {
    onResizeStart,
    onResizing,
    onResizeEnd,
  };
};

export default useSplitPanel;
