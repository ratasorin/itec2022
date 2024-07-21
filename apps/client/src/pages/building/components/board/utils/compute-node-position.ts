import * as go from 'gojs';

export const computeNodePosition = (node: go.GraphObject) => {
  const diagram = node.diagram;
  if (!diagram) return { x: null, y: null };

  const nodeLocation_doc = (node as go.Node).location; // in document coordinates

  if (!nodeLocation_doc) return { x: null, y: null };
  const nodeLocation_viewport = diagram.transformDocToView(nodeLocation_doc); // in viewport coordinates

  if (!diagram.div) return { x: null, y: null };

  console.log({ nodeLocation_viewport });

  const left = diagram.div.offsetLeft;
  const top = diagram.div.offsetTop;

  return {
    y: nodeLocation_viewport.y + top - node.actualBounds.height / 2,
    x: nodeLocation_viewport.x + left - node.actualBounds.width / 2,
  };
};
