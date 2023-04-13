import { PlusCircle } from 'react-bootstrap-icons';
import './OmniBar.css';

interface OmniBarProps {
  onAdd: () => void;
}

const OmniBar = ({ onAdd }: OmniBarProps) => {
  const inputHandler = (ev) => console.log(ev.target.value);

  return (
    <div className="OmniBarContainer">
      <input className="OmniBarSearch" placeholder="Search" onChange={inputHandler} />
      <div className="OmniBarControls">
        <button className="OmniBarControl" title="Add new node" onClick={() => onAdd()}>
          <PlusCircle color="white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default OmniBar;
