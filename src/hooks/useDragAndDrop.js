
import { useRef, useState } from "react";
import { isOverlapping, getOverlapPercentage } from "../utils/utils";

export const useDragAndDrop = (items, setItems) => {
  const draggingRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swappedItemId, setSwappedItemId] = useState(null);

  const handleMouseDown = (e, id) => {
    if (e.target.classList.contains("resize-handle") || e.target.tagName === "BUTTON") return;
    e.preventDefault();

    const item = items.find(i => i.id === id);
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - item.x;
    const offsetY = startY - item.y;

    const positions = Object.fromEntries(items.map(i => [i.id, { x: i.x, y: i.y }]));
    draggingRef.current = { id, offsetX, offsetY, startX, startY };
    setIsDragging(true);

    const handleMouseMove = (e) => {
      const newX = e.clientX - draggingRef.current.offsetX;
      const newY = e.clientY - draggingRef.current.offsetY;
      const moveDist = Math.sqrt(
        (e.clientX - draggingRef.current.startX) ** 2 + (e.clientY - draggingRef.current.startY) ** 2
      );

      setItems(prev => {
        const updated = prev.map(i => (i.id === id ? { ...i, x: newX, y: newY } : i));
        const dragged = updated.find(i => i.id === id);
        const overlaps = updated.filter(i => i.id !== id && isOverlapping(dragged, i));

        if (overlaps.length === 0 || moveDist < 10) return updated;

        const maxOverlap = overlaps.reduce(
          (max, item) => {
            const pct = getOverlapPercentage(dragged, item);
            return pct > max.pct ? { item, pct } : max;
          },
          { item: null, pct: 0 }
        );

        if (maxOverlap.item && maxOverlap.pct > 0.3 && swappedItemId !== maxOverlap.item.id) {
          setSwappedItemId(maxOverlap.item.id);
          return updated.map(i =>
            i.id === maxOverlap.item.id ? { ...i, x: positions[id].x, y: positions[id].y } : i
          );
        }

        setSwappedItemId(null);
        return updated;
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      setItems(prev => {
        const dragged = prev.find(i => i.id === id);
        const overlaps = prev.filter(i => i.id !== id && isOverlapping(dragged, i));

        if (overlaps.length === 0) return prev;

        const maxOverlap = overlaps.reduce(
          (max, item) => {
            const pct = getOverlapPercentage(dragged, item);
            return pct > max.pct ? { item, pct } : max;
          },
          { item: null, pct: 0 }
        );

        if (maxOverlap.item && maxOverlap.pct > 0.3) {
          return prev.map(i =>
            i.id === id ? { ...i, x: positions[maxOverlap.item.id].x, y: positions[maxOverlap.item.id].y } : i
          );
        }

        const bottomMost = prev.reduce(
          (lowest, curr) => (curr.id !== id && curr.y + curr.height > lowest.y + lowest.height ? curr : lowest),
          prev[0]
        );
        return prev.map(i =>
          i.id === id ? { ...i, x: dragged.x, y: bottomMost.y + bottomMost.height + 10 } : i
        );
      });

      draggingRef.current = null;
      setIsDragging(false);
      setSwappedItemId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return { handleMouseDown, isDragging, swappedItemId };
};