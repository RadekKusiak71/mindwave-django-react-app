from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Profile,Post,Like,FriendRequest,Comment
from .serializers import ProfileSerializer, RegisterSerializer,PostSerializer,LikeSerializer,FriendRequestSerializer,CommentSerializer
from datetime import datetime
from rest_framework.decorators import action




class CommentsViewSet(viewsets.ViewSet):
    def list(self,request):
        queryset = Comment.objects.all()
        serializer = CommentSerializer(queryset,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def retrieve(self,request,pk=None):
        try:
            comment = Comment.objects.get(id=pk)
            serializer = CommentSerializer(comment,many=False)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({'detail':'Comment not found'},status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def create(self,request):
        serializer = CommentSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail":"Comment created"},status=status.HTTP_201_CREATED)
        except:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
class FriendsRequestsViewSet(viewsets.ViewSet):
    def list(self,request):
        queryset = FriendRequest.objects.all()
        serializer = FriendRequestSerializer(queryset,many=True)
        return Response(serializer.data,status.HTTP_200_OK)
    
    def retrieve(self,request,pk=None):
        try:
            request = FriendRequest.objects.get(id=pk)
            serializer = FriendRequestSerializer(request,many=False)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({'detail':'No user were found'},status=status.HTTP_404_NOT_FOUND)    
        except:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def create(self,request):
        serializer = FriendRequestSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail":"Request sent properlly"},status=status.HTTP_201_CREATED)
        except:
            return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
    
    # Method to look if friend request already exists ( accept a profiles id)
    @action(detail=False,methods=['POST'],url_path='check')
    def check_if_exists(self,request):
        data = request.data
        try:
            # Checking if other user didn't already send a request
            request = FriendRequest.objects.filter(sender=data['receiver'],receiver=data['sender'])
            if request.exists():
                serialized = FriendRequestSerializer(request.first(),many=False)
                return Response({'exists':True,'request_data':serialized.data},status=status.HTTP_200_OK)
            
            # Looking for your request
            request2 = FriendRequest.objects.filter(sender=data['sender'],receiver=data['receiver'])
            if request2.exists():
                 serialized=FriendRequestSerializer(request2.first(),many=False)
                 return Response({'exists':True,'request_data':serialized.data},status=status.HTTP_200_OK)
            return Response({'exists':False},status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return Response({'detail':str(e)},status=status.HTTP_400_BAD_REQUEST)
        
    # Method provide accepting friends request
    @action(detail=False,methods=['POST'],url_path='accept')
    def accept_friend_request(self,request):
        data = request.data
        try:
            request = FriendRequest.objects.get(id=data['request_id'])
            receiver = Profile.objects.get(id=request.receiver.id)
            sender = Profile.objects.get(id=request.sender.id)
            sender.friends.add(receiver)
            sender.save()
            request.delete()
            return Response({'detail':'Friend request accepted'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)},status=status.HTTP_400_BAD_REQUEST)
        

    def destroy(self,request,pk=None):
        try:
            request = FriendRequest.objects.get(id=pk)
            request.delete()
            return Response({'detail':'Request deleted properly'},status=status.HTTP_200_OK)
        except:
            return Response({'detail':'Request not found'},status=status.HTTP_404_NOT_FOUND)


    # Method provide removing friends funcionality
    @action(detail=False,methods=['DELETE'],url_path='remove')
    def remove_friend(self,request):
        data = request.data
        try:
            receiver = Profile.objects.get(id=data['receiver_id'])
            sender = Profile.objects.get(id=data['sender_id'])

            sender.friends.remove(receiver)
            sender.save()
            return Response({'detail':'Friend removed successfully'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)},status=status.HTTP_400_BAD_REQUEST)



class ProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Profile.objects.all()
        serializer_data = ProfileSerializer(queryset, many=True).data
        return Response(serializer_data, status=status.HTTP_200_OK)


    # Method providing fetching a user friend requests that someone send him over
    @action(detail=False,methods=['GET'],url_path=('(?P<username>[^/.]+)/requests'))
    def requests_list(self,request,username=None):
        try:
            profile = Profile.objects.get(user__username=username)
            queryset = FriendRequest.objects.filter(receiver=profile)
            if(queryset):
                serializer = FriendRequestSerializer(queryset,many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response({"detail":"No friends requests found"},status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    # Method providing retrieving users by username
    @action(detail=False, methods=['GET'], url_path='username/(?P<username>[^/.]+)')
    def search_by_username(self,request,username=None):
        queryset = Profile.objects.filter(user__username__contains=username)
        serializer = ProfileSerializer(queryset,many=True)
        try:
            if queryset.exists():
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response({"detail":'No user were found'},status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        print(request.data)
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
    @action(detail=False, methods=['GET'], url_path='daily')
    def get_daily_posts(self, request):
        active_user_profile = Profile.objects.get(user=request.user)
        if not active_user_profile.check_if_posted():
            return Response({"detail": "To see other users' posts, you have to post something"}, status=status.HTTP_200_OK)

        set_date = datetime.today().date()
        todays_posts = Post.objects.filter(profile__friends=active_user_profile, created_date__date=set_date)
        
        # Pass the user to the serializer context to check if the user has liked each post
        serializer_context = {'user': request.user}
        serializer_data = PostSerializer(todays_posts, many=True, context=serializer_context).data

        return Response(serializer_data, status=status.HTTP_200_OK)
    
    @action(detail=False,methods=['GET'],url_path='(?P<post_id>[^/.]+)/comments')
    def post_comments(self,request,post_id=None):
        post = Post.objects.get(id=post_id)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    # Method providing liking and unliking post
    @action(detail=True,methods=['POST'],url_path='like')
    def post_reaction(self,request,pk=None):
        user = request.user
        post = Post.objects.get(id=pk)
        profile = Profile.objects.get(user__id=user.id)
        post_data = {
            "post":post.id,
            "profile":profile.id
        }
        if Like.objects.filter(post=post,profile=profile).exists():
            Like.objects.get(post=post,profile=profile).delete()
            return Response({"detail": "Reacted successfully.","posts_likes":post.get_posts_likes_count()}, status=status.HTTP_201_CREATED)
        
        try:
            serializer = LikeSerializer(data=post_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": "Reacted successfully.","posts_likes":post.get_posts_likes_count()}, status=status.HTTP_201_CREATED)
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
        serializer_context = {'user': request.user}
        serializer_data = PostSerializer(post,context=serializer_context).data
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