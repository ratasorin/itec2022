import * as go from 'gojs';
import { useRef } from 'react';

const FLOOR_CONTAINER_KEY = 'FLOOR_CONTAINER';
const BACKGROUND_LAYER_NAME = 'BACKGROUND';
const ALLOW_DROP_OUTSIDE_HIGHLIGHTED_AREA = false;

const cellSize = new go.Size(20, 20);
const $ = go.GraphObject.make;

let collidedWithFloorContainer: boolean = false;
// // R is a Rect in document coordinates
// // NODE is the Node being moved -- ignore when looking for Parts intersecting the Rect
function isUnoccupied(r: go.Rect, node: go.Node) {
  var diagram = node.diagram!;

  // nested function used by Layer.findObjectsIn, below
  // only consider Parts, and ignore the given Node, any Links, and Group members
  function navig(obj: go.GraphObject) {
    var part = obj.part!;

    if (part === node) return null;
    if (part instanceof go.Link) return null;
    if (part.isMemberOf(node)) return null;
    if (node.isMemberOf(part)) return null;

    return part;
  }

  // only consider non-temporary Layers
  var lit = diagram.layers;
  while (lit.next()) {
    var lay = lit.value;
    if (lay.isTemporary) continue;

    const intersectingObjects = lay.findObjectsIn(r, navig, null, false);

    console.log(intersectingObjects.toArray());
    const isOutside = intersectingObjects.toArray().find((part) => {
      console.log(part);
      return part.layerName === BACKGROUND_LAYER_NAME;
    });
    if (intersectingObjects.count > 0 && !isOutside) return false;
  }
  console.log('true');
  return true;
}

// Regular Nodes represent items to be put onto racks.
// Nodes are currently resizable, but if that is not desired, just set resizable to false.
const draggableNode = $(
  go.Node,
  'Auto',
  {
    resizable: true,
    resizeObjectName: 'SHAPE',
    // because the gridSnapCellSpot is Center, offset the Node's location
    // locationSpot: new go.Spot(0, 0, cellSize.width / 2, cellSize.height / 2),

    dragComputation: (node: go.Part, pt: go.Point, gridpt: go.Point) => {
      if (node.diagram instanceof go.Palette) return gridpt;

      // this assumes each node is fully rectangular
      var bnds = node.actualBounds;
      var loc = node.location;

      // use PT instead of GRIDPT if you want to ignore any grid snapping behavior
      // see if the area at the proposed location is unoccupied
      var r = new go.Rect(
        gridpt.x - (loc.x - bnds.x),
        gridpt.y - (loc.y - bnds.y),
        bnds.width,
        bnds.height
      );

      // when dragging a node from another Diagram, choose an unoccupied area
      if (
        !(node.diagram!.currentTool instanceof go.DraggingTool) &&
        !node.layer!.isTemporary
      ) {
        while (!isUnoccupied(r, node as go.Node)) {
          r.x += 10; // note that this is an unimaginative search algorithm --
          r.y += 2; // you can improve the search here to be more appropriate for your app
        }
        return new go.Point(r.x - (loc.x - bnds.x), r.y - (loc.y - bnds.y));
      }
      if (isUnoccupied(r, node as go.Node)) {
        return gridpt;
      } // OK
      return loc; // give up -- don't allow the node to be moved to the new location
    },

    // provide a visual warning about dropping anything onto an "item"
    mouseDragEnter: (e, node) => {
      e.handled = true;

      const nodePanel = node as go.Group | null;
      if (!nodePanel) return;

      const rectangle = nodePanel.findObject('SHAPE') as go.Shape | null;
      if (!rectangle) return;

      rectangle.fill = 'red';
      e.diagram.currentCursor = 'not-allowed';
      highlightGroup(nodePanel.containingGroup, false);
    },
    mouseDragLeave: (e, node) => (node as go.Group).updateTargetBindings(),
    // disallow dropping anything onto an "item"
    mouseDrop: (e, node) => {
      if (!node.diagram) return;
      node.diagram.currentTool.doCancel();
    },
  },
  // always save/load the point that is the top-left corner of the node, not the location
  new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(
    go.Point.stringify
  ),
  // this is the primary thing people see
  $(
    go.Shape,
    'Rectangle',
    {
      name: 'SHAPE',
      fill: 'white',
      minSize: cellSize,
      desiredSize: cellSize, // initially 1x1 cell
    },
    new go.Binding('fill', 'color'),
    new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
      go.Size.stringify
    )
  ),
  // with the textual key in the middle
  $(
    go.TextBlock,
    { alignment: go.Spot.Center, font: 'bold 16px sans-serif' },
    new go.Binding('text', 'key')
  )
); // end Node

function highlightGroup(grp: go.GraphObject | null, show: boolean) {
  if (!grp) return false;

  const group = grp as go.Group;

  // check that the drop may really happen into the Group
  const tool = grp.diagram?.toolManager.draggingTool;
  if (!tool) return false;

  group.isHighlighted = show && group.canAddMembers(tool.draggingParts);
  return group.isHighlighted;
}

const EditBoard = () => {
  const diagram = useRef<go.Diagram | null>(null);

  return (
    <div className="h-full border-2 border-slate-400">
      <div
        ref={(div) => {
          if (!div || !document) return;

          if (diagram.current) return;

          diagram.current = new go.Diagram('board-plan-diagram', {
            allowZoom: false,

            'undoManager.isEnabled': true,
            'resizingTool.isGridSnapEnabled': true,
            'draggingTool.gridSnapCellSpot': go.Spot.TopLeft,
            'draggingTool.isGridSnapEnabled': true,
            padding: 0,
            scrollMargin: 0,
            contentAlignment: go.Spot.Center,
          });

          diagram.current.grid = new go.Panel('Grid', {
            gridCellSize: cellSize,
            background: '#cbd5e1',
          }).add(
            new go.Shape('LineH', { stroke: '#64748b' }),
            new go.Shape('LineV', { stroke: '#64748b' })
          );

          diagram.current.groupTemplate = $(
            go.Group,
            {
              layerName: BACKGROUND_LAYER_NAME,
              resizable: true,
              movable: false,
              padding: 0,
              resizeObjectName: 'GRID',
            },
            // always save/load the point that is the top-left corner of the node, not the location
            new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(
              go.Point.stringify
            ),
            {
              // what to do when a drag-over or a drag-drop occurs on a Group
              mouseDragEnter: (e, grp) => {
                if (!highlightGroup(grp, true))
                  e.diagram.currentCursor = 'not-allowed';
                else e.diagram.currentCursor = '';
              },
              mouseDragLeave: (e, grp, next) => {
                return highlightGroup(grp, false);
              },
              mouseDrop: (e, grp) => {
                const group = grp as go.Group;

                if (!group.diagram?.selection) return;

                const ok = group.addMembers(group.diagram.selection, true);
                if (!ok) group.diagram.currentTool.doCancel();
              },
            },

            new go.Panel('Grid', {
              name: 'GRID',
              minSize: new go.Size(cellSize.width * 4, cellSize.height * 4),
              gridCellSize: cellSize,
              background: '#f8fafc',
            })
              .bindTwoWay(
                'desiredSize',
                'size',
                go.Size.parse,
                go.Size.stringify
              )
              .add(
                new go.Shape('LineH', { stroke: '#94a3b8' }),
                new go.Shape('LineV', { stroke: '#94a3b8' })
              ),
            new go.Shape('Rectangle', {
              fill: 'transparent',
              stroke: '#94a3b8',
              strokeWidth: 3,
            }).bindTwoWay(
              'desiredSize',
              'size',
              go.Size.parse,
              go.Size.stringify
            )
          );

          // start off with four "racks" that are positioned next to each other
          diagram.current.model = new go.GraphLinksModel([
            {
              key: FLOOR_CONTAINER_KEY,
              isGroup: true,
              pos: '0 0',
              size: '600 600',
            },
          ]);

          diagram.current.commandHandler.memberValidation = (grp, node) => {
            if (grp instanceof go.Group && node instanceof go.Group)
              return false; // cannot add Groups to Groups

            // but dropping a Group onto the background is always OK
            return true;
          };

          // what to do when a drag-drop occurs in the Diagram's background
          diagram.current.mouseDragOver = (e) => {
            if (!ALLOW_DROP_OUTSIDE_HIGHLIGHTED_AREA) {
              // OK to drop a group anywhere or any Node that is a member of a dragged Group
              var tool = e.diagram.toolManager.draggingTool;
              if (
                !tool.draggingParts.all(
                  (p) =>
                    p instanceof go.Group ||
                    (!p.isTopLevel &&
                      tool.draggingParts.has(p.containingGroup!))
                )
              ) {
                e.diagram.currentCursor = 'not-allowed';
              } else {
                e.diagram.currentCursor = '';
              }
            }
          };

          diagram.current.mouseDrop = (e) => {
            if (ALLOW_DROP_OUTSIDE_HIGHLIGHTED_AREA) {
              // when the selection is dropped in the diagram's background,
              // make sure the selected Parts no longer belong to any Group
              if (
                !e.diagram.commandHandler.addTopLevelParts(
                  e.diagram.selection,
                  true
                )
              ) {
                e.diagram.currentTool.doCancel();
              }
            } else {
              // disallow dropping any regular nodes onto the background, but allow dropping "racks",
              // including any selected member nodes
              if (
                !e.diagram.selection.all((p) => {
                  return (
                    p instanceof go.Group ||
                    (!p.isTopLevel && p.containingGroup!.isSelected)
                  );
                })
              ) {
                e.diagram.currentTool.doCancel();
              }
            }
          };

          diagram.current.nodeTemplate = draggableNode;

          // initialize the first Palette
          const palette = new go.Palette('palette', {
            // share the templates with the main Diagram
            nodeTemplate: diagram.current.nodeTemplate,
            groupTemplate: diagram.current.groupTemplate,
          });

          // specify the contents of the Palette
          palette.model = new go.GraphLinksModel([
            { key: 'default', color: '#a1a1aa' },
          ]);
        }}
        id="board-plan-diagram"
        className="h-full w-full rounded-lg bg-slate-100"
      ></div>
      <div id="palette" style={{ width: 140, height: 340 }}></div>
    </div>
  );
};

export default EditBoard;
