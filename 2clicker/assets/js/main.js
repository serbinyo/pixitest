let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

let app = new Application({
    width    : 512,
    height   : 512,
    antialias: true, //сглаживание
});

document.body.appendChild(app.view);

let value = 0, score, target, gameScene,
    id, bg, timer = 10;

loader
    .add("/2clicker/assets/images/atlas.json")
    .load((loader, resources) => {
        id = resources["/2clicker/assets/images/atlas.json"].textures;

        gameScene = new Container();
        app.stage.addChild(gameScene);

        bg = new Sprite(id["background.png"]);
        bg.anchor.set(0, 0);
        gameScene.addChild(bg);

        let scoreBar = new Container();
        scoreBar.position.set(app.stage.width / 2 - scoreBar.width / 2, 22);
        gameScene.addChild(scoreBar);

        let bgScoreBar = new Sprite(id["score.png"]);
        scoreBar.addChild(bgScoreBar);

        let style = new TextStyle({
            fontFamily: "Arial",
            fontSize  : 28,
            fill      : "white",
        });

        score = new Text("0", style);
        score.x = -score.width / 2;
        score.y = -score.height / 2 - 1;
        scoreBar.addChild(score);

        let styleLogo = new TextStyle({
            fontFamily: "Arial",
            fontSize  : 28,
            fill      : "blue",
        });

        let logo = new Text("Печеньки", styleLogo);
        logo.x = -60;
        logo.y = 30;
        scoreBar.addChild(logo);

        target = new Sprite(id["cookie.png"]);
        target.x = gameScene.width / 2;
        target.y = gameScene.height / 2;
        target.interactive = true;
        target.buttonMode = true;
        target.on("pointerdown", handlerClick);
        gameScene.addChild(target);

        app.ticker.add((delta) => {
            if (20 === value) {
                alert('You win!')
            }
            if (0 === timer) {
                target.scale.x = 1;
                target.scale.y = 1;
            } else if (0 < timer) {
                timer--;
            }
        });
    });


function handlerClick() {
        value++;
        score.text = value;
        score.x = -score.width / 2;
        score.y = -score.height / 2;
        target.scale.x = 0.95;
        target.scale.y = 0.95;
        timer = 10;
}