from django.contrib import admin
from .models import Profile,Post,FriendRequest,Like,Comment


admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(FriendRequest)
admin.site.register(Like)
admin.site.register(Comment)
