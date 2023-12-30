from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator 
from datetime import datetime

# uploading function to make new folder for every user
def get_upload_location(instance, file_name):
    return f'{instance.user.username}/{file_name}'

class Profile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to=get_upload_location,
                                        validators=[FileExtensionValidator(['png','jpg','jpeg'])],
                                        null=True,blank=True)
    bio = models.CharField(max_length=255,blank=True,null=True)
    friends = models.ManyToManyField('self',blank=True)

    def __str__(self):
        return self.user.username
    
    #Method to check if user posted today
    def check_if_posted(self):
        today = datetime.today().date()
        todays_posts = self.post_set.filter(created_date__date=today)
        if todays_posts.exists():
            return True
        else:
            return False

class FriendRequest(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sender_profile')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='receiver_profile')
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Friend request from {self.sender.user.username} to {self.receiver.user.username}'

class Post(models.Model):
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    body = models.TextField(max_length=400)

    def __str__(self):
        return f'Post created by {self.profile.user.username} at {self.created_date}'

    def get_posts_likes_count(self):
        likes = Like.objects.filter(post=self).count()
        return likes
    
    def get_posts_comments_count(self):
        comments = Comment.objects.filter(post=self).count()
        return comments

class Like(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE)
    like_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Post with id {self.post.id} liked by {self.profile.user.username}'

class Comment(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE)
    body = models.TextField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Post with id {self.post.id} commented by {self.profile.user.username}'