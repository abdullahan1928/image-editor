import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import './App.css'

const App = () => {
  const [imageDataURL, setImageDataURL] = useState(null);
  const [croppedDataURL, setCroppedDataURL] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const cropRectRef = useRef(null);
  const drawingModeRef = useRef(false);

  useEffect(() => {
  }, []);

  const initializeFabricCanvas = (imageDataURL) => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: false,
    });

    canvas.setWidth(800); // Set the initial canvas width (adjust as needed)
    canvas.setHeight(600); // Set the initial canvas height (adjust as needed)

    // Initialize the image if available
    if (imageDataURL) {
      fabric.Image.fromURL(imageDataURL, (img) => {
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        imageRef.current = img;
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

  const addLine = () => {
    if (canvasRef.current) {
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: 'blue',
        strokeWidth: 2,
        selectable: true,
      });
      canvasRef.current.add(line);
    }
  };

  const addArrow = () => {
    if (canvasRef.current) {
      const arrow = new fabric.Line([50, 50, 200, 200], {
        stroke: 'green',
        strokeWidth: 2,
        selectable: true,
        hasControls: false, // Prevent resizing of arrows
        strokeLineCap: 'round', // Add arrowhead at the end
      });
      canvasRef.current.add(arrow);
    }
  };

  const addRectangle = () => {
    if (canvasRef.current) {
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: 'transparent',
        stroke: 'purple',
        strokeWidth: 2,
        selectable: true,
      });
      canvasRef.current.add(rect);
    }
  };

  const addText = () => {
    if (canvasRef.current) {
      const text = new fabric.IText('Your Text Here', {
        left: 50,
        top: 50,
        fill: 'orange',
        fontSize: 20,
        selectable: true,
      });
      canvasRef.current.add(text);
    }
  };

  const handleCropClick = () => {
    if (imageRef.current && cropRectRef.current) {
      const cropCoords = cropRectRef.current.getBoundingRect();
      const croppedDataUrl = canvasRef.current.toDataURL({
        format: 'png',
        left: cropCoords.left,
        top: cropCoords.top,
        width: cropCoords.width,
        height: cropCoords.height,
      });
      setCroppedDataURL(croppedDataUrl);
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
        <button onClick={addLine}>Add Line</button>
        <button onClick={addArrow}>Add Arrow</button>
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={addText}>Add Text</button>
      </div>
      {imageDataURL && (
        <div>
          <h2>Original Image:</h2>
          <img src={imageDataURL} alt="Original" />
          <button onClick={handleCropClick}>Crop</button>
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
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default App;
