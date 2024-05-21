from django.db import models
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profilePic = models.ImageField(blank=True, null=True, upload_to="")
    desc = models.TextField()
    def __str__(self):
        return f"Profile of {self.user.username}"

class BoardGame(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    diceRoll = models.IntegerField()
    playerMin = models.IntegerField(null=True)
    playerMax = models.IntegerField(null=True)
    title = models.CharField(max_length=50)
    desc = models.TextField(default="", blank=True, null=True)
    rules = models.TextField(default="", blank=True, null=True)
    publicity = models.BooleanField(default=True)
    winGoal = models.JSONField(blank=True, null=True)
    winGoalType = models.TextField(default="", blank=True, null=True)
    def __str__(self):
        return f"{self.creator}: {self.title}"
    def setWinGoal(self, **kwargs):
        if self.winGoalType == "Currency":
            self.winGoal = {kwargs["currency"]: kwargs["score"]}
        elif self.winGoalType == "Space":
            self.winGoal = kwargs["space"]
        elif self.winGoalType == "Survive":
            self.winGoal = "Survive"
        elif self.winGoalType == "RoundCurrency":
            self.winGoal = kwargs["currency"]

class Currency(models.Model):
    currencyType = models.TextField()
    currencyImage = models.ImageField(blank=True, upload_to="")
    currencyBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    currencyDesc = models.TextField(default="", blank=True, null=True)
    def __str__(self):
        return f"{self.currencyBoardID} - {self.currencyType}"

class Item(models.Model):
    itemName = models.TextField()
    itemImage = models.ImageField(blank=True, upload_to="")
    itemPurpose = models.JSONField(blank=True, null=True)
    itemType = models.TextField(default="", blank=True, null=True)
    itemBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.itemBoardID} - {self.itemName}"
    
    def setItemPurpose(self, **kwargs):
        print(kwargs)
        if self.itemType == "multiplyCurrency" or self.itemType == "addCurrency":
            self.itemValue = {"chosen": kwargs["chosen"], 
                              "currency": kwargs["currency"], 
                              "value": kwargs["value"]}
        elif self.itemType == "moveSpaces":
            self.itemValue = {"chosen": kwargs["chosen"], "spaces": kwargs["spaces"], "space": kwargs["space"]}
        elif self.itemType == "steal":
            self.itemValue = {"chosen": kwargs["chosen"], "currency": kwargs["currency"], "item": kwargs["item"], "amount": kwargs["amount"]}
        elif self.itemType == "turn":
            self.itemValue = kwargs["turnBased"]
        else: 
            self.itemValue = kwargs["spaceType"]

class BoardGameSpace(models.Model):
    spaceName = models.TextField()
    spaceColor = models.TextField(blank=True, null=True)
    spaceImage = models.ImageField(blank=True, upload_to="")
    spaceBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    spaceDesc = models.TextField(default="", blank=True, null=True)
    spaceType = models.TextField(default="", blank=True, null=True)
    spaceValue = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.spaceBoardID} - {self.spaceName}"
    
    def setPurpose(self, **kwargs):
        print(kwargs)
        if self.spaceType == "Currency":
            self.spaceValue = {kwargs["currency"]: kwargs["score"]}
        elif self.spaceType == "Turn":
            self.spaceValue = kwargs["skip"]
        elif self.spaceType == "Movement":
            self.spaceValue = kwargs["spaces"]
        elif self.spaceType == "Start":
            self.spaceValue = "Start"
        elif self.spaceType == "Shop":
            self.spaceValue = kwargs["shopItems"]
        elif self.spaceType == "List":
            self.spaceValue = models.ArrayField(models.ForeignKey(BoardGame, on_delete=models.CASCADE))
        elif self.spaceType == "Gate":
            self.spaceValue = {"itemName": kwargs["name"],
                               "amount": kwargs["amount"]}
        else: 
            self.spaceValue = ""

class GameLayout(models.Model):
    layout = models.JSONField(blank=True, null=True)
    boardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.boardID} Layout"
    
class Room(models.Model):
    room_host = models.ForeignKey(User, on_delete=models.CASCADE)
    room_name = models.JSONField()
    boardUsed = models.ForeignKey(BoardGame, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.room_name}"