// Disable interaction plugin (for PixiJS 6)
// eslint-disable-next-line no-underscore-dangle
delete PIXI.Renderer.__plugins.interaction;

// Create app
const app = new PIXI.Application({
    width          : 1680,
    height         : 1024,
    antialias      : true,
    autoDensity    : true,
    backgroundColor: 0x1099bb,
    resolution     : devicePixelRatio,
});
document.body.appendChild(app.view);



// Install EventSystem, if not already (PixiJS 6 doesn't add it by default)
if (!('events' in app.renderer)) {
    app.renderer.addSystem(PIXI.EventSystem, 'events');
}

// Create a texture from an image path
const imageTexture = PIXI.Texture.from('/4color/assets/images/pngwing_s.png');

// Make the whole scene interactive
app.stage.interactive = true;
// Make sure stage captures all events when interactive
app.stage.hitArea = app.renderer.screen;
// Handle clicks on the canvas
app.stage.addEventListener('click', onClick);

app.stage.sortableChildren = true;

// Scale mode for pixelation
imageTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

// Populate scene graph with brushes

// Create our little brush friend..
const brush = new PIXI.Sprite(imageTexture);

// Enable the brush to be interactive... this will allow it to respond to
// mouse and touch events
brush.interactive = true;

// This button mode will mean the hand cursor appears when you roll over
// the brush with your mouse
brush.buttonMode = true;

//Добавляем zIndex, что бы кисть всегда была сверху
brush.zIndex = 100;

// Center the brush's anchor point.
brush.anchor.set(0.5);

// Make it a bit bigger, so it's easier to grab.
brush.scale.set(2);

// Setup events for mouse + touch using the pointer events
brush.addEventListener('pointerdown', onDragStart);
brush.addEventListener('pointerup', onDragEnd);
brush.addEventListener('pointerupoutside', onDragEnd);

// Move the sprite to its designated position
brush.x = Math.floor(Math.random() * app.screen.width);
brush.y = Math.floor(Math.random() * app.screen.height);

// Add it into the scene
app.stage.addChild(brush);

// Add a description
const title = app.stage.addChild(new PIXI.Text(
    'Покрась холст кисточкой',
    {
        fontSize: 12,
    },
));
title.position.set(12, 12);

//Добавляем цвет краски и присваиваем ему значение по усолчанию
let pouringColor = 0xFF0000;

//Добавляем панель для кнопок
const bottomPanel = new PIXI.Graphics();
// Rectangle
bottomPanel.beginFill(0x808080);
bottomPanel.drawRect(0, app.stage.hitArea.height - 50, app.stage.hitArea.width, 50);
bottomPanel.endFill();
bottomPanel.zIndex = 50;
app.stage.addChild(bottomPanel);

//Добавляем кнопки для выбора цвета
addColorPicker(0xFF0000, {x: 100, y: 560});
addColorPicker(0xFF4500, {x: 150, y: 560});
addColorPicker(0xFFFF00, {x: 200, y: 560});
addColorPicker(0x008000, {x: 250, y: 560});
addColorPicker(0x00BFFF, {x: 300, y: 560});
addColorPicker(0x0000FF, {x: 350, y: 560});
addColorPicker(0x4B0082, {x: 400, y: 560});
addColorPicker(0xFF00FF, {x: 450, y: 560});
addColorPicker(0x808080, {x: 500, y: 560});
addColorPicker(0x000000, {x: 550, y: 560});
addColorPicker(0xFFFFFF, {x: 600, y: 560});

// Store the brush being dragged
let selectedTarget;

function addColorPicker(color, coords) {
    const square = new PIXI.Graphics();
    // Rectangle + line
    square.lineStyle(5, 0xFFFFFF, 1);
    square.beginFill(color);
    square.drawRect(coords.x, app.stage.hitArea.height - 40, 30, 30);
    square.endFill();
    square.interactive = true;
    square.buttonMode = true;
    square.addEventListener('click', function () {
        pouringColor = color;
    });

    bottomPanel.addChild(square);
}

// Make brush semi-transparent and listen to drag-move events when one is
// pressed.
function onDragStart(e) {
    // Show that the brush can now be dragged.
    e.target.alpha = 0.5;
    selectedTarget = e.target;

    // Start listening to dragging on the stage
    app.stage.addEventListener('pointermove', onDragMove);
}

// Restore the dragTarget brush's alpha & deregister listener when the brush is
// released.
function onDragEnd() {
    // Restore the original brush alpha.
    selectedTarget.alpha = 1;

    // Stop listening to dragging on the stage
    app.stage.removeEventListener('pointermove', onDragMove);
}

// Copy the position of the cursor into the dragTarget's position.
function onDragMove(e) {
    // Don't use e.target because the pointer might move out of the brush if
    // the user drags fast, which would make e.target become the stage.
    selectedTarget.parent.toLocal(e.global, null, selectedTarget.position);

    paint(e)
}

function onClick(e) {
    //Если не кликнули по нижней панеле и выбран предмет перемещаем его
    if (e.global.y < app.stage.hitArea.height - bottomPanel.height) {
        if (selectedTarget) {
            selectedTarget.position.copyFrom(e.global);
        }
    }
}

function paint(e) {
    let pouring = new PIXI.Graphics();
    pouring.beginFill(pouringColor);
    pouring.drawRect(e.global.x - 60, e.global.y - 60, 120, 20);
    pouring.endFill();

    app.stage.addChild(pouring);
}
