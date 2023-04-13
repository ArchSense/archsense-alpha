import * as React from 'react';
import { Levels } from '../../../services/levels';
import './Views.css';

const isEnabled = (currentIdx: number, renderIdx: number) => {
  return currentIdx >= renderIdx;
};

const Views = ({ current, onChange }: { current: Levels; onChange: (view: Levels) => void }) => {
  const onClickHandler = (ev: React.MouseEvent) => {
    onChange((ev.target as HTMLInputElement).value as Levels);
  };
  return (
    <div className="react-flow__panel bottom views">
      {Object.entries(Levels).map(([key, val], idx) => {
        const classNames = ['react-flow__controls-button'];
        if (current === key) {
          classNames.push('selected');
        }
        const disabled = !isEnabled(Object.values(Levels).indexOf(current), idx);
        return (
          <button
            key={key}
            value={val}
            disabled={disabled}
            onClick={onClickHandler}
            type="button"
            className={classNames.join(' ')}
          >
            {val}
          </button>
        );
      })}
    </div>
  );
};

export default Views;
