import * as go from 'gojs';

export const findObjectsInNode = (node: go.Node, diagram: go.Diagram) => {
  const location = node.location;
  const dimensions = node.actualBounds;
  const rect = new go.Rect(
    location.x,
    location.y,
    dimensions.width,
    dimensions.height
  );

  const intersectionsPerLayer: Record<string, go.GraphObject[]> = {};
  const layersIterator = diagram.layers;
  while (layersIterator.next()) {
    const layer = layersIterator.value;

    intersectionsPerLayer[layer.name || 'default'] = layer
      .findObjectsIn(
        rect,
        (obj) => obj,
        () => true,
        false
      )
      .toArray();
  }

  return intersectionsPerLayer;
};
