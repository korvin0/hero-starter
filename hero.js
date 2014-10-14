/* 

  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/#rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/

//TL;DR: If you are new, just uncomment the 'move' function that you think sounds like fun!
//       (and comment out all the other move functions)


// // The "Northerner"
// // This hero will walk North.  Always.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   return 'North';
// };

// // The "Blind Man"
// // This hero will walk in a random direction each turn.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   var choices = ['North', 'South', 'East', 'West'];
//   return choices[Math.floor(Math.random()*4)];
// };

// // The "Priest"
// // This hero will heal nearby friendly champions.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 60) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestTeamMember(gameData);
//   }
// };

// // The "Unwise Assassin"
// // This hero will attempt to kill the closest enemy hero. No matter what.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 30) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestEnemy(gameData);
//   }
// };

// // The "Careful Assassin"
// // This hero will attempt to kill the closest weaker enemy hero.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 50) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestWeakerEnemy(gameData);
//   }
// };

// // The "Safe Diamond Miner"
//var move = function(gameData, helpers) {
  //var myHero = gameData.activeHero;

  ////Get stats on the nearest health well
  //var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
    //if (boardTile.type === 'HealthWell') {
      //return true;
    //}
  //});
  //var distanceToHealthWell = healthWellStats.distance;
  //var directionToHealthWell = healthWellStats.direction;
  

  //if (myHero.health < 40) {
    ////Heal no matter what if low health
    //return directionToHealthWell;
  //} else if (myHero.health < 100 && distanceToHealthWell === 1) {
    ////Heal if you aren't full health and are close to a health well already
    //return directionToHealthWell;
  //} else {
    ////If healthy, go capture a diamond mine!
    //return helpers.findNearestNonTeamDiamondMine(gameData);
  //}
//};

// // The "Selfish Diamond Miner"
// // This hero will attempt to capture diamond mines (even those owned by teammates).
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });

//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestUnownedDiamondMine(gameData);
//   }
// };

// // The "Coward"
// // This hero will try really hard not to die.
// var move = function(gameData, helpers) {
//   return helpers.findNearestHealthWell(gameData);
// }

// The korvin0 hero
var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;
  var nearest;
  var variants = [];

  nearest = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
    if (tile.type === 'Unoccupied' && tile.subType === 'Bones') {
      //console.log('bones move');
      return true;
    }
  });
  if (nearest !== false && !helpers.AreThereEnemiesAround(gameData, nearest.coords[0], nearest.coords[1]) || myHero.health > 30)
  {
    nearest.tp = 'bones';
    variants.push(nearest);
  }
  
  nearest = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
    if (tile.type === 'DiamondMine' && (!tile.owner || tile.owner.id != myHero.id) && myHero.health>20) {
      //console.log('diamond move');
      return true;
    }
  });
  nearest.tp = 'diamond';
  variants.push(nearest);
  
  nearest = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
    if (tile.type === 'Hero' && tile.team !== myHero.team && myHero.health>20) {
      //console.log('enemy move');
      return true;
    }
  });
  nearest.tp = 'enemy';
  variants.push(nearest);
  
  nearest = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
    if (tile.type === 'HealthWell' && myHero.health<100) {
      //console.log('health move');
      return true;
    }
  });
  nearest.tp = 'health';
  variants.push(nearest);
  
  nearest = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
    if (tile.type === 'Hero' && tile.team === myHero.team) {
      //console.log('friend move');
      return true;
    }
  });
  nearest.tp = 'friend';
  variants.push(nearest);
  
  var min;
  var min_distance;
  while (variants.length > 0)
  {
    min_distance = 1000;
    for (var i in variants)
    {
      if (variants[i] == null) continue;
      if (variants[i].distance < min_distance) {
        min = i;
        min_distance = variants[i].distance;
      }
    }
    if (variants[min] !== undefined)
    {
      //console.log('select '+variants[min].tp+'. Distance '+variants[min].distance+ '. Coords: '+variants[min].coords[0]+'x'+variants[min].coords[1]);
      switch (variants[min].direction)
      {
        case 'North':
          if (helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop-1, myHero.distanceFromLeft) && !helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop, myHero.distanceFromLeft) && myHero.health <= 30) variants[min] = null;
          break;
        case 'East':
          if (helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop, myHero.distanceFromLeft+1) && !helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop, myHero.distanceFromLeft) && myHero.health <= 30) variants[min] = null;
          break;
        case 'South':
          if (helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop+1, myHero.distanceFromLeft) && !helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop-1, myHero.distanceFromLeft) && myHero.health <= 30) variants[min] = null;
          break;
        case 'West':
          if (helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop, myHero.distanceFromLeft-1) && !helpers.AreThereEnemiesAround(gameData, myHero.distanceFromTop-1, myHero.distanceFromLeft) && myHero.health <= 30) variants[min] = null;
          break;
      }

      
      if (variants[min] != null) return variants[min].direction;
    }
  }
  
};


// Export the move function here
module.exports = move;
