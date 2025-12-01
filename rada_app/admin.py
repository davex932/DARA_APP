from django.contrib import admin
from .models import POST,COMMENT,LIKE,User

# Register your models here.
admin.site.register(POST)
admin.site.register(COMMENT)
admin.site.register(LIKE)
admin.site.register(USer)