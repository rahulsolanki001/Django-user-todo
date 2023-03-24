from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer,TodoSerializer
from rest_framework.response import Response
from .models import User,Todo
from rest_framework.exceptions import AuthenticationFailed,NotFound
import datetime,jwt
from rest_framework.decorators import api_view



# Create your views here.

class RegisterView(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "staus":201,
            "message":"user registered successfully",
            "data":serializer.data
        })

class LoginView(APIView):
    def post(self,request):
        email=request.data['email']
        password=request.data['password']
        user=User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("invalid email")
        
        if not user.check_password(password):
            raise AuthenticationFailed("incorrect password")
        
        payload={
            "id":user.id,
            'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes=60),
            'iat':datetime.datetime.utcnow()
        }

        token=jwt.encode(payload,'secret',algorithm='HS256')

        res=Response()

        res.set_cookie(key='jwt',value=token,httponly=True)
        res.data={
            "status":200,
            "message":"User logged in",
            "token":token,
        }

        return res


class DashboardView(APIView):
    def get(self,request):

        token=request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed("Unauthenticated!!...")
        
        try:
            payload=jwt.decode(token,'secret',algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!!...")
            
        user=User.objects.filter(id=payload['id']).first()
        serializer=UserSerializer(user)

        return Response({
            "status":200,
            "data":serializer.data
        })
    
class LogoutView(APIView):
    def post(self,request):
        res=Response()
        res.delete_cookie('jwt')
        res.data={
            "status":200,
            "message":"User logged out"
        }

        return res
    
class TodoGetView(APIView):
    def get(self,request):
        
        token=request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated...Login first!!")
        
        try:
            payload=jwt.decode(token,'secret',algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!!...")
        
        user=User.objects.filter(id=payload['id']).first()
        todos=Todo.objects.filter(user=user).order_by('created_at')
        serializer=TodoSerializer(todos,many=True)

        return Response({
            "status":200,
            "data":serializer.data
        })

class TodoPostView(APIView):
    def post(self,request):
        token=request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated....login First")
        
        try:
            payload=jwt.decode(token,'secret',algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated...")
        
        user=User.objects.filter(id=payload['id']).first()
        serializer=TodoSerializer(data=request.data,context={"user":user})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "status":201,
            "message":"todo created success!!!..",
            "data":serializer.data
        })
    
@api_view(['DELETE','GET','POST'])
def TodoDeleteView(request, id):
    token=request.COOKIES.get("jwt")

    if not token:
        raise AuthenticationFailed("Unauthenticated......login first")
        
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthemticated!....")
        
    user=User.objects.filter(id=payload['id']).first()
    todos=Todo.objects.filter(user=user).order_by('created_at')
    try:
        todo=todos.filter(id=id)
    except:
      raise NotFound("No such todo found..!!")
    todo.delete()
    return Response({
        "status":204,
        "message":"todo deleted successfully"
    })

@api_view(['PUT','PATCH','GET'])
def TodoUpdateView(request,id):
    token=request.COOKIES.get("jwt")

    if not token :
        raise AuthenticationFailed("Unauthenticated....login first")
    
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated...!!")
    
    user=User.objects.filter(id=payload['id']).first()
    todos=Todo.objects.filter(user=user)

    try:
        todo=todos.filter(id=id).first()
    except:
       raise NotFound("no such todo found..!!")
    serializer=TodoSerializer(todo,data=request.data,context={"user":user})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({
        "status":200,
        "message":"Todo updated successfully",
        "data":serializer.data
    })
