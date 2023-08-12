import LabelPolygonNodeCreate from './LabelPolygonNodeCreate';
import LabelPolygonNodeEdit from './LabelPolygonNodeEdit';
import { type LabelType } from '../../../types/label.types';
import { type LabelNodeProps } from '../../../types/workspace.types';

function LabelPolygonNode({
  node,
  color,
  onEdit,
  points,
  onDelete,
  onUpdate,
  onCreate,
  onCancel,
  cursorPosition,
}: LabelNodeProps<LabelType.POLYGON>) {
  if (node) {
    return (
      <LabelPolygonNodeEdit
        node={node}
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdate={onUpdate}
        cursorPosition={cursorPosition}
      />
    );
  }

  if (points && color) {
    return (
      <LabelPolygonNodeCreate
        cursorPosition={cursorPosition}
        onCreate={onCreate}
        onCancel={onCancel}
        points={points}
        color={color}
      />
    );
  }

  return null;
}

export default LabelPolygonNode;
