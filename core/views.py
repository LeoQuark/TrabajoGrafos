from django.shortcuts import render , HttpResponse

# Create your views here.

def home(request):
    return render(request,"core/home.html")

def grafos(request):
    return render(request,"core/grafos.html")

def nosotros(request):
    return render(request,"core/nosotros.html")