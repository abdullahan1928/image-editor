import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Rect, Text, Line, Arrow } from 'react-konva';

const App = () => {
    const [imageDataURL, setImageDataURL] = useState(null);
    const [croppedDataURL, setCroppedDataURL] = useState(null);
    const [selectedTool, setSelectedTool] = useState('crop');
    const [drawColor, setDrawColor] = useState('red');
    const stageRef = useRef(null);
    const layerRef = useRef(null);
    const cropRectRef = useRef(null);

    const handleImageInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const imageDataURL = reader.result;
                setImageDataURL(imageDataURL);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleStageClick = (e) => {
        if (selectedTool === 'crop') {
            // Set cropping rectangle coordinates
            const x = e.evt.layerX;
            const y = e.evt.layerY;
            cropRectRef.current = { x, y, width: 100, height: 100 };
            stageRef.current.batchDraw(); // Redraw the stage to display the cropping rectangle
        } else if (selectedTool === 'line' || selectedTool === 'arrow') {
            // Handle drawing lines and arrows
            const line = new (selectedTool === 'arrow' ? Arrow : Line)({
                points: [0, 0, e.evt.layerX, e.evt.layerY],
                stroke: drawColor,
                strokeWidth: 2,
                draggable: true,
            });

            layerRef.current.add(line);
            stageRef.current.batchDraw();
        } else if (selectedTool === 'rectangle') {
            // Handle drawing rectangles
            const rect = new Rect({
                x: e.evt.layerX,
                y: e.evt.layerY,
                width: 100,
                height: 100,
                fill: 'transparent',
                stroke: drawColor,
                strokeWidth: 2,
                draggable: true,
            });

            layerRef.current.add(rect);
            stageRef.current.batchDraw();
        } else if (selectedTool === 'text') {
            // Handle adding text
            const text = new Text({
                x: e.evt.layerX,
                y: e.evt.layerY,
                text: 'Your Text Here',
                fill: drawColor,
                fontSize: 20,
                draggable: true,
            });

            layerRef.current.add(text);
            stageRef.current.batchDraw();
        }
    };

    const handleCropClick = () => {
        if (cropRectRef.current) {
            const stage = stageRef.current;

            // Create a temporary canvas to crop the image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = cropRectRef.current.width;
            tempCanvas.height = cropRectRef.current.height;
            const tempContext = tempCanvas.getContext('2d');

            // Draw the image data to the temp canvas
            const image = new window.Image();
            image.src = imageDataURL;
            tempContext.drawImage(image, cropRectRef.current.x, cropRectRef.current.y, cropRectRef.current.width, cropRectRef.current.height, 0, 0, cropRectRef.current.width, cropRectRef.current.height);


            // Get the image data from the stage
            const stageCanvas = stage.toCanvas();
            const stageContext = stageCanvas.getContext('2d');
            stageContext.drawImage(stageCanvas, cropRectRef.current.x, cropRectRef.current.y, cropRectRef.current.width, cropRectRef.current.height, 0, 0, cropRectRef.current.width, cropRectRef.current.height);

            // Set the cropped data URL
            setCroppedDataURL(tempCanvas.toDataURL());
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
                <button onClick={() => setSelectedTool('crop')}>Crop</button>
                <button onClick={() => setSelectedTool('line')}>Add Line</button>
                <button onClick={() => setSelectedTool('arrow')}>Add Arrow</button>
                <button onClick={() => setSelectedTool('rectangle')}>Add Rectangle</button>
                <button onClick={() => setSelectedTool('text')}>Add Text</button>
                <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                />
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
            <Stage
                ref={stageRef}
                width={800} // Set the initial canvas width (adjust as needed)
                height={600} // Set the initial canvas height (adjust as needed)
                onClick={handleStageClick}
            >
                <Layer ref={layerRef}>
                    {cropRectRef.current && (
                        <Rect
                            x={cropRectRef.current.x}
                            y={cropRectRef.current.y}
                            width={cropRectRef.current.width}
                            height={cropRectRef.current.height}
                            fill="transparent"
                            stroke="red"
                            strokeWidth={2}
                            draggable
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
};

export default App;
