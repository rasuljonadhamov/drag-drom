import React, { useState, useRef } from "react";
import ChartComponent from "../components/ChartComponent";

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const initialItems = [
  { id: '1', content: 'Invoice #001 - Client A', x: 0, y: 0, width: 300, height: 200, chartType: 'line', data: sampleData },
  { id: '2', content: 'Invoice #002 - Client B', x: 320, y: 0, width: 300, height: 200, chartType: 'bar', data: sampleData },
  { id: '3', content: 'Invoice #003 - Client C', x: 0, y: 220, width: 300, height: 200, chartType: 'sparkline', data: sampleData },
];

export default function Invoices() {
  const [items, setItems] = useState(initialItems);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const containerRef = useRef(null);
  const draggingRef = useRef(null);
  const resizingRef = useRef(null);

  const handleMouseDown = (e, id) => {
    if (e.target.classList.contains("resize-handle")) return;
    if (e.target.tagName === "BUTTON") return;

    const item = items.find(i => i.id === id);
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - item.x;
    const offsetY = startY - item.y;

    draggingRef.current = { id, offsetX, offsetY };

    const handleMouseMove = (e) => {
      const newX = e.clientX - draggingRef.current.offsetX;
      const newY = e.clientY - draggingRef.current.offsetY;

      setItems(prev => {
        const updated = prev.map(i =>
          i.id === id ? { ...i, x: newX, y: newY } : i
        );

        const movingItem = updated.find(i => i.id === id);
        const nextState = updated.map(i => {
          if (i.id === id) return i;
          const overlap =
            movingItem.x < i.x + i.width &&
            movingItem.x + movingItem.width > i.x &&
            movingItem.y < i.y + i.height &&
            movingItem.y + movingItem.height > i.y;

          if (overlap) {
            return { ...i, y: i.y + movingItem.height + 20 };
          }
          return i;
        });

        return nextState;
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      draggingRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    resizingRef.current = { id, startX, startY };

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - resizingRef.current.startX;
      const deltaY = e.clientY - resizingRef.current.startY;

      setItems(prev => {
        const resizedItem = prev.find(i => i.id === id);
        const updatedItem = {
          ...resizedItem,
          width: Math.max(200, resizedItem.width + deltaX),
          height: Math.max(150, resizedItem.height + deltaY)
        };

        const updated = prev.map(i =>
          i.id === id ? updatedItem : i
        );

        const nextState = updated.map(i => {
          if (i.id === id) return updatedItem;

          const overlap =
            updatedItem.x < i.x + i.width &&
            updatedItem.x + updatedItem.width > i.x &&
            updatedItem.y < i.y + i.height &&
            updatedItem.y + updatedItem.height > i.y;

          if (overlap) {
            return { ...i, y: i.y + updatedItem.height + 20 };
          }
          return i;
        });

        return nextState;
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

  const initiateCreateInvoice = () => {
    setShowChartSelector(true);
  };

  const createInvoice = (chartType) => {
    const newId = Date.now().toString();
    setItems(prev => [
      ...prev,
      {
        id: newId,
        content: `Invoice #${newId.slice(-4)} - New Client`,
        x: 50,
        y: 50,
        width: 300,
        height: 200,
        chartType: chartType,
        data: [...sampleData]
      }
    ]);
    setShowChartSelector(false);
  };

  const deleteInvoice = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const randomizeData = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          data: item.data.map(d => ({
            ...d,
            value: Math.floor(Math.random() * 1000)
          }))
        };
      }
      return item;
    }));
  };

  return (
    <>
    <div className="flex justify-between items-center mb-4 ">
      <h2 className="text-2xl font-semibold mb-4">Invoice Dashboard</h2>
        <button
          onClick={initiateCreateInvoice}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Add Invoice
        </button>
    </div>
    <div className="relative pt-4 w-full h-screen bg-gray-100 overflow-auto p-4 " ref={containerRef}>
      
      {showChartSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl mb-4">Select Chart Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => createInvoice('line')} 
                className="p-4 border rounded hover:bg-blue-50"
              >
                Line Chart
              </button>
              <button 
                onClick={() => createInvoice('bar')} 
                className="p-4 border rounded hover:bg-blue-50"
              >
                Bar Chart
              </button>
              <button 
                onClick={() => createInvoice('sparkline')} 
                className="p-4 border rounded hover:bg-blue-50"
              >
                Sparkline
              </button>
              <button 
                onClick={() => createInvoice('spiral')} 
                className="p-4 border rounded hover:bg-blue-50"
              >
                Spiral Chart
              </button>
            </div>
            <button 
              onClick={() => setShowChartSelector(false)} 
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
          className="absolute bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ top: item.y, left: item.x, width: item.width, height: item.height }}
        >
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <span className="font-medium">{item.content}</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => randomizeData(item.id)} 
                className="text-blue-600 hover:underline text-sm"
              >
                Refresh Data
              </button>
              <button 
                onClick={() => deleteInvoice(item.id)} 
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="p-4 h-full">
            <ChartComponent 
              chartType={item.chartType} 
              data={item.data} 
              width={item.width - 40} 
              height={item.height - 40} 
            />
          </div>
          <div
            className="resize-handle absolute bottom-1 right-1 w-4 h-4 bg-blue-500 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, item.id)}
          ></div>
        </div>
      ))}
    </div>
    </>
  );
}