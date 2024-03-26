from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import UserSerializer, CurrencySerializer, SpaceSerializer, BoardGameSerializer, LayoutSerializer, UserProfileSerializer
from django.contrib.auth.models import User
import json
from base.models import *
from rest_framework import status

class UserTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token
    
class ObtainTokenView(TokenObtainPairView):
    serializer_class = UserTokenSerializer
    
@api_view(["GET"])
def get_routes(request):
   routes = [
       "/api/token",
       "/api/token/refresh"
   ]
   return Response(routes)


@api_view(["POST"])
def register_user(request):
    if request.method == "POST":
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            profile_data = {
                "user": user.id, 
                "profilePic": None,
                "desc": "Hi! I am " + user.username + "!"
            }
            profile_serializer = UserProfileSerializer(data=profile_data)
            if profile_serializer.is_valid():
                profile_serializer.save()
                return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def createGame(request):
    if request.method == "POST":
        user_data = json.loads(request.data["user"])
        username = user_data["username"]
        publicity = request.data["publicity"].lower() == "true"
        new_board = BoardGame.objects.create(
            creator=User.objects.get(username=username),
            title=request.data["title"],
            desc=request.data["desc"],
            rules=request.data["rules"],
            publicity=publicity,
            diceRoll=request.data["diceRoll"],
        )
        currencies_data = json.loads(request.data.get("currencies[]"))
        currency_images = request.FILES.getlist("currencyImages[]")
        spaces_data = json.loads(request.data.get("spaces", "[]"))
        spaces_images = request.FILES.getlist("spaceImages[]")
        for currency_data, currency_image in zip(currencies_data, currency_images):
            currency_data["currencyBoardID"] = new_board.pk
            currency_data['currencyImage'] = currency_image
            serializer = CurrencySerializer(data=currency_data)
            if not serializer.is_valid():
                return Response({"message": "Failed to create board game.", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
        for space_data, space_image in zip(spaces_data, spaces_images):
            space_data["spaceBoardID"] = new_board.pk
            space_data["spaceImage"] = space_image
            print("Space Data: \n")
            print(space_data)
            serializer = SpaceSerializer(data=space_data)
            if not serializer.is_valid():
                return Response({"message": "Failed to create board game.", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
        layout_data = {"layout": request.data["layout"]}
        layout_data["boardID"] = new_board.pk
        serializer = LayoutSerializer(data=layout_data)
        if not serializer.is_valid():
            return Response({"message": "Failed to create board game.", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()
        new_board.save()
        return Response({"message": "Board game created successfully."}, status=status.HTTP_201_CREATED)

@api_view(["GET"])
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
        return Response({"boards": serializer.data, "currencies": curr_serializer.data, "spaces": space_serializer.data, "layouts": layout_serializer.data})

@api_view(["POST"])
def retrieveProfile(request):
    if request.method == "POST":
        profile = UserProfile.objects.get(
            user=User.objects.get(username=request.data["user"]))
        serializer = UserProfileSerializer(profile)
        print(serializer.data)
        board_games = BoardGame.objects.filter(
            creator = User.objects.get(username=request.data["user"]))
        gamesSerializer = BoardGameSerializer(board_games, many=True)
        profileData = serializer.data
        profileData['user'] = User.objects.get(pk=profileData['user']).username
        return Response({"profile": profileData, "games": gamesSerializer.data})

@api_view(["POST"])
def editProfile(request):
    if request.method == "POST":
        print(request.data, request.FILES)
        profile = UserProfile.objects.get(
            user=User.objects.get(username=json.loads(request.data["user"])).pk
        )
        profile.profilePic=request.FILES.get("pic")
        print(profile.profilePic)
        profile.desc=json.loads(request.data["desc"])
        profile.save()
        serializer = UserProfileSerializer(profile)
        board_games = BoardGame.objects.filter(
            creator=User.objects.get(username=json.loads(request.data["user"])))
        gamesSerializer = BoardGameSerializer(board_games, many=True)
        profileData = serializer.data
        profileData['user'] = User.objects.get(pk=profileData['user']).username
        return Response({"profile": profileData, "games": gamesSerializer.data})
