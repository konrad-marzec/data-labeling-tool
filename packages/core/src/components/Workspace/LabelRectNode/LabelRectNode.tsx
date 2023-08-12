import LabelRectNodeCreate from './LabelRectNodeCreate';
import LabelRectNodeEdit from './LabelRectNodeEdit';
import { type LabelType } from '../../../types/label.types';
import { type LabelNodeProps } from '../../../types/workspace.types';

function LabelRectNode({
  node,
  color,
  onEdit,
  points,
  onDelete,
  onUpdate,
  onCreate,
  cursorPosition,
}: LabelNodeProps<LabelType.RECT>) {
  if (node) {
    return (
      <LabelRectNodeEdit
        node={node}
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdate={onUpdate}
        cursorPosition={cursorPosition}
      />
    );
  }

  if (points && color) {
    return <LabelRectNodeCreate onCreate={onCreate} points={points} cursorPosition={cursorPosition} color={color} />;
  }

  return null;
}

export default LabelRectNode;
