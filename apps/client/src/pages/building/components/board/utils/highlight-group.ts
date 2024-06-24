import * as go from 'gojs';

export const highlightGroup = (grp: go.GraphObject | null, show: boolean) => {
  if (!grp) return false;

  const group = grp as go.Group;

  // check that the drop may really happen into the Group
  const tool = grp.diagram?.toolManager.draggingTool;
  if (!tool) return false;

  group.isHighlighted = show && group.canAddMembers(tool.draggingParts);
  return group.isHighlighted;
};
