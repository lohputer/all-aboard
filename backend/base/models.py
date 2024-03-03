from django.db import models
from django.contrib.auth.models import User 

class BoardGame(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    desc = models.TextField()
    rules = models.TextField()
    publicity = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.creator} - {self.title}"


class Currency(models.Model):
    currencyType = models.TextField()
    currencyImage = models.ImageField(blank=True)
    currencyBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)


class BoardGameSpace(models.Model):
    spaceName = models.TextField()
    spaceColor = models.TextField(blank=True, null=True)
    spaceBoardID = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    spaceType = models.TextField()
    spaceValue = None

    def setPurpose(self, **kwargs):
        if self.spaceType == "Currency":
            self.spaceValue = {Currency.objects.get(
                currencyType=kwargs["currency"]): kwargs["score"]}
        elif self.spaceType == "Turn":
            self.spaceValue = kwargs["skip"]
        elif self.spaceType == "Movement":
            self.spaceValue = kwargs["spaces"]
