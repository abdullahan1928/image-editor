import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [imageDataURL, setImageDataURL] = useState(null);
  const [croppedDataURL, setCroppedDataURL] = useState(null);
  const imageRef = useRef(null);
  const cropRectRef = useRef(null);
  const drawingModeRef = useRef(false);

  useEffect(() => {
    canvasRef.current = initCanvas();

    return () => canvasRef.current.dispose();
  }, []);

  const initCanvas = () => (
    new fabric.Canvas(`canvas`, {
      width: 800,
      height: 600,
    })
  );

  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case 'line':
        shape = new fabric.Line([50, 50, 100, 100], { stroke: 'red' });
        break;
      case 'arrow':
        shape = new fabric.Path('M 0 0 L 20 20 L 0 40 L 10 20 z');
        break;
      case 'rectangle':
        shape = new fabric.Rect({ width: 60, height: 70, fill: 'green', left: 100, top: 100 });
        break;
      case 'text':
        shape = new fabric.IText('Hello World', { left: 100, top: 100 });
        break;
      default:
        return;
    }

    const canvas = canvasRef.current;
    if (imageRef.current) {
      const imagePosition = imageRef.current.getBoundingRect();
      const offsetX = imagePosition.left;
      const offsetY = imagePosition.top;
      shape.set({
        left: shape.left + offsetX,
        top: shape.top + offsetY,
      });
    }

    canvas.add(shape);
    canvas.renderAll();
  };

  const initializeFabricCanvas = (imageDataURL) => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: false,
    });

    canvas.setWidth(800); // Set the initial canvas width (adjust as needed)
    canvas.setHeight(600); // Set the initial canvas height (adjust as needed)

    // Initialize the image if available
    if (imageDataURL) {
      fabric.Image.fromURL(imageDataURL, (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        imageRef.current = img;
        canvas.renderAll();
      });
    }

    // Create an initial cropping rectangle
    cropRectRef.current = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
      selectable: true,
    });

    // Make the cropping rectangle resizable
    cropRectRef.current.setControlsVisibility({
      mt: true,
      mb: true,
      ml: true,
      mr: true,
      bl: true,
      br: true,
      tl: true,
      tr: true,
    });

    canvas.add(cropRectRef.current);

    // Set drawing mode
    canvas.isDrawingMode = drawingModeRef.current;
    canvas.freeDrawingBrush.color = 'red'; // Set default drawing color
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageDataURL = reader.result;
        setImageDataURL(imageDataURL);
        initializeFabricCanvas(imageDataURL);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    if (croppedDataURL) {
      // Create a download link to save the cropped image
      const link = document.createElement('a');
      link.href = croppedDataURL;
      link.download = 'cropped-image.png';
      link.click();
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageInputChange} />
      <div>
        <h2>Tools:</h2>
        <button onClick={() => addShape('line')}>Add Line</button>
        <button onClick={() => addShape('arrow')}>Add Arrow</button>
        <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
        <button onClick={() => addShape('text')}>Add Text</button>
      </div>
      {imageDataURL && (
        <div>
          <h2>Original Image:</h2>
          <img src={imageDataURL} alt="Original" />
          {/* <button onClick={handleCropClick}>Crop</button> */}
        </div>
      )}
      {croppedDataURL && (
        <div>
          <h2>Cropped Image:</h2>
          <img src={croppedDataURL} alt="Cropped" />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      )}
      <div>
        <canvas id="canvas">
        </canvas>
      </div>
      <div>
      </div>
    </div >
  );
}

export default CanvasComponent;