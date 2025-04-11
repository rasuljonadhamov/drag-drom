import { useEffect, useRef } from "react";

const SpiralChart = ({ data, width, height }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const maxValue = Math.max(...data.map(d => d.value));
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    data.forEach((point, i) => {
      const angle = i * 0.5 * Math.PI;
      const radius = (maxRadius * point.value / maxValue) * (i / data.length);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 5);
      circle.setAttribute("fill", "#3b82f6");
      
      if (i > 0) {
        const prevAngle = (i - 1) * 0.5 * Math.PI;
        const prevRadius = (maxRadius * data[i-1].value / maxValue) * ((i-1) / data.length);
        const prevX = centerX + prevRadius * Math.cos(prevAngle);
        const prevY = centerY + prevRadius * Math.sin(prevAngle);
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", prevX);
        line.setAttribute("y1", prevY);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#3b82f6");
        line.setAttribute("stroke-width", 2);
        
        svg.appendChild(line);
      }
      
      svg.appendChild(circle);
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y - 10);
      text.setAttribute("font-size", "8px");
      text.setAttribute("text-anchor", "middle");
      text.textContent = point.name;
      svg.appendChild(text);
    });
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible"></svg>
  );
};

export default SpiralChart;