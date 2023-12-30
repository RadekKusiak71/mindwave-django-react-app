from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Profile,Post,Like
from .serializers import ProfileSerializer, RegisterSerializer,PostSerializer,LikeSerializer
from datetime import datetime
from rest_framework.decorators import action

class ProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Profile.objects.all()
        serializer_data = ProfileSerializer(queryset, many=True).data
        return Response(serializer_data, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        queryset = Profile.objects.all()
        profile = get_object_or_404(queryset, pk=pk)
        serializer_data = ProfileSerializer(profile).data
        return Response(serializer_data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, pk=None):
        profile = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(profile, data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        profile = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            profile = get_object_or_404(Profile, pk=pk)
            profile.delete()
            return Response({"detail": "Profile deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class PostViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Post.objects.all()
        serializer_data = PostSerializer(queryset, many=True).data
        return Response(serializer_data, status=status.HTTP_200_OK)
   
    # Method providing fetching today posts only for users that are connected
    @action(detail=False,methods=['GET'],url_path='daily')
    def get_daily_posts(self,request):
        active_user_profile = Profile.objects.get(user=request.user)
        if not active_user_profile.check_if_posted():
            return Response({"detail":"Too see other users posts you have to post something"},status=status.HTTP_200_OK)
        set_date = datetime.today().date()
        todays_posts = Post.objects.filter(profile__friends = active_user_profile,created_date__date = set_date)
        serializer_data = PostSerializer(todays_posts, many=True).data
        return Response(serializer_data, status=status.HTTP_200_OK)
    
    # Method providing liking and unliking post
    @action(detail=True,methods=['POST'],url_path='like')
    def post_reaction(self,request,pk=None):
        post = Post.objects.get(id=pk)
        profile = Profile.objects.get(user__id=1)
        post_data = {
            "post":post.id,
            "profile":profile.id
        }
        if Like.objects.filter(post=post,profile=profile).exists():
            Like.objects.get(post=post,profile=profile).delete()
            return Response({"detail": "Reacted successfully."}, status=status.HTTP_201_CREATED)
        
        try:
            serializer = LikeSerializer(data=post_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": "Reacted successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        data  = request.data
        data['profile'] = Profile.objects.get(user=request.user).id
        serializer = PostSerializer(data=data)
        set_date = datetime.today().date()
        if Post.objects.filter(profile=data['profile'],created_date__date=set_date).exists():
            return Response({"detail": "You have already posted today."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": "Post created successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Post.objects.all()
        post = get_object_or_404(queryset, pk=pk)
        serializer_data = PostSerializer(post).data
        return Response(serializer_data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            post = get_object_or_404(Post, pk=pk)
            post.delete()
            return Response({"detail": "Post deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)