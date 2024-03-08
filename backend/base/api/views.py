from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import UserSerializer, CurrencySerializer, SpaceSerializer, BoardGameSerializer, LayoutSerializer, ProfileSerializer
from django.contrib.auth.models import User
from base.models import *
from rest_framework import status

class UserTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
class ObtainTokenView(TokenObtainPairView):
    serializer_class = UserTokenSerializer
    
@api_view(['GET'])
def get_routes(request):
   routes = [
       '/api/token',
       '/api/token/refresh'
   ]
   return Response(routes)

@api_view(['POST'])
def register_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            serializer = ProfileSerializer(data={
                "user" : User.objects.get(username=request.data['username']).pk,
                "profilePic" : None,
                "desc" : f"Hi! This is {request.data['username']}!"
            })
            if not serializer.is_valid():
                return Response({'message': 'Failed to create profile.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()  
            return Response({'message': 'User registered successfully'}, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400) 

@api_view(['POST'])
def createGame(request):
    if request.method == "POST":
        new_board = BoardGame.objects.create(
            creator=User.objects.get(username=request.data["user"]["username"]),
            profile=UserProfile.objects.get(user=User.objects.get(username=request.data["user"]["username"])),
            title=request.data["title"],
            desc=request.data["desc"],
            rules=request.data["rules"],
            publicity=request.data["publicity"]
        )
        currencies_data = request.data.get("currencies", [])
        spaces_data = request.data.get("spaces", [])
        for currency_data in currencies_data:
            currency_data['currencyBoardID'] = new_board.pk
            print(currency_data)
            serializer = CurrencySerializer(data=currency_data)
            if not serializer.is_valid():
                return Response({'message': 'Failed to create board game.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
        for space_data in spaces_data:
            space_data['spaceBoardID'] = new_board.pk
            serializer = SpaceSerializer(data=space_data)
            if not serializer.is_valid():
                return Response({'message': 'Failed to create board game.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
        layout_data = {"layout": request.data["layout"]}
        layout_data["boardID"] = new_board.pk
        serializer = LayoutSerializer(data=layout_data)
        if not serializer.is_valid():
            return Response({'message': 'Failed to create board game.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()
        new_board.save()
        return Response({'message': 'Board game created successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def retrieveBoards(request):
    if request.method == "GET":
        board_games = BoardGame.objects.all()
        serializer = BoardGameSerializer(board_games, many=True)
        currencies = Currency.objects.all()
        curr_serializer = CurrencySerializer(currencies, many=True)
        spaces = BoardGameSpace.objects.all()
        space_serializer = SpaceSerializer(spaces, many=True)
        layouts = GameLayout.objects.all()
        layout_serializer = LayoutSerializer(layouts, many=True)
        return Response({'boards': serializer.data, 'currencies': curr_serializer.data, 'spaces': space_serializer.data, 'layouts': layout_serializer.data})

@api_view(['POST'])
def retrieveProfile(request):
    if request.method == "POST":
        profile = UserProfile.objects.get(
            user=User.objects.get(username=request.data['user']).pk)
        serializer = ProfileSerializer(profile)
        print(serializer.data)
        board_games = BoardGame.objects.filter(
            creator = User.objects.get(username=request.data['user']))
        gamesSerializer = BoardGameSerializer(board_games, many=True)
        return Response({'profile': serializer.data, 'games': gamesSerializer.data})

@api_view(['POST'])
def editProfile(request):
    if request.method == "POST":
        profile = UserProfile.objects.get(
            user=User.objects.get(username=request.data['user']).pk)
        serializer = ProfileSerializer(profile)
        return Response({'profile': serializer.data})