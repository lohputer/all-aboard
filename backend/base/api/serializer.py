from rest_framework import serializers
from base.models import *
from django.contrib.auth.models import User
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["user", "profilePic", "desc"]
        extra_kwargs = {
            "profilePic": {"required": False, "allow_null": True, "default": None}
        }
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CurrencySerializer(serializers.ModelSerializer):
    currencyBoardID = serializers.PrimaryKeyRelatedField(
        queryset=BoardGame.objects.all())
    class Meta:
        model = Currency
        fields = ["currencyType", "currencyImage", "currencyDesc", "currencyBoardID"]
        extra_kwargs = {
            "currencyImage": {"required": False, "allow_null": True, "default": None},
            "currencyDesc": {"required": False, "allow_null": True, "default": ""},
        }
    
    def create(self, validated_data):
        currency = Currency.objects.create(**validated_data)
        currency.save()
        return currency

class SpaceSerializer(serializers.ModelSerializer):
    spaceBoardID = serializers.PrimaryKeyRelatedField(queryset=BoardGame.objects.all())
    class Meta:
        model = BoardGameSpace
        fields = ["spaceName", "spaceColor", "spaceImage", "spaceDesc", "spaceType", "spaceValue", "spaceBoardID"]
        extra_kwargs = {
            "spaceColor": {"required": False, "allow_null": True, "default": None},
            "spaceImage": {"required": False, "allow_null": True, "default": None},
            "spaceDesc": {"required": False, "allow_null": True, "default": ""},
        }
    
    def create(self, validated_data):
        space = BoardGameSpace.objects.create(**validated_data)
        space.save()
        print(f"\n woah a {space}")
        if space.spaceType == "Currency":
            space.setPurpose(currency=space.spaceValue[0], score=space.spaceValue[1])
        elif space.spaceType == "Turn":
            space.setPurpose(skip=space.spaceValue)
        elif space.spaceType == "Movement":
            space.setPurpose(spaces=space.spaceValue)
        elif space.spaceType == "Start":
            space.spaceValue = "Start"
        else:
            space.spaceValue = ""
        return space

class LayoutSerializer(serializers.ModelSerializer):
    boardID = serializers.PrimaryKeyRelatedField(queryset=BoardGame.objects.all())
    class Meta:
        model = GameLayout
        fields = ["boardID", "layout"]

class BoardGameSerializer(serializers.ModelSerializer):
    currencies = CurrencySerializer(many=True, read_only=True)
    spaces = SpaceSerializer(many=True, read_only=True)
    layouts = LayoutSerializer(many=True, read_only=True)
    class Meta:
        model = BoardGame
        fields = ["title", "desc", "rules", "publicity", "spaces", "currencies", "layouts", "creator", "id", "diceRoll"]
    
    creator = serializers.SerializerMethodField()
    def get_creator(self, obj):
        return obj.creator.username