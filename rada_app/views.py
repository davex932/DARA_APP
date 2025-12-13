from django.db import IntegrityError
from django.shortcuts import redirect, render

from .models import POST, COMMENT, LIKE, User
# Create your views here.

def register(request):
    if request.method== 'POST':
        name= request.POST.get('name')
        email= request.POST.get('email')
        password1= request.POST.get('password1')
        password2= request.POST.get('password2')
        if password1== password2 and User.objects.filter(email=email)==False:
            User.objects.create(username= name, email= email, password= password1)
            user= User.objects.all()
            return redirect('home')
        else:
            return render(request,'register.html', {'Success': True})
    return render(request,'register.html')

def login(request):
    if request.method=='POST':
        email= request.POST.get('email')
        password= request.POST.get('password')
        try:
            user= User.objects.get(email=email, password=password)
            return redirect('home')
        except User.DoesNotExist:
            return render(request, 'login.html', {'invalid':True})
    return render(request, 'login.html')

def home(request):
    if request.method=='POST':
        content= request.POST.get('content')
        id_post= request.POST.get('post_id')
        post= POST.objects.get(id= id_post)
        COMMENT.objects.create(post= post, content= content)
    post= POST.objects.all()
    posts= {'posts': post}
    return render(request, 'home.html', posts)

def upload(request):
    if request.method == 'POST':
            content = request.POST.get('content')
            category = request.POST.get('category')
            images = request.FILES.get('file')           
            POST.objects.create(content=content, category=category, images=images)
            return redirect('home') 
    return render(request, 'upload.html')

def profile(request):
    return render(request, 'profile.html')

def explore(request):
    return render(request, 'explore.html')

            
