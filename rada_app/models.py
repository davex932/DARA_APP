from django.db import models
from django.utils.timesince import timesince
from django.contrib.auth.models import User

# Create your models here.

class POST(models.Model):
    #user= models.ForeignKey(User, on_delete= models.CASCADE, null=True)
    content= models.TextField()
    category= models.CharField(max_length= 50, default= 'General')
    created_at= models.DateTimeField(auto_now_add=True)
    images= models.ImageField(upload_to= 'posts/', null=True, blank=True)
    
    def times_ago(self):
        return timesince(self.created_at)+' ago'


class COMMENT(models.Model):
    post= models.ForeignKey(POST, on_delete= models.CASCADE)
    #user= models.ForeignKey(User, on_delete=models.CASCADE)
    content=models.TextField()
    comment_at= models.DateTimeField(auto_now_add=True)

    def commented_times_ago(self):
        return timesince(self.comment_at)+' ago'

class LIKE(models.Model):
    post= models.ForeignKey(POST, on_delete=models.CASCADE)
    #user= models.ForeignKey(User, on_delete=models.CASCADE)
    liked_at= models.DateTimeField(auto_now= True)
