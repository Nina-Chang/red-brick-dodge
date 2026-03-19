import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHit, setIsHit] = useState(false);
  // 紅磚塊內部「實心紅色」的區域清單 (相對座標)
  const BRICK_SUB_RECTS = [
    { x: 50,  y: 0,  w: 33, h: 225 }, // 左邊長條
    { x: 85, y: 0, w: 33, h: 180  }, // 中間橫條
    { x: 120, y: 0,  w: 33, h: 120 },  // 右邊長條
  ];
    
  const cursorRef = useRef(null);
  const brickRef = useRef(null);
  const birdRef = useRef(null);

  // 1. 處理滑鼠座標（僅用於移動鳥圖片，不參與碰撞運算）
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const checkBirdEdges = () => {
      if (!birdRef.current) return;

      // 1. 取得鳥在螢幕上的位置
      const b = birdRef.current.getBoundingClientRect();
      const p = 15; // 內縮一點點，避免透明邊緣誤判

      // 2. 定義要偵測的點 (四個角 + 中心)
      const points = [
        { x: b.left + p, y: b.top + p },     // 左上
        { x: b.right - p, y: b.top + p },    // 右上
        { x: b.left + p, y: b.bottom - p },  // 左下
        { x: b.right - p, y: b.bottom - p }, // 右下
        { x: b.left + b.width/2, y: b.top+ p }, // 上
        { x: b.left + b.width/2, y: b.bottom- p }, // 下
        { x: b.left + p, y: b.top + b.height/2 }, // 左
        { x: b.right- p , y: b.top + b.height/2 }, // 右
        // { x: b.left + b.width/2, y: b.top + b.height/2 } // 中心
      ];

      // 3. 檢查這些點位下方是否有「紅磚感應區」
      const isOverlapping = points.some(pt => {
        const elements = document.elementsFromPoint(pt.x, pt.y);
        return elements.some(el => el.classList.contains('hit-zone'));
      });

      setIsHit(isOverlapping);
    };

    const timer = setInterval(checkBirdEdges, 30); // 每 30ms 檢查一次
    return () => clearInterval(timer);
  }, []);


  return (
    <div style={{ width: '100vw', height: '100vh', overflow: "hidden" }} onMouseMove={handleMouseMove}>
      
      {BRICK_SUB_RECTS.map((rect, index) => (
        <div
          key={index}
          className="hit-zone"
          onMouseEnter={() => setIsHit(true)}  // 進入感應區
          onMouseLeave={() => setIsHit(false)} // 離開感應區
          style={{
            position: 'absolute',
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
            backgroundColor: 'rgba(116, 69, 198, 0.3)', // 設為透明，開發時可設為 rgba(116, 69, 198, 0.3) 觀察
            cursor: 'none',
            zIndex: 10
          }}
        />
        ))}

      {/* 1. 多矩形紅磚塊圖片 */}
      <img 
        ref={brickRef}
        src="./image/brick_red.png" 
        style={{ position: 'absolute', left: '50px', top: '0' ,height:'100vh'}}
        alt="brick"
      />


      {/* 2. 跟隨滑鼠的圖片 */}
      <img 
        ref={birdRef}
        src={isHit ? "./image/bird_hit.png" : "./image/bird_normal.png"} // 碰到就換圖
        style={{ 
          width:isHit ?"120px":"150px",
          position: 'absolute', 
          left: mousePos.x, 
          top: mousePos.y,
          transform: 'translate(-50%, -50%)', // 讓滑鼠在圖片中心
          pointerEvents: 'none' // 確保滑鼠事件穿透到背景
        }}
        alt="bird.png"
      />
    </div>
  );
};

export default App;