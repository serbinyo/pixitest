const app = new PIXI.Application({
    width          : 640,
    height         : 640,
    backgroundColor: 0x1099bb,
});

document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const texture = PIXI.Texture.from("/pixi-test/sample.png")

const rocket = new PIXI.Sprite(texture);
container.addChild(rocket);

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;
rocket.anchor.set(0.25);


app.ticker.add(
    (delta) => {
        container.rotation -= 0.01 * delta;
    });