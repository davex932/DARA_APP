from django.db import models

# Create your models here.
class User(models.Model):
    username= models.CharField(max_length= 255)
    email= models.EmailField(max_length= 254)
    password= models.CharField(max_length= 20)
class POST(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    content= models.TextField()
    category= models.CharField(max_length= 50)
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
