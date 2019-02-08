/*
Set up and start the application
------------------------------------
*/

//An array of files to load. 
let thingsToLoad = [
    "images/cat.png",
    "images/smoke1.png",
    "images/fireUp.png",
    "images/fireDown.png",
    "images/cardsUp.png",
    "images/cardsDown.png",
    "images/mixedUp.png",
    "images/mixedDown.png",
    "images/blue.png",
    "images/darkgray.png",
    "images/gray.png",
    "images/green.png",
    "images/lightblue.png",
    "images/orange.png",
    "images/pink.png",
    "images/purple.png",
    "images/red.png",
    "images/red2.png",
    "images/white.png",
  ];
  
  //Initialize the Hexi engine. The `hexi` function has 5 arguments,
  //although only the first 3 are required:
  //a. Canvas width.
  //b. Canvas height.
  //c. The `setup` function.
  //d. The `thingsToLoad` array you defined above. This is optional.
  //e. The `load` function. This is also optional.
  //If you skip the last two arguments, Hexi will skip the loading
  //process and jump straight to the `setup` function.
  let g = hexi(512, 288, setup, thingsToLoad, load);
  
  //Optionally Set the frames per second at which the game logic loop should run.
  //(Sprites will be rendered independently, with interpolation, at full 60 or 120 fps)
  //If you don't set the `fps`, Hexi will default to an fps of 60
  //I've used 30fps in the demo to optimize for performance
  g.fps = 30;
  
  //Optionally add a border and set the background color
  //g.border = "2px red dashed";
  g.backgroundColor = 0x000000;
  
  //Optionally scale and align the canvas inside the browser window
  g.scaleToWindow();
  
  //Start Hexi engine. 
  g.start();
  
  
  /*
  Loading Files
  ----------------
  */
  
  //The `load` function will run while assets are loading. This is the
  //same `load` function assigned to Hexi's 4th initialization argument.
  
  function load() {
  
    //Display the file currently being loaded
    console.log(`loading: ${g.loadingFile}`);
  
    //Display the percentage of files currently loaded
    console.log(`progress: ${g.loadingProgress}`);
  
    //Add an optional loading bar.
    g.loadingBar();
  
    //You can create your own custom loading bar using Hexi's
    //`loadingFile` and `loadingProgress` values. See the `loadingBar`
    //and `makeProgressBar` methods in Hexi's `core.js` file for ideas
  }
  
  
  /*
  Initialize and Set up game objects
  ------------------------------------------
  */
  
  //Declare any variables that need to be used in more than one function
  let fireScreen, cardsScreen, fire, fireBase, fps, fpsMessage,
      mixedScreen, fadeInOut,
      times = [];
      fadeInOutStarted = false; 
  
  //The `setup` function will run when all the assets have loaded. This
  //is the `setup` function you assigned as Hexi's 3rd argument. 
  
  function setup() {

    /*
    The menu
    --------
    */
   
    //The fire button
    let fireButton = g.button([
      "images/fireUp.png",
      "images/fireUp.png",
      "images/fireDown.png"
    ]);
    fireButton.x = 84;
    fireButton.y = 10;

    fireButton.press = () => {
    //   fireScreen.visible = true;
    //   cardsScreen.visible = false;
    //   mixedScreen.visible = false;

      //Transition to the fireScreen
      g.slide(mixedScreen, -512, 0, 30, "decelerationCubed");
      fireScreen.x = 512; 
      g.slide(fireScreen, 0, 0, 30, "decelerationCubed");
      g.slide(cardsScreen, -512, 0, 30, "decelerationCubed");
    };
 
    //The cards button
    let cardsButton = g.button([
      "images/cardsUp.png",
      "images/cardsUp.png",
      "images/cardsDown.png"
    ]);
    cardsButton.x = 10;
    cardsButton.y = 10;

    cardsButton.press = () => {
      //fireScreen.visible = false;
      //cardsScreen.visible = true;
      //mixedScreen.visible = false;

      //Transition to the cardsScreen
      g.slide(mixedScreen, -512, 0, 30, "decelerationCubed");
      cardsScreen.x = 512; 
      g.slide(cardsScreen, 0, 0, 30, "decelerationCubed");
      g.slide(fireScreen, -512, 0, 30, "decelerationCubed");
    };

    //The mixed button
    let mixedButton = g.button([
        "images/mixedUp.png",
        "images/mixedUp.png",
        "images/mixedDown.png"
      ]);
      mixedButton.x = 158;
      mixedButton.y = 10;
  
    mixedButton.press = () => {
      //fireScreen.visible = false;
      //cardsScreen.visible = false;
      //mixedScreen.visible = true;

      //Start the fade in/out animation
      if (!fadeInOutStarted) {
          fadeInOut();
          fadeInOutStarted = true;
      }

      //Transition to the mixedScreen
      mixedScreen.x = 512; 
      g.slide(mixedScreen, 0, 0, 30, "decelerationCubed");
      g.slide(cardsScreen, -512, 0, 30, "decelerationCubed");
      g.slide(fireScreen, -512, 0, 30, "decelerationCubed");
    };

    //Create groups for each screen (These are Pixi containers)
    //and set their initial positions
    fireScreen = g.group();
    cardsScreen = g.group();
    mixedScreen = g.group();
    mixedScreen.x = -512;
    fireScreen.x = -512;
    //fireScreen.visible = false;
    //mixedScreen.visible = false;
    //cardsScreen.visible = true;
    

    /*
    Fire screen
    -----------
    */

    fire = g.group();
    fireScreen.add(fire);

    //Create the particle emitters
    //1. Center flame
    let centerParticleStream = g.particleEmitter(
        200,                                   //The interval, in milliseconds
        () => g.createParticles(               //The `createParticles` method
          30, 30,                              //x and y position
          () => g.circle(6, "red", "none"),    //Sprite to use
          fire,                                //The container to which the particle system should be added to
          2,                                   //Number of particles
          -0.1,                                //Gravity
          true,                                //Random spacing
          4.14, 5.38,                          //Min/max angle
          6, 16,                               //Min/max size
          0.5, 1,                              //Min/max speed
          0.005, 0.01,                         //Min/max scale speed
          0.06, 0.08,                          //Min/max alpha speed
          0.05, 0.1                            //Min/max rotation speed
        )
      );
   
    //2. Left flame
    let leftParticleStream = g.particleEmitter(
        200,                                   //The interval, in milliseconds
        () => g.createParticles(               //The `createParticles` method
          28, 30,                              //x and y position
          () => g.circle(6, "orange", "none"), //Sprite to use
          fire,                                //The container to which the particle system should be added to
          1,                                   //Number of particles
          -0.1,                                //Gravity
          true,                                //Random spacing
          4.14, 5.38,                          //Min/max angle
          8, 12,                               //Min/max size
          2, 3,                                //Min/max speed
          0.005, 0.01,                         //Min/max scale speed
          0.12, 0.16,                          //Min/max alpha speed
          0.05, 0.1                            //Min/max rotation speed
        )
      );

    //3. Right flame
    let rightParticleStream = g.particleEmitter(
        100,                                   //The interval, in milliseconds
        () => g.createParticles(               //The `createParticles` method
          33, 30,                              //x and y position
          () => g.circle(6, "orange", "none"), //Sprite to use
          fire,                                //The container to which the particle system should be added to
          1,                                   //Number of particles
          -0.1,                                //Gravity
          true,                                //Random spacing
          4.14, 5.38,                          //Min/max angle
          8, 12,                               //Min/max size
          2, 3,                                //Min/max speed
          0.005, 0.01,                         //Min/max scale speed
          0.12, 0.16,                          //Min/max alpha speed
          0.05, 0.1                            //Min/max rotation speed
        )
      );

    //A mask that covers the particle emission area - just for aesthetic reasons
    let fireBase = g.rectangle(60, 25, "black", "none");
    fireBase.setPosition(220, 175);
    fireScreen.add(fireBase);
    fire.scaleX = 2;
    fire.scaleY = 2;
    fire.setPosition(190, 120)

    //Start the particle emitters
    centerParticleStream.play();
    leftParticleStream.play();
    rightParticleStream.play();


    /*
    Cards screen
    -----------
    */

    //Create the cards

    //An array of card faces
    let cardFaces = [
      "blue", "darkgray", "gray", "green", "lightblue",
      "orange", "pink", "purple", "red", "red2", "white"
    ];

    //Create 144 cards using the card faces array above
    let startX = 60;
    let startY = 65;

    //`randomInt` helper function
    let randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    //Create 144 cards by selecting a random card face, using it to create
    //card sprite, and then stacking it with an x/y offset.
    let cards = [];
    for(let i = 0; i <= 144; i++) {
      let randomCard = cardFaces[randomInt(0, cardFaces.length - 1)];
      let card = g.sprite(`images/${randomCard}.png`);
      card.scaleX = 0.75;
      card.x = startX + i;
      card.y = startY + i;
      cards.push(card);
      cardsScreen.add(card);
    } 

    //Create a group (a Pixi Container) for the new pile of stacked cards
    let stackedCards = g.group();
    cardsScreen.add(stackedCards);

    //The `stackCards` function moves the cards from the original
    //stack to the new stack, using the `slide` tweening function.
    let stackCards = () => {
      let currentCard = cards.pop();
      let destinationX = 204 + stackedCards.children.length;
      let destinationY = 65 + stackedCards.children.length;

      //Adding the card to the `stackedCards` group gives it a new display
      //list order, which is why the layer depth is correct
      stackedCards.add(currentCard);

      //To animate the card, first `slide` it to the right
      //`slide` arguments: sprite, endX, endY, durationInFrames,
      //easingType, yoyo?, delayInMilleseconsBeforeRepeating
      let rightDestination = destinationX + cards.length;
      let leftDestination = currentCard.y + stackedCards.children.length;
      let cardSlideRight = g.slide(
          currentCard, 
          rightDestination, 
          leftDestination, 
          30, 
          "smoothstep", 
          false, 
          0
      ); 

      //When the first animation is finished, `slide` the card down 
      //onto the new stack
      cardSlideRight.onComplete = () => {
        let cardSlideDown = g.slide(
            currentCard, 
            destinationX, 
            destinationY, 
            30, 
            "smoothstep", 
            false, 
            0
         ); 

        //When the second animation is complete, 
        //If there are still cards remaining in the original
        //stack, `wait` for 1 second and then stack a new cards
        //by calling this same `stackCards` function recursively. 
        cardSlideDown.onComplete = () => {
          if (cards.length > 0) {
            g.wait(1000, () => stackCards());
          }
        }
      } 
    };

    //Wait 2 sseconds and then 
    //call the `stackCards` function to start stacking the cards.
    g.wait(2000, () => stackCards());

    //Create a text sprite to display the fps. See the `play`
    //function below to see how the fps is calculated and displayed.
    fpsMessage = g.text("fps: ", "16px Futura", "white");
    cardsScreen.add(fpsMessage);
    fpsMessage.x = 20;
    fpsMessage.y = 220;


    /*
    Mixed text and images screen
    ----------------------------
    */

    //Arrays for the words and images
    let colors = [
      "blue", "darkgray", "gray", "green", "lightblue",
      "orange", "pink", "purple", "red", "red2", "white"
    ];

    //Create three groups, one for each word/image pair
    let groupOne = g.group(),
        groupTwo = g.group(),
        groupThree = g.group();

    //Add the groups to the `mixedScreen` and position them
    groupOne.x = 120;
    groupOne.y = 124;
    groupTwo.x = 220;
    groupTwo.y = 124;
    groupThree.x = 320;
    groupThree.y = 124;
    mixedScreen.add(groupOne, groupTwo, groupThree);

    //Add the groups to an array
    let displayGroups = [groupOne, groupTwo, groupThree]; 

    //Create a fade mask
    let fadeMask = g.rectangle(450, 200, "black", "none");
    fadeMask.setPosition(40, 60);
    mixedScreen.add(fadeMask);
    //fadeMask.alpha = 0.5;

    //Create text-image pairs
    let createPairs = group => {
        
        //Clear the previous selection
        group.children = [];

        //Text
        let randomText = colors[randomInt(0, colors.length - 1)];

        //4 possible random font sizes
        let fontSizes = [12, 16, 20, 26]; 
        let randomFontSize = fontSizes[randomInt(0, 3)];
        let textSprite = g.text(randomText, `${randomFontSize}px Futura`, "white");
        
        //Image
        let randomImage = colors[randomInt(0, colors.length - 1)];
        let imageSprite = g.sprite(`images/${randomImage}.png`); 

        //Add the sprites to the group
        group.add(imageSprite, textSprite);
        //group.putCenter(textSprite);

        //Choose to display either the text or the image
        if (Math.random() >= 0.5) {
            textSprite.visible = false;
            imageSprite.visible = true;  
        } else  {
            textSprite.visible = true;
            imageSprite.visible = false;  
        }
    }; 

    //Create random image-text pairs for each group
    displayGroups.forEach(group => {
        createPairs(group);
    });

    //The fade in/out animation
    //(This is started when the user presses the `mixed` button)
    fadeInOut = () => {
      let fadeInAnimation = g.fadeOut(fadeMask, 30);
      fadeInAnimation.onComplete = () => {
        let fadeOutAnimation = g.fadeIn(fadeMask, 30);
        fadeOutAnimation.onComplete = () => {
          displayGroups.forEach(group => {
             createPairs(group);
          });
          fadeInOut();
         };
      };
    };
    //fadeInOut();


    //Set the game state to play. Whatever
    //function you assign to Hexi's `state` property will be run by
    //Hexi in a loop. This makes game stage managment extremely
    //easy and efficient.
    g.state = play;
  }


  /*
  The event/game logic loop
  -----------
  */

  //The `play` function is called in a continuous loop, at whatever fps
  //(frames per second) value you set. (It's set to 30 in this demo.) 
  //This is the game logic loop (The render loop is run by Hexi 
  //in the background at the maximum fps
  //your system can handle.) You can pause Hexi's game loop at any time
  //with the `pause` method, and restart it with the `resume` method
  
  function play() {

    //Calculate the fps
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    
    //Display the `fps` in the `fpsMessage` text sprite.
    fpsMessage.content = `fps: ${fps}`;
  }
  