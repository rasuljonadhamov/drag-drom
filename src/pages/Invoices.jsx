import { useRef, useState } from "react";
import ChartSelectorModal from "../components/ChartSelectorModal";
import InvoiceCard from "../components/InvoiceCard";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useResize } from "../hooks/useResize";
import { findNonOverlappingPosition } from "../utils/utils";


const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];

const initialItems = [
  { id: "1", content: "Invoice #001 - Client A", x: 0, y: 0, width: 300, height: 200, chartType: "line", data: sampleData },
  { id: "2", content: "Invoice #002 - Client B", x: 320, y: 0, width: 300, height: 200, chartType: "bar", data: sampleData },
  { id: "3", content: "Invoice #003 - Client C", x: 0, y: 220, width: 300, height: 200, chartType: "sparkline", data: sampleData },
];

export default function Invoices() {
  const [items, setItems] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const { handleMouseDown, isDragging, swappedItemId } = useDragAndDrop(items, setItems);
  const { handleResizeMouseDown } = useResize(items, setItems);
  const draggingRef = useRef(null);

  const createInvoice = (chartType) => {
    const newId = Date.now().toString();
    const newItem = {
      id: newId,
      content: `Invoice #${newId.slice(-4)} - New Client`,
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      chartType,
      data: sampleData.map(d => ({ ...d })),
    };
    setItems(prev => {
      const { x, y } = findNonOverlappingPosition(prev, newItem);
      return [...prev, { ...newItem, x, y }];
    });
    setShowModal(false);
  };

  const deleteInvoice = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const randomizeData = (id) =>
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, data: i.data.map(d => ({ ...d, value: Math.floor(Math.random() * 1000) })) } : i
      )
    );

  const swapFirstTwo = () =>
    setItems(prev => {
      if (prev.length < 2) return prev;
      const [first, second, ...rest] = prev;
      return [{ ...first, x: second.x, y: second.y }, { ...second, x: first.x, y: first.y }, ...rest];
    });

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Invoice Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Add Invoice
          </button>
          {items.length >= 2 && (
            <button
              onClick={swapFirstTwo}
              className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
            >
              Swap First Two
            </button>
          )}
        </div>
      </div>
      <div className="relative pt-4 w-full h-screen bg-gray-100 overflow-auto p-4">
        {items.map(item => (
          <InvoiceCard
            key={item.id}
            item={item}
            onMouseDown={e => handleMouseDown(e, item.id)}
            onResizeMouseDown={e => handleResizeMouseDown(e, item.id)}
            onDelete={() => deleteInvoice(item.id)}
            onRandomize={() => randomizeData(item.id)}
            isDragging={isDragging && item.id === draggingRef.current?.id}
            isSwapped={item.id === swappedItemId}
          />
        ))}
      </div>
      {showModal && <ChartSelectorModal onSelect={createInvoice} onClose={() => setShowModal(false)} />}
    </>
  );
}