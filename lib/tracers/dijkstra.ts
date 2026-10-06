export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export interface InputType {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: string;
}

export interface PQItem {
  nodeId: string;
  distance: number;
}

export interface State {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  visited: Record<string, boolean>;
  pq: PQItem[];
  currentNode: string | null;
  currentNeighbor: string | null;
}

export interface Step {
  stepId: number;
  narrative: string;
  phase: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: State;
}

export const PSEUDOCODE = [
  "function Dijkstra(Graph, source):",
  "    distances = {}, previous = {}, pq = PriorityQueue()",
  "    distances[source] = 0",
  "    pq.enqueue(source, 0)",
  "    while pq is not empty:",
  "        u = pq.dequeue_min()",
  "        if visited[u] continue",
  "        visited[u] = true",
  "        for each neighbor v of u:",
  "            alt = distances[u] + weight(u, v)",
  "            if alt < distances[v]:",
  "                distances[v] = alt",
  "                previous[v] = u",
  "                pq.enqueue(v, alt)",
  "    return distances, previous"
];

export function generateTraces(input: InputType): Step[] {
  const steps: Step[] = [];
  let stepId = 0;

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: State
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      // Strictly clone memory to avoid mutation bugs during playback
      memory: { ...memory },
      // Deep freeze the state explicitly mapping array elements and records
      state: {
        distances: { ...currentState.distances },
        previous: { ...currentState.previous },
        visited: { ...currentState.visited },
        pq: currentState.pq.map(item => ({ ...item })),
        currentNode: currentState.currentNode,
        currentNeighbor: currentState.currentNeighbor,
      }
    });
  };

  const state: State = {
    distances: {},
    previous: {},
    visited: {},
    pq: [],
    currentNode: null,
    currentNeighbor: null,
  };

  input.nodes.forEach(node => {
    state.distances[node.id] = Infinity;
    state.previous[node.id] = null;
  });

  const memory: Record<string, string | number> = { source: input.startNode };

  snap("Initialization", "Khởi tạo mảng khoảng cách với vô cực, thêm đỉnh bắt đầu vào hàng đợi ưu tiên.", 2, memory, state);

  state.distances[input.startNode] = 0;
  snap("Set source distance", "Gán khoảng cách đỉnh nguồn = 0.", 3, memory, state);

  state.pq.push({ nodeId: input.startNode, distance: 0 });
  snap("Enqueue source", "Đẩy đỉnh nguồn vào PQ.", 4, memory, state);

  while (state.pq.length > 0) {
    snap("Check Priority Queue", "Check Priority Queue", 5, memory, state);
    
    // Sort to simulate Priority Queue minimum extraction
    state.pq.sort((a, b) => a.distance - b.distance);
    const curr = state.pq.shift()!;
    state.currentNode = curr.nodeId;
    memory['u'] = curr.nodeId;
    memory['u_dist'] = curr.distance;
    
    snap("Dequeue min node", "Dequeue min node", 6, memory, state);

    snap("Check if visited", "Check if visited", 7, memory, state);
    if (state.visited[curr.nodeId]) {
      continue;
    }

    state.visited[curr.nodeId] = true;
    snap("Mark visited", "Mark visited", 8, memory, state);

    // Get outgoing neighbors
    const neighbors = input.edges.filter(e => e.from === curr.nodeId);
    
    for (const edge of neighbors) {
      const v = edge.to;
      state.currentNeighbor = v;
      memory['v'] = v;
      memory['weight'] = edge.weight;
      snap("Examine neighbor", "Examine neighbor", 9, memory, state);

      const alt = state.distances[curr.nodeId] + edge.weight;
      memory['alt'] = alt;
      snap("Calculate alternate path length", "Calculate alternate path length", 10, memory, state);

      snap("Compare with current distance", "Compare with current distance", 11, memory, state);
      if (alt < state.distances[v]) {
        state.distances[v] = alt;
        snap("Update distance", "Update distance", 12, memory, state);

        state.previous[v] = curr.nodeId;
        snap("Update previous pointer", "Update previous pointer", 13, memory, state);

        state.pq.push({ nodeId: v, distance: alt });
        snap("Enqueue updated neighbor", "Enqueue updated neighbor", 14, memory, state);
      }
    }
    
    // Cleanup temporary loop variables
    state.currentNeighbor = null;
    delete memory['v'];
    delete memory['weight'];
    delete memory['alt'];
  }
  
  state.currentNode = null;
  delete memory['u'];
  delete memory['u_dist'];
  
  snap("Algorithm complete", "Algorithm complete", 15, memory, state);

  return steps;
}
