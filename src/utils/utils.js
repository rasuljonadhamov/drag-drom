
export const isOverlapping = (item1, item2) => {
    return (
      item1.x < item2.x + item2.width &&
      item1.x + item1.width > item2.x &&
      item1.y < item2.y + item2.height &&
      item1.y + item1.height > item2.y
    );
  };
  
  export const getOverlapPercentage = (item1, item2) => {
    const overlapX = Math.min(item1.x + item1.width, item2.x + item2.width) - Math.max(item1.x, item2.x);
    const overlapY = Math.min(item1.y + item1.height, item2.y + item2.height) - Math.max(item1.y, item2.y);
    if (overlapX <= 0 || overlapY <= 0) return 0;
    const overlapArea = overlapX * overlapY;
    const area1 = item1.width * item1.height;
    const area2 = item2.width * item2.height;
    return overlapArea / Math.min(area1, area2);
  };
  
  export const findNonOverlappingPosition = (items, newItem, maxY = 1000) => {
    let { x, y } = newItem;
    while (items.some(item => isOverlapping({ ...newItem, x, y }, item))) {
      y += 220;
      if (y > maxY && items.length > 0) {
        const rightmost = items.reduce((max, item) => Math.max(max, item.x + item.width), 0);
        x = rightmost + 20;
        y = 50;
      }
    }
    return { x, y };
  };