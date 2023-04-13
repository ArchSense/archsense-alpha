export enum SceneNodeType {
  PLANNED = 'planned',
  ACTUAL = 'actual',
}

const paintClass = (fileName) => {
  const parts = fileName.split(/(?=[A-Z])/);
  const type = parts.at(-1) ? parts.at(-1).toLowerCase() : void 0;
  switch (type) {
    case 'controller':
    case 'resolver':
      return '#3b5bdbbf';
    case 'service':
      return '#3cd93cbd';
    default:
      return '#939393';
  }
};

export const buildActualNode = ({ data, id }) => {
  const newNode = {
    id: id,
    position: { x: -100, y: -100 },
    type: SceneNodeType.ACTUAL,
    data,
    selectable: true,
    deletable: false,
    className: 'ActualNode',
    style: {
      background: paintClass(data?.name),
    },
  };
  return newNode;
};

export const buildPlannedNode = ({ data }) => {
  const newNode = {
    id: String(Math.random()),
    position: { x: 800, y: 50 },
    type: SceneNodeType.PLANNED,
    data,
    selectable: true,
    deletable: true,
    className: 'PlannedNode',
    style: {},
  };
  return newNode;
};

export const buildAbstractNode = (id: string, label: string) => {
  return {
    id,
    position: { x: -100, y: -100 },
    data: { label },
  };
};
