# Foundry Family Feud

This module allows you to run a family feud style game through Foundry.

###Create Questions

To start, run the Question Editor macro to open the Question Editor. Question data is saved in journals. You are free to use whatever journal you want and can have the data spread across multiple journals. Each question is saved to a different page. Fair warning, I didn't bother to put in any guard rails here so be careful not to accidentally save over existing data.

###Generate a Board

On whatever scene you plan to use for the game, run the Generate Board macro. It will create and place all of the tiles and drawings required for the game to function. It creates it in the upper left corner of the scene, but you can adjust it by using the Relocate Board macro.

###Set Up a Question

To actually run the game, start by running the Board Controller macro to open the Board Controller. While on the scene that contains the board, click the Find Board button. Next, select the journal and page that contains the question data you would like to use and click the Load Question button. Finally, click the Reset Board button to set the board to the correct state. As the GM, things will look a bit cluttered due to the overlapping tiles and drawings, but everything will look good on the player side.

With everything set up, you're now able to run the game. Click the reveal and strike buttons as players answer questions. The score is automatically managed.

## Feedback

To report a bug, please open a new issue [in the tracker](https://github.com/ddbrown30/foundry-family-feud/issues).
