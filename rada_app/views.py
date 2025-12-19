from django.db import IntegrityError
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .models import POST, COMMENT, LIKE, User
# Create your views here.

def register_user(request):
    if request.method== 'POST':
        name= request.POST.get('name')
        email= request.POST.get('email')
        password1= request.POST.get('password1')
        password2= request.POST.get('password2')

        if password1 != password2:
            return render(request, 'register.html', {'error': "Les mots de passe ne correspondent pas"})
        
        if User.objects.filter(email=email).exists():
            return render(request, 'register.html', {'error': "Un compte existe déjà pour cet e-mail"})
        
        user= User.objects.create_user(username=name, email=email, password=password1)
        login(request, user)
        return redirect('home')
    return render(request,'register.html')

def login_user(request):
    if request.method=='POST':
        email= request.POST.get('email')
        password= request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email).username
            user = authenticate(request, username=user_obj, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            
        except User.DoesNotExist:
            return render(request, 'login.html', {'invalid': True})
        
    return render(request, 'login.html')

def home(request):
    if request.method=='POST':
        content= request.POST.get('content')
        id_post= request.POST.get('post_id')
        post= POST.objects.get(id= id_post)
        user= request.user
        COMMENT.objects.create(auteur=user, post=post, content=content)
        return redirect('home')

    post= (
        POST.objects.select_related('user')
        .prefetch_related('comments__auteur')
    )
    posts= {'posts': post}
    return render(request, 'home.html', posts)

def upload(request):
    if request.method == 'POST':
            content = request.POST.get('content')
            category = request.POST.get('category')
            images = request.FILES.get('file') 
            user= request.user          
            POST.objects.create(user=user, content=content, category=category, images=images)
            return redirect('home') 
    
    return render(request, 'upload.html')

def profile(request):
    return render(request, 'profile.html')

def explore(request):
    return render(request, 'explore.html')

def logout_user(request):
    logout(request)
    redirect('login')

            
