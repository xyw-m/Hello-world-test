export function recursionExpand(node) {
  node.expanded = true;
  if (node.parent) {
    recursionExpand(node.parent);
  }
}
