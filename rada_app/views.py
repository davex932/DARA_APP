from django.shortcuts import render

from .models import POST, COMMENT, LIKE, User
# Create your views here.

def register(request):
    if request.method== 'POST':
        name= request.POST.get('name')
        email= request.POST.get('email')
        password1= request.POST.get('password1')
        password2= request.POST.get('password2')
        if password1== password2:
            User.objects.create(username= name, email= email, password= password1)
            user= User.objects.all()
            return render(request,'login.html')
        else:
            return render(request,'register.html', {'Success': True})
    return render(request,'register.html')

def login(request):
    if request.method=='POST':
        email= request.POST.get('email')
        password= request.POST.get('password')
        try:
            user= User.objects.get(email=email, password=password)
            return render(request, 'home.html,')
        except User.DoesNotExist:
            return render(request, 'login.html', {'invalid':True})
    return render(request, 'login.html')

def home(request):
    return render(request, 'home.html')

def upload(request):
    return render(request, 'upload.html')

            
