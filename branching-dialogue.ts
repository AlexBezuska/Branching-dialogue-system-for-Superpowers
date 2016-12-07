
let dialogue = {
   "default" : {
    speaker : "system",
    message : "I am error."
  },
  "owl-greeting" : {
    speaker : "owl",
    avatar: "Images/avatar-owl",
    avatarAnimation: "avatar-owl-talk",
    message : "Hello there bear.",
    next: "owl2"
  },
  "owl2" : {
    speaker : "owl",
    avatar: "Images/avatar-owl",
    avatarAnimation: "avatar-owl-talk",
    message : "Hello there bear. The winds have been \n blowing stronger than ever before...",
    next: "owl2-1"
  },
  "owl2-1" : {
    speaker : "owl",
    avatar: "Images/avatar-owl",
    avatarAnimation: "avatar-owl-talk",
    message : "Are you worried about the moths leaving?",
    choices: [
      { displayText: "I am...", next: "owl2-2" },
      { displayText: "Not at all", next: "owl2-3" }
    ],
  },
  "owl2-2" : {
    speaker : "owl",
    avatar: "Images/avatar-owl",
    avatarAnimation: "avatar-owl-talk",
    message : "Go to the luna tree in the north and see \n the moth queen for answers.",
    quest: "Visit Queen Luna to the north."
  },
  "owl2-3" : {
    speaker : "owl",
    avatar: "Images/avatar-owl",
    avatarAnimation: "avatar-owl-talk",
    message : "If you aren't worried then you aren't \n paying attention..."
  },
};


let dialogueBoxClear = false;
let dialogueBoxShow = false;
let dialogueBoxClosed = false;
let dialogueObject = "default";
let dialogueBoxContinueArrow = true;

function displayText(dialogueBox, dialogueObject){
  dialogueBox.setVisible(true);
  if (dialogueObject.avatar !== undefined){
    dialogueBox.getChild("avatar").setVisible(true);
    if (dialogueBox.getChild("avatar").spriteRenderer.getSprite().name != dialogueObject.avatar.replace("Images/", "")) {
      dialogueBox.getChild("avatar").spriteRenderer.setSprite(dialogueObject.avatar);
    }
    if (dialogueBox.getChild("avatar").spriteRenderer.getAnimation() != dialogueObject.avatarAnimation) {
     dialogueBox.getChild("avatar").spriteRenderer.setAnimation(dialogueObject.avatarAnimation);
    }
  } else {
    dialogueBox.getChild("avatar").setVisible(false);
  }
  dialogueBox.getChild("dialogueBoxText").textRenderer.setText(dialogueObject.speaker + ': "' + dialogueObject.message + '"');
  if (dialogueObject.choices !== undefined){
    playerFreeze = true;
    dialogueBox.getChild("option0").setVisible(true);
    dialogueBox.getChild("option1").setVisible(true);
    dialogueBox.getChild("option0").textRenderer.setText(dialogueObject.choices[0].displayText);
    dialogueBox.getChild("option1").textRenderer.setText(dialogueObject.choices[1].displayText);
    dialogueBox.getChild("continueArrow").setVisible(false);
    dialogueBox.getChild("close").setVisible(false);
  } else if (dialogueObject.next !== undefined){
    playerFreeze = false;
    dialogueBox.getChild("continueArrow").setVisible(true);
    dialogueBox.getChild("close").setVisible(false);
    dialogueBox.getChild("option0").setVisible(false);
    dialogueBox.getChild("option1").setVisible(false);
  } else {
    playerFreeze = false;
    dialogueBox.getChild("close").setVisible(true);
    dialogueBox.getChild("continueArrow").setVisible(false);
    dialogueBox.getChild("option0").setVisible(false);
    dialogueBox.getChild("option1").setVisible(false);
  }
  
}

let highlightColor = new Sup.Color(0x7777ff);
let white = new Sup.Color(0xffffff);

class DialoguesystemBehavior extends Sup.Behavior {
  selectedOption = 0;

  update() {
    
    let dialogueBox = Sup.getActor("dialogueBox");
    
    if (dialogueBoxShow && !dialogueBoxClosed){
      displayText(dialogueBox, dialogue[dialogueObject]);
    } else {
      dialogueBox.setVisible(false);
      dialogueBox.getChild("continueArrow").setVisible(false);
    }
    
    if (dialogueBoxClear){
      dialogueBoxShow = false;
    }
    
    if (dialogueBox.getChild("option0").getVisible()){
      if (this.selectedOption === 0){
        dialogueBox.getChild("option0").textRenderer.setColor(highlightColor);
        dialogueBox.getChild("option1").textRenderer.setColor(white);
        if(Sup.Input.wasKeyJustPressed("RIGHT")) {
          Sup.Audio.playSound("sounds/option-select");
          this.selectedOption = 1; 
        }
      }
       if (this.selectedOption === 1){
         dialogueBox.getChild("option0").textRenderer.setColor(white);
        dialogueBox.getChild("option1").textRenderer.setColor(highlightColor);
         if(Sup.Input.wasKeyJustPressed("LEFT")){ 
           Sup.Audio.playSound("sounds/option-select");
           this.selectedOption = 0; 
         }
      }
    }
    
      if(dialogueBox.getVisible() && Sup.Input.wasKeyJustPressed("SPACE")){
        
        // multiple
        if (dialogueBox.getChild("close").getVisible()){
          Sup.Audio.playSound("sounds/close");
          dialogueBoxClosed = true;
          dialogueBoxClear = true;
        }
        
        //single
        else if (dialogueBox.getChild("continueArrow").getVisible()){
          Sup.Audio.playSound("sounds/select");
          var current = dialogueObject;
          dialogueObject = dialogue[current].next;
        } 
        
        //choices
        else if (dialogueBox.getChild("option0").getVisible()){
          Sup.Audio.playSound("sounds/select");
          var current = dialogueObject;
          dialogueObject = dialogue[current].choices[this.selectedOption].next;
        } 
        
        //error
        else {
         Sup.log("some sort of error!"); 
        }
      }
    }
    
  }

Sup.registerBehavior(DialoguesystemBehavior);
