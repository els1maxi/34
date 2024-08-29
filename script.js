document.addEventListener("DOMContentLoaded", () => {
    const drawingArea = document.getElementById('drawingArea');
    const settingsModal = document.getElementById('settingsModal');
    const editForm = document.getElementById('editForm');
    const applyBtn = document.getElementById('applyBtn');
    const closeBtn = document.getElementById('closeBtn');
    let activeCircle = null;
    let moveHandler = null;
    let dragging = false;

    const colorContainer = createColorContainer();
    drawingArea.appendChild(colorContainer);

    drawingArea.addEventListener('dblclick', onCanvasDoubleClick);
    colorContainer.addEventListener('dblclick', onColorContainerDoubleClick);
    drawingArea.addEventListener('contextmenu', onCanvasRightClick);
    applyBtn.addEventListener('click', onApplyButtonClick);
    closeBtn.addEventListener('click', closeSettingsModal);
    window.addEventListener('click', onWindowClick);
    window.addEventListener('keydown', onWindowKeydown);

    function createColorContainer() {
        const container = createElement('div', 'color-container');
        container.textContent = 'Available Color Blocks';
        return container;
    };

    function onCanvasDoubleClick(event) {
        if (event.target === drawingArea) {
            const circle = createCircle();
            colorContainer.appendChild(circle);
        }
    };

    function onColorContainerDoubleClick() {
        const circle = createCircle();
        colorContainer.appendChild(circle);
    };

    function onCanvasRightClick(event) {
        event.preventDefault();
        if (event.target.classList.contains('circle')) {
            activeCircle = event.target;
            settingsModal.style.display = "block";
        }
    };

    function onApplyButtonClick() {
        const diameter = document.getElementById('sizeInput').value;
        const color = document.getElementById('colorInput').value;
        activeCircle.style.width = activeCircle.style.height = `${diameter}px`;
        activeCircle.style.backgroundColor = color;
        closeSettingsModal();
    };

    function onWindowClick(event) {
        if (event.target === settingsModal) closeSettingsModal();
    };

    function onWindowKeydown(event) {
        if (event.key === 'Escape') {
            closeSettingsModal();
            if (moveHandler) {
                window.removeEventListener('mousemove', moveHandler);
                if (dragging) {
                    activeCircle.style.zIndex = '';
                    dragging = false;
                }
            }
        }
    };

    function createCircle() {
        const circle = createElement('div', 'circle');
        circle.style.backgroundColor = generateRandomColor();
        circle.style.width = circle.style.height = '50px';
        circle.style.left = `${Math.floor(Math.random() * (colorContainer.offsetWidth - 50))}px`;
        circle.style.top = `${Math.floor(Math.random() * (colorContainer.offsetHeight - 50))}px`;

        circle.addEventListener('click', onCircleClick);

        function onCircleClick() {
            if (!dragging) {
                activeCircle = circle;
                circle.style.zIndex = '999';
                circle.style.opacity = '0.5';
                dragging = true;
                moveHandler = function(event) {
                    circle.style.left = `${event.pageX - drawingArea.offsetLeft - circle.offsetWidth / 2}px`;
                    circle.style.top = `${event.pageY - drawingArea.offsetTop - circle.offsetHeight / 2}px`;
                };
                window.addEventListener('mousemove', moveHandler);
            } else {
                circle.style.zIndex = '';
                dragging = false;
                circle.style.opacity = '1';
                window.removeEventListener('mousemove', moveHandler);
                moveHandler = null;
            }
        }
        return circle;
    };

    function createElement(tag, className) {
        const element = document.createElement(tag);
        element.classList.add(className);
        return element;
    };

    function closeSettingsModal() {
        settingsModal.style.display = "none";
        editForm.reset();
    };

    function generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };
});
