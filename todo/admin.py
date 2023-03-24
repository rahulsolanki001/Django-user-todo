from django.contrib import admin
from .models import User,Todo
# Register your models here.

class TodoAdmin(admin.ModelAdmin):
    pass

class UserAdmin(admin.ModelAdmin):
    pass

admin.site.register(User,UserAdmin)
admin.site.register(Todo,TodoAdmin)
