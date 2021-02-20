var trex, trexImg, trex_collided;
var ground,groundImg, invisible_ground;
var cloudImg;

var bird,birdImg

var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;

var cloudGroup,obstacleGroup;

var gameover,gameoverImg, restart, restartImg;

var jumpSound, dieSound, checkSound

var PLAY = 1;
var END = 0;
var gameState= PLAY;

var score=0;
var testCloud=-4;
var testObs=-4;
var testbird;

var obstacle,cloud;

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

    birdImg=loadImage("bird.png")

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
    ground.velocityX= -4
    ground.addImage("ground",groundImg);
   
    invisible_ground=createSprite(400,190,800,10)
    invisible_ground.visible=false;

    trex= createSprite(90,170,10,10);
    trex.addAnimation("trex_running",trexImg);
    trex.addAnimation("trex_collided",trex_collided);
    trex.scale=0.55;
    trex.setCollider("circle",0,0,40)
    //trex.debug=true;

    restart= createSprite(400,100,10,10)
    restart.addImage(restartImg)
    restart.scale=0.5;

    gameover= createSprite(400,60,10,10)
    gameover.addImage(gameoverImg)
    gameover.scale=0.5;

    cloudGroup= createGroup();
    obstacleGroup= createGroup();
    birdGroup=createGroup();

}

async function draw()
{
    background("white");
    text("Score : "+ score,700,40);

    if(gameState===PLAY)
    {
    spawnClouds();
    if(score<1300)
    {
    spawnObstacle();
    }
    if (score> 1300)
    {
        var rand= Math.round(random(1,4))
        if(rand===1 || rand===3)
        {
            spawnBird();
        }
            
        else if( rand===2 || rand ===4)
        {
            spawnObstacle();
        }
            
        
    }
       
    if(keyDown("space")&& trex.isTouching(ground))
    {
         trex.velocityY=-11;
         jumpSound.play();
    }
    
    trex.velocityY+=0.6;

    if(ground.x<0)
    {
        ground.x=ground.width/2;
    }
    
    if(trex.isTouching(obstacleGroup)|| trex.isTouching(birdGroup))
    {
        trex.velocityY = 0;
        gameState= END;
       dieSound.play();
        //trex.velocityY=-10;
        //jumpSound.play();
    }

    if(score%100===0 && score>0)
    {
        checkSound.play();
        speed();
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
       birdGroup.setVelocityXEach(0);
       birdGroup.setLifetimeEach(-1);

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
    if(frameCount%60===0  && frameCount>0)
    {
        cloud= createSprite(800,Math.round(random(10,50)),10,10);
        cloud.addImage("clouds",cloudImg);
        cloud.scale=0.6

        cloud.velocityX= testCloud;

       /* {   if(score%50===0){

            cloud.velocityX=-(5+ score/100);
            testspeed=cloud.velocityX;
        }*/
       
        cloud.lifetime=600;

        cloudGroup.add(cloud);

        cloud.depth=trex.depth;
        trex.depth=cloud.depth+1;
    }
}


function spawnObstacle()
{ //var rnd= Math.round(random(60,100))
    
    if(frameCount%80===0 &&  frameCount>0)
    
    {   obstacle= createSprite(800,160,70,70);
        //obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height)
        //obstacle.debug=true;
        var rand= Math.round(random(1,6))
        console.log(rand);
        obstacle.velocityX=testObs
        switch(rand)
        {
            case 1: obstacle.addImage(obstacle1);
            obstacle.setCollider("circle",0,0,obstacle1.width/2)
            break;

            case 2: obstacle.addImage(obstacle2);
            obstacle.setCollider("circle",0,0,obstacle2.width/2)
            break;

            case 3: obstacle.addImage(obstacle3);
            obstacle.setCollider("circle",0,0,obstacle3.width/2)
            break;

            case 4: obstacle.addImage(obstacle4);
            obstacle.setCollider("circle",0,0,obstacle4.width/2)
            break;

            case 5: obstacle.addImage(obstacle5);
            obstacle.setCollider("circle",0,0,obstacle5.width/2)
            break;

            case 6: obstacle.addImage(obstacle6);
            //obstacle.scale=0.4
            obstacle.setCollider("circle",0,0,obstacle6.width/3)
            
            break;

            default: break;
        }
        obstacle.scale=0.55
        
        obstacle.lifetime=600;

        obstacleGroup.add(obstacle);

        console.log("obstacle " , obstacle.velocityX);
        console.log("ground",ground.velocityX);

    }
}

function reset()
    {
        gameState=PLAY;
        obstacleGroup.destroyEach()
        cloudGroup.destroyEach()
        score=0;
        trex.changeAnimation("trex_running",trexImg);
        ground.velocityX= -4
        testObs=-4
        testCloud=-4
    }

    function spawnBird()
    {
        if(frameCount%100===0  && frameCount>0)
    {
        bird= createSprite(800,Math.round(random(70,160)),10,10);
        bird.addImage("bird",birdImg);
        bird.scale=0.1

        bird.velocityX= testObs;

       /* {   if(score%50===0){

            cloud.velocityX=-(5+ score/100);
            testspeed=cloud.velocityX;
        }*/
       
        bird.lifetime=600;

        birdGroup.add(bird);

        bird.depth=trex.depth;
        trex.depth=bird.depth+1;
    }
    }

    function speed()
    {
        
            obstacle.velocityX=-(4 +score/200);
            testObs=obstacle.velocityX;

            cloud.velocityX=-(4+ score/200);
            testCloud=cloud.velocityX;

            ground.velocityX= -(4 + score/200);

    }



