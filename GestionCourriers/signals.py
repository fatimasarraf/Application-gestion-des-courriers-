from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CourrierDepart, Transfer

@receiver(post_save, sender=CourrierDepart)
def update_transfer_from_courrier_depart(sender, instance, **kwargs):
    transfers = Transfer.objects.filter(courrier_depart=instance)
    for transfer in transfers:
        transfer.is_read = instance.is_read
        transfer.read_at = instance.read_at
        transfer.save()
