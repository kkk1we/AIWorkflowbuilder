import { blockRegistry } from "../../blocks";
import { emitStatusUpdate } from "../../../events/emitters";

export async function executeDAG(nodes, edges, initialInput, context) {
  const visited = new Set();
  const resultMap = {};

  async function runNode(nodeId) {
    if (visited.has(nodeId)) return resultMap[nodeId];

    const node = nodes.find(n => n.id === nodeId);
    const inputEdges = edges.filter(e => e.to === nodeId);

    const input = {};
    for (const edge of inputEdges) {
      const fromOutput = await runNode(edge.from);
      input[edge.input || "input"] = fromOutput[edge.output || "output"];
    }

    const block = blockRegistry[node.type];
    emitStatusUpdate(nodeId, "running", input);
    const result = await block.run(input, node.config, context);
    resultMap[nodeId] = result;
    emitStatusUpdate(nodeId, "completed", result);
    visited.add(nodeId);
    return result;
  }

  const startNodes = nodes.filter(n => edges.every(e => e.to !== n.id));
  for (const node of startNodes) await runNode(node.id);
  return resultMap;
}
