from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Profile,Comment,Post,Like,FriendRequest

class ProfileSerializer(serializers.ModelSerializer):
    posted_today = serializers.BooleanField(source='check_if_posted')
    username = serializers.CharField(source="user.username")
    class Meta:
        model= Profile
        fields = '__all__'
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model= Comment
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    profile_picture = serializers.CharField(source="profile.profile_picture",required=False)
    profile_username = serializers.CharField(source="profile.user.username",required=False)
    profile_first_name = serializers.CharField(source="profile.user.first_name",required=False)
    profile_last_name = serializers.CharField(source="profile.user.last_name",required=False)
    likes_count = serializers.IntegerField(source="get_posts_likes_count",required=False)
    comments_count = serializers.IntegerField(source="get_posts_comments_count",required=False)
    is_liked_by_user = serializers.SerializerMethodField()

    
    class Meta:
        model= Post
        fields = '__all__'

    def get_is_liked_by_user(self, obj):
        user = self.context.get('user')
        if user:
            return obj.is_liked_by_user(user)
        return False
    
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model= Like
        fields = '__all__'

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model= FriendRequest
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True,validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(required=True,write_only=True,validators=[validate_password])
    password2 = serializers.CharField(required=True,write_only=True,validators=[validate_password])

    class Meta:
        model=User
        fields = ('username','first_name','last_name','email','password','password2')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        # creating a profile for user in future *change it for signal
        Profile.objects.create(user=user)

        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['user_id'] = user.id
        token['user_profile_picture'] = cls.get_profile_data(user)

        return token

    def get_profile_data(user):
        profile = Profile.objects.get(user=user)
        return str(profile.profile_picture)