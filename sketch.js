var trex, trexImg, trex_collided;
var ground,groundImg, invisible_ground;
var cloudImg;

var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;

var cloudGroup,obstacleGroup;

var gameover,gameoverImg, restart, restartImg;

var jumpSound, dieSound, checkSound

var PLAY = 1;
var END = 0;
var gameState= PLAY;

var score=0;

function preload()
{
    trexImg= loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided=loadImage("trex_collided.png");

    groundImg=loadImage("ground2.png");

    cloudImg=loadImage("cloud.png");

    obstacle1=loadImage("obstacle1.png")
    obstacle2=loadImage("obstacle2.png")
    obstacle3=loadImage("obstacle3.png")
    obstacle4=loadImage("obstacle4.png")
    obstacle5=loadImage("obstacle5.png")
    obstacle6=loadImage("obstacle6.png")

    restartImg= loadImage("restart.png")
    gameoverImg=loadImage("gameOver.png")

    jumpSound = loadSound("jump.mp3")
    dieSound=loadSound("die.mp3")
    checkSound=loadSound("checkPoint.mp3")
}

function setup()
{
    createCanvas(800,200)

    ground=createSprite(400,180,800,10);
    ground.addImage("ground",groundImg);
   
    invisible_ground=createSprite(400,190,800,10)
    invisible_ground.visible=false;

    trex= createSprite(50,170,10,10);
    trex.addAnimation("trex_running",trexImg);
    trex.addAnimation("trex_collided",trex_collided);
    trex.scale=0.5;

    restart= createSprite(400,100,10,10)
    restart.addImage(restartImg)
    restart.scale=0.5;

    gameover= createSprite(400,60,10,10)
    gameover.addImage(gameoverImg)
    gameover.scale=0.5;

    cloudGroup= createGroup();
    obstacleGroup= createGroup();

}

function draw()
{
    background("white");
    
    text("Score : "+ score,700,40);

    if(gameState===PLAY)
    {
        ground.velocityX=-(4 +score/60);

        if(keyDown("space")&& trex.y>100)
        {
            trex.velocityY=-10;
            jumpSound.play();
        }
    
        trex.velocityY+=0.8;

        if(ground.x<0)
        {
            ground.x=ground.width/2;
        }

        spawnClouds();
        spawnObstacle();
    
        if(trex.isTouching(obstacleGroup)){
            trex.velocityY = 0;
            gameState= END;
            dieSound.play();
        }

        if(score%100===0 && score>0)
        {
            checkSound.play();
        }

        score += Math.round(getFrameRate()/60);

      gameover.visible=false;
      restart.visible=false;

    }

    else if (gameState===END)
    {
       ground.velocityX=0;

       trex.changeAnimation("trex_collided",trex_collided)
       obstacleGroup.setVelocityXEach(0);
       cloudGroup.setVelocityXEach(0);
       obstacleGroup.setLifetimeEach(-1);
       cloudGroup.setLifetimeEach(-1);

      gameover.visible=true;
      restart.visible=true;

      if(mousePressedOver(restart)){

        reset();
            
      }
    }

    trex.collide(invisible_ground);
    
    drawSprites();
}

function spawnClouds()
{
    if(frameCount%60===0)
    {
        var cloud= createSprite(800,Math.round(random(10,50)),10,10);
        cloud.addImage("clouds",cloudImg);
        cloud.scale=0.6
        cloud.velocityX=-(5+ score/100);
        cloud.lifetime=600;

        cloudGroup.add(cloud);

        cloud.depth=trex.depth;
        trex.depth=cloud.depth+1;
    }
}

function spawnObstacle()
{
    if(frameCount%100===0)
        
    {   var obstacle= createSprite(800,160,10,10);
        var rand= Math.round(random(1,6))
        switch(rand)
        {
            case 1: obstacle.addImage(obstacle1);
            break;

            case 2: obstacle.addImage(obstacle2);
            break;

            case 3: obstacle.addImage(obstacle3);
            break;

            case 4: obstacle.addImage(obstacle4);
            break;

            case 5: obstacle.addImage(obstacle5);
            break;

            case 6: obstacle.addImage(obstacle6);
            break;

            default: break;
        }
        obstacle.scale=0.6
        obstacle.velocityX=-(4 +score/60);
        obstacle.lifetime=600;

        obstacleGroup.add(obstacle);

    }
}
function reset()
    {
        gameState=PLAY;
        obstacleGroup.destroyEach()
        cloudGroup.destroyEach()
        score=0;
        trex.changeAnimation("trex_running",trexImg);
    }



