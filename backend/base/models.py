from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profilePic = models.ImageField(blank=True, null=True, upload_to="")
    desc = models.TextField()

    def __str__(self):
        return f"Profile of {self.user.username}"

class BoardGame(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    diceRoll = models.IntegerField()
    title = models.CharField(max_length=50)
    desc = models.TextField()
    rules = models.TextField()
    publicity = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.creator}: {self.title}"

class Currency(models.Model):
    currencyType = models.TextField()
    currencyImage = models.ImageField(blank=True, upload_to="")
    currencyBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    currencyDesc = models.TextField()
    def __str__(self):
        return f"{self.currencyBoardID} - {self.currencyType}"

class BoardGameSpace(models.Model):
    spaceName = models.TextField()
    spaceColor = models.TextField(blank=True, null=True)
    spaceImage = models.ImageField(blank=True, upload_to="")
    spaceBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    spaceDesc = models.TextField()
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
        else: 
            self.spaceValue = ""

class GameLayout(models.Model):
    layout = models.JSONField(blank=True, null=True)
    boardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.boardID} Layout"
