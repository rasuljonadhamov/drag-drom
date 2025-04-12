import { useRef } from "react";
import { isOverlapping } from "../utils/utils";


export const useResize = (items, setItems) => {
  const resizingRef = useRef(null);

  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    resizingRef.current = { id, startX, startY };

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - resizingRef.current.startX;
      const deltaY = e.clientY - resizingRef.current.startY;

      setItems(prev => {
        const resized = prev.find(i => i.id === id);
        const updatedItem = {
          ...resized,
          width: Math.max(200, resized.width + deltaX),
          height: Math.max(150, resized.height + deltaY),
        };

        const updated = prev.map(i => (i.id === id ? updatedItem : i));
        const overlaps = updated.filter(i => i.id !== id && isOverlapping(updatedItem, i));

        if (overlaps.length === 0) return updated;

        return updated.map(i =>
          i.id === id || !isOverlapping(updatedItem, i) ? i : { ...i, y: updatedItem.y + updatedItem.height + 10 }
        );
      });

      resizingRef.current.startX = e.clientX;
      resizingRef.current.startY = e.clientY;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      resizingRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return { handleResizeMouseDown };
};