from django.contrib import admin
from .models import  TransferReason, User, CourrierDepart,  Service, ArchivedCourrier,Transfer, Departement, Suport, Courrier, Pole, Division

# Register your models here.

admin.site.register(TransferReason)
admin.site.register(User)
admin.site.register(CourrierDepart)
admin.site.register(Service)
admin.site.register(ArchivedCourrier)
admin.site.register(Transfer)
admin.site.register(Departement)
admin.site.register(Suport)
admin.site.register(Courrier)
admin.site.register(Pole)
admin.site.register(Division)




