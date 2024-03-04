from rest_framework import serializers
from base.models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CurrencySerializer(serializers.ModelSerializer):
    currencyBoardID = serializers.PrimaryKeyRelatedField(
        queryset=BoardGame.objects.all())
    class Meta:
        model = Currency
        fields = ['currencyType', 'currencyImage', 'currencyBoardID']
        extra_kwargs = {
            'currencyImage': {'required': False, 'allow_null': True, 'default': None}
        }
    
    def create(self, validated_data):
        print(validated_data)
        currency = Currency.objects.create(**validated_data)
        return currency

class SpaceSerializer(serializers.ModelSerializer):
    spaceBoardID = serializers.PrimaryKeyRelatedField(
        queryset=BoardGame.objects.all())
    class Meta:
        model = BoardGameSpace
        fields = ['spaceName', 'spaceColor', 'spaceType', 'spaceValue', 'spaceBoardID']
        extra_kwargs = {
            'spaceColor': {'required': False, 'allow_null': True, 'default': None}
        }
    
    def create(self, validated_data):
        space = BoardGameSpace.objects.create(**validated_data)
        if space.spaceType == "Currency":
            print(space, validated_data, space.spaceValue)
            space.setPurpose(
                currency=space.spaceValue[0], score=space.spaceValue[1])
        elif space.spaceType == "Turn":
            space.setPurpose(skip=space.spaceValue)
        elif space.spaceType == "Movement":
            space.setPurpose(spaces=space.spaceValue)
        else:
            space.spaceValue = ""
        return space
        
class BoardGameSerializer(serializers.ModelSerializer):
    currencies = CurrencySerializer(many=True)
    spaces = SpaceSerializer(many=True)
    class Meta:
        model = BoardGame
        fields = '__all__'