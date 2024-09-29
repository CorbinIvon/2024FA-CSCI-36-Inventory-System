export class InventoryNode {
  id: string;
  parentID?: string;
  data: Record<string, unknown> | null;
  parent?: InventoryNode;
  children?: InventoryNode[];

  constructor(id: string, parentID?: string, data: Record<string, unknown> | null = null) {
    this.id = id;
    this.parentID = parentID;
    this.data = data;
  }
}

export default InventoryNode;

// Given an array of nodes, map ids to node.
export function buildNodeMap(nodes: InventoryNode[]): Map<string, InventoryNode> {
  const map = new Map<string, InventoryNode>();
  for (const node of nodes) {
    // TODO: consider using WeakRefs to avoid holding 
    // onto nodes removed from the tree.
    map.set(node.id, node);
  }
  return map;
}

// Build links between parent and child nodes
export function linkNodes(nodes: InventoryNode[], map: Map<string, InventoryNode>): void {
  for (const node of nodes) {
    if (node.parentID) {
      // note target could be missing
      const parent = map.get(node.parentID);
      if (parent) {
        node.parent = parent;

        if (parent.children) {
          parent.children.push(node);
        } else {
          parent.children = [node];
        }
      } else {
        // TODO: warn of missing reference / orphaned node
      }
    }
  }
}

// Build links between nodes
export function buildLinks(nodes: InventoryNode[]): { parentID: string, childID: string }[] {
  const links: { parentID: string, childID: string }[] = [];
  for (const node of nodes) {
    const { parentID, id } = node;
    if (parentID) {
      links.push({ parentID, childID: id });
    }
  }
  return links;
}

// Flatten the tree into an array of nodes
export function flattenTree(tree: InventoryNode): InventoryNode[] {
  const nodes: InventoryNode[] = [];
  flattenTreeInner(tree, nodes);
  return nodes;
}

function flattenTreeInner(root: InventoryNode, nodes: InventoryNode[]): void {
  nodes.push(root);

  if (root.children) {
    for (const child of root.children) {
      flattenTreeInner(child, nodes);
    }
  }
}

// Return nodes that don't have a parent
export function getOrphans(nodes: InventoryNode[]): InventoryNode[] {
  const orphans: InventoryNode[] = [];

  for (const node of nodes) {
    if (node.parentID == null) {
      orphans.push(node);
    }
  }

  return orphans;
}

// Remove graph links from the node objects
export function unlink(nodes: InventoryNode[]): void {
  for (const node of nodes) {
    node.parent = undefined;
    node.children = undefined;
  }
}
