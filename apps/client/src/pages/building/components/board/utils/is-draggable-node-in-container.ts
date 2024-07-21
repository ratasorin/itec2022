import { FLOOR_CONTAINER_KEY } from '../constants';
import * as go from 'gojs';
import { findObjectsInNode } from './find-objects-in-node';

export const isDraggableNodeInContainer = (
  node: go.GraphObject,
  diagram: go.Diagram
) => {
  const floorContainer = diagram.findNodeForKey(FLOOR_CONTAINER_KEY);
  if (!floorContainer) {
    console.error('CANNOT FIND FLOOR PLANNER!');
    return false;
  }

  const objects = findObjectsInNode(floorContainer, diagram);

  return (
    !!objects['Tool'].find((n) => n === node) ||
    !!objects['default'].find((n) => n === node)
  );
};
