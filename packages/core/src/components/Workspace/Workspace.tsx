import { type ComponentType, useCallback, useRef, useState } from 'react';

import Cursor from './Cursor';
import LabelsNodes from './LabelsNodes';
import MagnifyingGlass from './MagnifyingGlass';
import SVGLayer from './SVGLayer';
import WorkspaceBackground from './WorkspaceBackground';
import { useImage } from '../../hooks/use-image';
import { useWorkspaceEvents } from '../../hooks/use-workspace-events';
import { type Label, LabelType } from '../../types/label.types';
import { type ToolBarProps } from '../../types/workspace.types';

interface WorkspaceProps {
  toolbar: ComponentType<ToolBarProps>;
  onChange: (labels: Label[]) => void;
  className?: string;
  labels: Label[];
  src: string;
}

function Workspace({ src, labels, onChange, toolbar: ToolBar }: WorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height, viewBox } = useImage(
    src,
    containerRef.current?.clientWidth,
    containerRef.current?.clientHeight,
  );

  const [tool, setTool] = useState<{ default: LabelType | undefined; override: LabelType | undefined }>({
    default: LabelType.RECT,
    override: undefined,
  });
  const activeTool = tool.override ?? tool.default;

  const [currentPosition, setCurrentPosition] = useState<DOMPoint>();
  const [LabelNode, data, events] = useWorkspaceEvents(activeTool);
  const [isMouseDown, setIsMouseDown] = useState<boolean>();
  const [node, setNode] = useState<Label>();

  const drawEventsEnabled = !node?.id && activeTool;
  const hasPoints = Boolean(data.points?.length);

  const onToolChange = useCallback((type?: LabelType) => {
    setNode(undefined);
    setTool(() => ({
      default: type,
      override: undefined,
    }));
  }, []);

  const onEdit = useCallback((incoming?: Label) => {
    if (!incoming) {
      return;
    }

    setNode(incoming);
  }, []);

  const onUpdate = useCallback(
    (incoming?: Label) => {
      if (incoming) {
        const idx = labels.findIndex((label) => label.id === incoming.id);
        labels[idx] = incoming;

        onChange([...labels]);
      }

      setNode(undefined);
      setTool((prev) => ({ ...prev, override: undefined }));
    },
    [labels, onChange],
  );

  const onDelete = useCallback(() => {
    if (!node?.id) {
      return;
    }

    onChange(labels.filter((label) => label.id !== node.id));
    setNode(undefined);
  }, [labels, node?.id, onChange]);

  const onCreate = useCallback(
    (label: Label) => {
      onChange([...labels, label]);
      events.reset();
    },
    [events, labels, onChange],
  );

  const onLabelNodeSelect = useCallback(
    (label: Label) => {
      if (label.type !== activeTool) {
        setTool((prev) => ({ ...prev, override: label.type }));
      }

      setNode({ ...label, points: label.points.map((point) => DOMPoint.fromPoint(point)) } as Label);
    },
    [activeTool],
  );

  const onMouseDown = useCallback(
    (point: DOMPoint) => {
      setCurrentPosition((prev) => prev ?? point);

      if (activeTool) {
        setIsMouseDown(true);
      }

      if (drawEventsEnabled) {
        events.onMouseDown(point);
      }
    },
    [events, activeTool, drawEventsEnabled],
  );

  const onMouseUp = useCallback(
    (point: DOMPoint) => {
      if (activeTool) {
        setIsMouseDown(false);
      }

      if (drawEventsEnabled) {
        events.onMouseUp(point);
      }
    },
    [events, activeTool, drawEventsEnabled],
  );

  const onMouseLeave = useCallback(() => {
    if (!hasPoints) {
      setCurrentPosition(undefined);
    }
  }, [hasPoints]);

  return (
    <>
      <div className="p-4 w-full flex-1 flex flex-col shadow-md bg-slate-50 rounded-xl relative">
        <ToolBar
          isDirty={hasPoints}
          onDelete={onDelete}
          onClear={events.reset}
          activeTool={activeTool}
          onToolChange={onToolChange}
          isInEditMode={Boolean(node)}
        />
        <div className="w-full flex flex-1 justify-center align-middle relative z-10" ref={containerRef}>
          <MagnifyingGlass src={src} currentPosition={currentPosition} layerHeight={height} layerWidth={width}>
            {currentPosition && (
              <>
                <LabelNode {...data} node={node} cursorPosition={currentPosition} />
                <Cursor active={isMouseDown} currentPosition={currentPosition} />
              </>
            )}
          </MagnifyingGlass>
          <SVGLayer
            onPointerDown={activeTool ? onMouseDown : undefined}
            onPointerUp={activeTool ? onMouseUp : undefined}
            onPointerMove={setCurrentPosition}
            onPointerLeave={onMouseLeave}
            viewBox={viewBox}
            height={height}
            width={width}
            src={src}
          >
            <LabelsNodes
              nodes={labels}
              activeNodeId={node?.id}
              onClick={Boolean(node) || hasPoints ? undefined : onLabelNodeSelect}
            />
            <LabelNode
              {...data}
              node={node}
              onEdit={onEdit}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onCreate={onCreate}
              onCancel={events.reset}
              cursorPosition={currentPosition}
            />
            {currentPosition && <Cursor active={isMouseDown} currentPosition={currentPosition} />}
          </SVGLayer>
        </div>
        <WorkspaceBackground />
      </div>
    </>
  );
}

export default Workspace;
