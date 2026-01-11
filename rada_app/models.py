from django.db import models
from django.utils.timesince import timesince
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Create your models here.

def validate_image(fieldfile_obj):
    if not fieldfile_obj.name.lower().endswith(('.png','jpg','jpeg','.gif','.mp4')):
        raise ValidationError("Unsupported file extension.")
class PROFILE(models.Model):
    user= models.OneToOneField(User, on_delete= models.CASCADE)
    profile_picture= models.ImageField(upload_to= 'profiles/', null=True, blank=True)
    bio= models.CharField(max_length= 500, blank=True)

class POST(models.Model):
    profile= models.ForeignKey(PROFILE, on_delete= models.CASCADE, null=True)
    content= models.TextField()
    category= models.CharField(max_length= 50, default= 'General')
    created_at= models.DateTimeField(auto_now_add=True)
    images= models.FileField(upload_to= 'posts/', null=True, blank=True, validators=[validate_image])
    
    def times_ago(self):
        return timesince(self.created_at)+' ago'


class COMMENT(models.Model):
    post= models.ForeignKey(POST, on_delete= models.CASCADE, related_name='comments')
    auteur= models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content=models.TextField()
    comment_at= models.DateTimeField(auto_now_add=True)

    def commented_times_ago(self):
        return timesince(self.comment_at)+' ago'

class LIKE(models.Model):
    post= models.ForeignKey(POST, on_delete=models.CASCADE)
    user= models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together= ('post', 'user')
