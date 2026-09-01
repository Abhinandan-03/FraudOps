/**
 * Centralized logic for calculating the Final Network Score
 * based on Entity Graph evidence.
 */
export function calculateNetworkScore(entityGraph) {
  if (!entityGraph || !Array.isArray(entityGraph.nodes)) {
    return 0;
  }

  let score = 0;

  // Process nodes safely
  entityGraph.nodes.forEach(node => {
    if (!node || !node.id) return;
    
    const id = String(node.id).toUpperCase();
    
    if (id === 'TARGET') {
      // Base node, no extra score
    } else if (id.includes('VPN') || id.includes('TOR') || id.includes('PROXY')) {
      score += 40;
    } else if (id.includes('DEV')) {
      score += 25;
    } else if (id.includes('ACT') || id.includes('ACCOUNT')) {
      score += 15;
    } else if (id.includes('IP')) {
      score += 10;
    }
  });

  // Process edges safely
  if (Array.isArray(entityGraph.edges)) {
    entityGraph.edges.forEach(edge => {
      if (!edge) return;
      if (edge.dashed) {
        score += 20; // Suspicious or inferred relationship
      } else {
        score += 5; // Direct confirmed relationship
      }
    });
  }

  // Ensure strict numeric type and clamp 0-100
  const numericScore = Number(score);
  if (Number.isNaN(numericScore)) {
    return 0;
  }
  
  return Math.min(Math.max(numericScore, 0), 100);
}
