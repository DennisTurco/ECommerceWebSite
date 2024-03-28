document.addEventListener('DOMContentLoaded', () => {
    const fontFamilySelect = document.getElementById('font-family');
    const uploadImageInput = document.getElementById('upload-image');
    const canvas = document.getElementById('phone-canvas');
    const ctx = canvas.getContext('2d');

    let phoneImage = new Image();
    phoneImage.src = 'default-cover.jpg';
    phoneImage.onload = () => {
        drawElements();
    };

    let coverText = 'Testo di esempio';
    let font = 'Arial';
    let isDragging = false;
    let dragType = ''; // 'text' o 'image'
    let offsetX, offsetY;
    let textX = canvas.width / 2;
    let textY = canvas.height / 2;
    let imageX = 0;
    let imageY = 0;
    let imageWidth = canvas.width;
    let imageHeight = canvas.height;
    let isResizing = false;
    let resizeType = ''; // 'nw', 'ne', 'sw', 'se'

    const drawElements = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        ctx.save();
        ctx.translate(imageX + imageWidth / 2, imageY + imageHeight / 2);
        ctx.rotate(rotationAngle * Math.PI / 180);
        ctx.translate(-(imageX + imageWidth / 2), -(imageY + imageHeight / 2));
    
        ctx.drawImage(phoneImage, imageX, imageY, imageWidth, imageHeight);
    
        ctx.restore();
        
        // bordo attorno all'immagine
        //ctx.strokeStyle = 'dashed';
        //ctx.strokeRect(imageX, imageY, imageWidth, imageHeight);
    
        ctx.font = `24px ${font}`;
        ctx.fillStyle = 'black';
        ctx.fillText(coverText, textX, textY);  // Il testo viene disegnato alla posizione textX, textY
    };  

    fontFamilySelect.addEventListener('change', () => {
        font = fontFamilySelect.value;
        drawElements();
    });

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            phoneImage.src = e.target.result;
            phoneImage.onload = () => {
                drawElements();
            };
        };

        reader.readAsDataURL(file);
    });

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = coverText;
    textInput.addEventListener('input', () => {
        coverText = textInput.value;
        drawElements();
    });
    textInput.addEventListener('mousedown', (e) => {
        e.stopPropagation();  // Evita la propagazione dell'evento mousedown al canvas
    });
    document.body.appendChild(textInput);

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const textMetrics = ctx.measureText(coverText);
        const textWidth = textMetrics.width;
        const textHeight = 24;

        const textLeft = textX - textWidth / 2;
        const textRight = textX + textWidth / 2;
        const textTop = textY - textHeight / 2;
        const textBottom = textY + textHeight / 2;

        if (x >= textLeft && x <= textRight && y >= textTop && y <= textBottom) {
            isDragging = true;
            dragType = 'text';
            offsetX = x - textX;
            offsetY = y - textY;
        } else if (x >= imageX && x <= imageX + imageWidth && y >= imageY && y <= imageY + imageHeight) {
            isDragging = true;
            dragType = 'image';

            const resizeMargin = 10;
            if (x < imageX + resizeMargin) {
                if (y < imageY + resizeMargin) {
                    resizeType = 'nw';
                } else if (y > imageY + imageHeight - resizeMargin) {
                    resizeType = 'sw';
                } else {
                    resizeType = 'w';
                }
            } else if (x > imageX + imageWidth - resizeMargin) {
                if (y < imageY + resizeMargin) {
                    resizeType = 'ne';
                } else if (y > imageY + imageHeight - resizeMargin) {
                    resizeType = 'se';
                } else {
                    resizeType = 'e';
                }
            } else if (y < imageY + resizeMargin) {
                resizeType = 'n';
            } else if (y > imageY + imageHeight - resizeMargin) {
                resizeType = 's';
            } else {
                resizeType = '';
            }

            offsetX = x - imageX;
            offsetY = y - imageY;

            if (resizeType) {
                isResizing = true;
            }
        }
    });

    let rotationAngle = 0; // Angolo di rotazione in gradi

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulizia del canvas
    
        canvas.style.cursor = 'default';
    
        const textMetrics = ctx.measureText(coverText);
        const textWidth = textMetrics.width;
        const textHeight = 24;
    
        const textLeft = textX - textWidth / 2;
        const textRight = textX + textWidth / 2;
        const textTop = textY - textHeight / 2;
        const textBottom = textY + textHeight / 2;
    
        const isInsideText = x >= textLeft && x <= textRight && y >= textTop && y <= textBottom;
        const isInsideImage = x >= imageX && x <= imageX + imageWidth && y >= imageY && y <= imageY + imageHeight;


        if (isInsideText) {
            canvas.style.cursor = 'move';
            ctx.setLineDash([5, 5]); // Imposta la linea tratteggiata
            ctx.strokeStyle = 'black';
            ctx.strokeText(coverText, textX, textY); // Disegna il contorno tratteggiato attorno al testo
        } 
        else if (isInsideImage) {
            canvas.style.cursor = 'move';
            ctx.setLineDash([5, 5]); // Imposta la linea tratteggiata
            ctx.strokeStyle = 'black';
            ctx.strokeRect(imageX, imageY, imageWidth, imageHeight); // Disegna il rettangolo tratteggiato attorno all'immagine
        } else {
            ctx.setLineDash([]); // Ripristina il tratto solido
        }
    
        ctx.drawImage(phoneImage, imageX, imageY, imageWidth, imageHeight); // Disegna l'immagine sul canvas
    
        ctx.font = `24px ${font}`;
        ctx.fillStyle = 'black';
        ctx.fillText(coverText, textX, textY);  // Il testo viene disegnato alla posizione textX, textY
    
        const resizeMargin = 10;
        if (x >= imageX - resizeMargin && x <= imageX + resizeMargin && y >= imageY - resizeMargin && y <= imageY + resizeMargin) {
            canvas.style.cursor = 'nw-resize';
        } else if (x >= imageX + imageWidth - resizeMargin && x <= imageX + imageWidth + resizeMargin && y >= imageY - resizeMargin && y <= imageY + resizeMargin) {
            canvas.style.cursor = 'ne-resize';
        } else if (x >= imageX - resizeMargin && x <= imageX + resizeMargin && y >= imageY + imageHeight - resizeMargin && y <= imageY + imageHeight + resizeMargin) {
            canvas.style.cursor = 'sw-resize';
        } else if (x >= imageX + imageWidth - resizeMargin && x <= imageX + imageWidth + resizeMargin && y >= imageY + imageHeight - resizeMargin && y <= imageY + imageHeight + resizeMargin) {
            canvas.style.cursor = 'se-resize';
        } else if (x >= imageX + resizeMargin && x <= imageX + imageWidth - resizeMargin && y >= imageY - resizeMargin && y <= imageY + resizeMargin) {
            canvas.style.cursor = 'n-resize';
        } else if (x >= imageX + resizeMargin && x <= imageX + imageWidth - resizeMargin && y >= imageY + imageHeight - resizeMargin && y <= imageY + imageHeight + resizeMargin) {
            canvas.style.cursor = 's-resize';
        } else if (x >= imageX - resizeMargin && x <= imageX + resizeMargin && y >= imageY + resizeMargin && y <= imageY + imageHeight - resizeMargin) {
            canvas.style.cursor = 'w-resize';
        } else if (x >= imageX + imageWidth - resizeMargin && x <= imageX + imageWidth + resizeMargin && y >= imageY + resizeMargin && y <= imageY + imageHeight - resizeMargin) {
            canvas.style.cursor = 'e-resize';
        }
    
        if (isDragging) {
            if (dragType === 'text') {
                textX = x - offsetX;
                textY = y - offsetY;
            } else if (dragType === 'image') {
                imageX = x - offsetX;
                imageY = y - offsetY;
            }
        } else if (isResizing) {
            switch (resizeType) {
                case 'nw':
                    imageWidth = imageX + imageWidth - x;
                    imageHeight = imageY + imageHeight - y;
                    imageX = x;
                    imageY = y;
                    break;
                case 'ne':
                    imageWidth = x - imageX;
                    imageHeight = imageY + imageHeight - y;
                    imageY = y;
                    break;
                case 'sw':
                    imageWidth = imageX + imageWidth - x;
                    imageHeight = y - imageY;
                    imageX = x;
                    break;
                case 'se':
                    imageWidth = x - imageX;
                    imageHeight = y - imageY;
                    break;
                case 'n':
                    imageHeight = imageY + imageHeight - y;
                    imageY = y;
                    break;
                case 'e':
                    imageWidth = x - imageX;
                    break;
                case 's':
                    imageHeight = y - imageY;
                    break;
                case 'w':
                    imageWidth = imageX + imageWidth - x;
                    imageX = x;
                    break;
            }
        }
    });
    
    
    

    const rotationInput = document.getElementById('rotationInput');
    const applyRotationBtn = document.getElementById('applyRotation');

    applyRotationBtn.addEventListener('click', () => {
        const angle = parseFloat(rotationInput.value) || 0;
        rotationAngle = angle;
        drawElements();
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        canvas.style.cursor = 'default';
    });


    const saveButton = document.getElementById('saveButton');

    saveButton.addEventListener('click', () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL();  // Ottieni l'URL dei dati del canvas
        downloadLink.download = 'phone-cover.png';  // Nome del file da scaricare
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    drawElements();
});