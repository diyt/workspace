var rosterData = {
    title: 'Players',
    players : [
        { name: 'Steph Curry',
          number: 30,
          position: 'PG'
        },
        { name: 'Kobe Bryant',
          number: 24,
          position: 'SG'
        },
        { name: 'Lebron James',
          number: 23,
          position: 'SF'
        },
        { name: 'Blake Griffin',
          number: 32,
          position: 'PF'
        },
        { name: 'DeMarcus Cousins',
          number: 15,
          position: 'C'
        }
    ],
    addplayer: function(player) {
      players.push(player);
    }
};



module.exports = rosterData;