from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class POST(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    content= models.TextField()
    created_at= models.DateTimeField(auto_now_add=True)
    file_path= models.CharField(max_length= 255, null= True)

class COMMENT(models.Model):
    post= models.ForeignKey(POST, on_delete= models.CASCADE)
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    content=models.TextField()
    comment_at= models.DateTimeField(auto_now_add=True)

class LIKE(models.Model):
    post= models.ForeignKey(POST, on_delete=models.CASCADE)
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    liked_at= models.DateTimeField(auto_now= True)
