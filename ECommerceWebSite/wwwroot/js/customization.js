document.addEventListener('DOMContentLoaded', () => {
    const fontFamilySelect = document.getElementById('font-family');
    const uploadImageInput = document.getElementById('upload-image');
    const canvas = document.getElementById('phone-canvas');
    const ctx = canvas.getContext('2d');

    let images = [];
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
    let selectedImage = null;

    const drawElements = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        images.forEach((image) => {
            ctx.save();
            ctx.translate(image.x + image.width / 2, image.y + image.height / 2);
            ctx.rotate(image.rotationAngle * Math.PI / 180);
            ctx.translate(-(image.x + image.width / 2), -(image.y + image.height / 2));
    
            ctx.drawImage(image.img, image.x, image.y, image.width, image.height);

            // Disegna il pulsante "X" per eliminare l'immagine
            drawCloseButton(image);
    
            ctx.restore();
    
            ctx.setLineDash([5, 5]); // Imposta la linea tratteggiata
            ctx.strokeStyle = 'black';
            ctx.strokeRect(image.x, image.y, image.width, image.height); // Disegna il rettangolo tratteggiato attorno all'immagine
        });
    
        ctx.font = `24px ${font}`;
        ctx.fillStyle = 'black';
        ctx.fillText(coverText, textX, textY);
    };

    const drawCloseButton = (image) => {
        const closeButtonSize = 20;
        const closeButtonX = image.x + image.width - closeButtonSize / 2;
        const closeButtonY = image.y - closeButtonSize / 2;
        
        ctx.fillStyle = 'red';
        ctx.fillRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(closeButtonX + 5, closeButtonY + 5);
        ctx.lineTo(closeButtonX + closeButtonSize - 5, closeButtonY + closeButtonSize - 5);
        ctx.moveTo(closeButtonX + 5, closeButtonY + closeButtonSize - 5);
        ctx.lineTo(closeButtonX + closeButtonSize - 5, closeButtonY + 5);
        ctx.stroke();
    };

    fontFamilySelect.addEventListener('change', () => {
        font = fontFamilySelect.value;
        drawElements();
    });

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const newImage = new Image();
            newImage.src = e.target.result;
            newImage.onload = () => {
                images.push({
                    img: newImage,
                    x: 0,
                    y: 0,
                    width: newImage.width,
                    height: newImage.height,
                    rotationAngle: 0
                });
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
        e.stopPropagation();
    });
    document.body.appendChild(textInput);

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        canvas.style.cursor = 'default';
    
        images.forEach((image) => {
            ctx.save();
            ctx.translate(image.x + image.width / 2, image.y + image.height / 2);
            ctx.rotate(image.rotationAngle * Math.PI / 180);
            ctx.translate(-(image.x + image.width / 2), -(image.y + image.height / 2));
    
            ctx.drawImage(image.img, image.x, image.y, image.width, image.height);

            
    
            ctx.restore();
    
            const isInsideImage = x >= image.x && x <= image.x + image.width && y >= image.y && y <= image.y + image.height;
    
            if (isInsideImage) {
                canvas.style.cursor = 'move';
                ctx.setLineDash([5, 5]); // Imposta la linea tratteggiata
                ctx.strokeStyle = 'black';
                ctx.strokeRect(image.x, image.y, image.width, image.height); // Disegna il rettangolo tratteggiato attorno all'immagine

                // Disegna il pulsante "X" per eliminare l'immagine
                drawCloseButton(image);
            } else {
                ctx.setLineDash([]); // Ripristina il tratto solido
            }
        });
    
        const textMetrics = ctx.measureText(coverText);
        const textWidth = textMetrics.width;
        const textHeight = 24;
    
        const textLeft = textX;
        const textTop = textY - textHeight/1.5;
    
        const isInsideText = x >= textLeft && x <= textLeft + textWidth && y >= textTop && y <= textTop + textHeight;
        if (isInsideText) {
            canvas.style.cursor = 'move';
            ctx.setLineDash([5, 5]); // Imposta la linea tratteggiata
            ctx.strokeStyle = 'black';
            ctx.strokeRect(textLeft, textTop, textWidth, textHeight); // Disegna il contorno tratteggiato attorno al testo   
        }
        ctx.fillText(coverText, textX, textY);

        if (isDragging) {
            if (dragType === 'text') {
                textX = x - offsetX;
                textY = y - offsetY;
            } else if (dragType === 'image' && selectedImage) {
                selectedImage.x = x - offsetX;
                selectedImage.y = y - offsetY;
            }

            drawElements();
        }
    });
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        selectedImage = null;
    
        images.forEach((image) => {
            // Controlla se è stato cliccato il pulsante "X" per eliminare l'immagine
            const closeButtonSize = 20;
            const closeButtonX = image.x + image.width - closeButtonSize / 2;
            const closeButtonY = image.y - closeButtonSize / 2;
    
            if (x >= closeButtonX && x <= closeButtonX + closeButtonSize && y >= closeButtonY && y <= closeButtonY + closeButtonSize) {
                const index = images.indexOf(image);
                if (index > -1) {
                    images.splice(index, 1); // Rimuovi l'immagine dall'array
                    drawElements(); // Ridisegna il canvas
                    return; // Esci dalla funzione forEach
                }
            }
    
            if (x >= image.x && x <= image.x + image.width && y >= image.y && y <= image.y + image.height) {
                selectedImage = image;
                offsetX = x - image.x;
                offsetY = y - image.y;
                isDragging = true;
                dragType = 'image';
            }
        });
    
        const textMetrics = ctx.measureText(coverText);
        const textWidth = textMetrics.width;
        const textHeight = 24;
    
        const textLeft = textX;
        const textTop = textY - textHeight / 1.5;
    
        if (x >= textLeft && x <= textLeft + textWidth && y >= textTop && y <= textTop + textHeight) {
            offsetX = x - textX;
            offsetY = y - textY;
            isDragging = true;
            dragType = 'text';
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        dragType = '';
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

});
