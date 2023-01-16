
# Game Programming F22 Project - Arena of Champions
## ✒️ Description

In this top-down arena fighting game, players take control of a Champion and use their Champion's abilities to fight monsters and other AI controlled Champions. The goal of this game is to defeat waves of monsters as well as show off the players skill when battling against another Champion. The players skill will be rewarded with experience points that can be used to upgrade their Champion's base statistics as well as their abilities. The Arena of Champions never ceases until the player is defeated, and once they are defeated, all of their base stats and ability stats are reset/reduced. As the player fights, the Arena's difficulty ramps up, which will keep the player constantly on their toes.

## 🕹 Gameplay
The player will start of in a Champion selection screen, where they can choose from a variety of Champions. There will be at least 2 different Champions to choose from if not more. The menu will also display information like, the Champion's base health, base speed and their abilities. This allows players to make an informative decision before jumping into the Arena.

Once the player enters the Arena, they will be able to control their Champion with `WASD` and aim their abilities with the mouse. Using `Q`, `E` or `Space`, depending on the ability, the player's Champion may cast abilities. These abilities may be aimed or not. For example, a Champion may have a projectile ability that must be aimed or they may have an ability that has an Area of Effect around the Champion.

Defeating monsters and Champions will give the player Experience Points that they may use in the Champion shop. In this shop, players are able to upgrade the base stats and abilities stats of the Champion. The shop will have a myriad of upgrades that affect things like Champion heath, healing, speed, etc. Upgrading these stats consumes the experience points. The cost of these stats will increase the higher level they are. As the game progresses, enemy Champion's become stronger as well.

In case the player needs to pause the battle for a long period of time, there will also be a saving and loading feature, which will save the exact state of the game. This will allow the player to take a break from the game, and jump right back into the Arena when they are ready.

This game is a single player experience with an AI that controls an enemy Champion. The game is played with `W` `A` `S` `D` as well as the `mouse` for aiming abilities and `Q` `E` and/or `Space` to cast abilities.

## 📃 Requirements

1. There will be a title screen to either play a new round, or load a round from file.
2. The player should be able to choose their Champion.
3. The player should be able to move around the Arena.
4. The player should be able to cast abilities.
5. The player should be able to aim abilities with the mouse if needed.
6. Monsters should be able to spawn.
7. Monsters should be able to deal damage to the Champion.
8. Enemy Champion should be able to spawn.
9. Enemy Champions should be able to cast abilities.
10. Monsters and Champions should grant the player experience points once defeated.
11. The player should be able to spend their experience points on upgrades in the shop.
12. The player should be able to save the game during the fight.
13. The player should be sent back to the title screen if defeated in battle.

## 🤖 State Diagram
![alt](./Project%20Proposal/images/aoc_global_state_diagram.png)

![alt](./Project%20Proposal/images/player_state_diagram.png)

![alt](./Project%20Proposal/images/ai_state_diagram.png)

Note: Monsters do not have AI, they will simply follow the player's Champion around until they die or kill the Champion.

## 🗺️ Class Diagram
![alt](./Project%20Proposal/images/aoc_class_diagram.png)

## 🧵 Wireframes
![alt](./Project%20Proposal/images/titlescreen_wireframe.jpg)
- Play will navigate the player to the Champion Select Screen when
- Load will load the round saved on disk and redirect to the Round Screen

![alt](./Project%20Proposal/images/champion_select_wireframe.jpg)
- Select will navigate the player to the Round Screen
- The arrow will move to the next Champion

![alt](./Project%20Proposal/images/round_wireframe.jpg)
- Abilities can be projectiles or area of effect

![alt](./Project%20Proposal/images/shop_wireframe.jpg)
- Clicking on the plus symbol will upgrade the statistic but consume the xp based on it's cost.

![alt](./Project%20Proposal/images/menu_wireframe.jpg)
- Selecting save will save the current game state to disk
- Selecting exit will not save the current game and redirect to the Title Screen

## 🎨 Assets
### 📐 Tileset: [Pixel Art Top Down - Basic by Cainos](https://cainos.itch.io/pixel-art-top-down-basic)

#### ⚔ Example of the Arena
![Alpha Version of Arena](./Project%20Proposal/images/simple%20arena.png)

This is a basic example of how an Arena would look like. There are two `spawns`, one player Champion spawn on the left, and one enemy Champion spwan on the right. This makes so that there is a distance between the two Champions. Monsters spawn `randomly` throughout the Arena. There will be collidable objects such as pillars as seen above.

Note: I slightly modified the tileset by Cainos in order for the walls to align.

### 🤺 Sprites
The first Champion's sprite created by [gikeota](https://gikeota.itch.io/samurai). Most sprites being used will be from itch.io and other sources. All credits will be given.

The first Champion is Noro.

![alt](./Project%20Proposal/images/noro_slash.gif)

Noro is a visitor in this unknown realm. Which means he must defend himself from the locals. Noro's first ability slashes forward, slicing up his enemies. Noro's second ability is a dash/blink. This ability is aimed by the mouse.

### ✏ Fonts
For fonts, a greek-roman font fits nicely with an Arena themed game. It also fits well with the tileset chosen. I was also inspired by God of War, and this font resembles the fonts used in those games. It is also still legible, which important especially in the shop:
- [CaeserDressing](https://www.1001freefonts.com/caesar-dressing.font)


### 🔊 Sounds
For the sounds in Arena of Champions, I will try to create my own sounds in the game using [JSFXR](https://sfxr.me/). If not I will be using copyrighted free music/sounds from [freesound.org](https://freesound.org/) and give attributes to their creators. There will be a soundtrack for the Title Screen, Round and Shop. There will also be sound effects for all abilities in the game.
