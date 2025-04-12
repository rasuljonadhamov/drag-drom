import ChartComponent from "./ChartComponent";

export default function InvoiceCard({
    item,
    onMouseDown,
    onResizeMouseDown,
    onDelete,
    onRandomize,
    isDragging,
    isSwapped,
  }) {
    return (
      <div
        onMouseDown={onMouseDown}
        className={`absolute bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-150 ${
          isDragging ? "shadow-xl ring-2 ring-blue-500 z-20" : isSwapped ? "shadow-lg ring-2 ring-green-500 z-10" : "z-10"
        }`}
        style={{ top: item.y, left: item.x, width: item.width, height: item.height }}
      >
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <span className="font-medium">{item.content}</span>
          <div className="flex space-x-2">
            <button onClick={onRandomize} className="text-blue-600 hover:underline text-sm">
              Refresh Data
            </button>
            <button onClick={onDelete} className="text-red-600 hover:underline text-sm">
              Delete
            </button>
          </div>
        </div>
        <div className="p-4 h-full">
          <ChartComponent chartType={item.chartType} data={item.data} width={item.width - 40} height={item.height - 40} />
        </div>
        <div
          className="resize-handle absolute bottom-1 right-1 w-4 h-4 bg-blue-500 cursor-se-resize"
          onMouseDown={onResizeMouseDown}
        />
      </div>
    );
  }