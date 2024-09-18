from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from django.utils import timezone


class Departement(models.Model):
    """ ETABLISSEMENT_CHOICES = [
        ('École', 'École'),
        ('Faculté', 'Faculté'),
        ('Ministère', 'Ministère'),
        ('Prefecture', 'Prefecture'),
        ('Université', 'Université'),
        ('Province', 'Province'),
        ('Commune', 'Commune'),
        ('Institut', 'Institut'),
        
         
        
    ] """
    
    nom = models.CharField(max_length=255)
    ville = models.CharField(max_length=255, blank=True, null=True)
    telephone_fixe = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    """ etablissement_type = models.CharField(max_length=50, choices=ETABLISSEMENT_CHOICES) """
    etablissement_type = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nom} ({self.etablissement_type})"


class Service(models.Model):
    service_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    
    chief = models.OneToOneField('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='chief_of_service')

    def clean(self):
        if self.chief:
            # Vérifier que l'utilisateur n'est pas admin
            if self.chief.role in ['Admin', 'chef', 'Utilisateur','responsableservice', 'vicepresident', 'responsablePôle','secretairegeneral','chefcentre' ,'SupAdmin']:
                raise ValidationError({'chief': "Un utilisateur avec le rôle 'Admin' ou 'chef' ne peut pas être chef de service."})
            # Vérifier qu'un utilisateur ne peut pas être chef de plus d'un service
            if Service.objects.filter(chief=self.chief).exclude(service_id=self.service_id).exists():
                raise ValidationError({'chief': "Un utilisateur ne peut pas être chef de plus d'un service."})

    def save(self, *args, **kwargs):
        self.clean()
        super(Service, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class Pole(models.Model):
    pole_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    

    def _str_(self):
        return self.name 
    
class Division(models.Model):
    division_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    
    

    def _str_(self):
        return self.name 

   

     
        

class TransferReason(models.Model):
    transfer_reason_id = models.AutoField(primary_key=True)
    reason = models.CharField(max_length=255)

    def _str_(self):
        return self.reason
    
class Suport(models.Model):
    suport_id = models.AutoField(primary_key=True)
    suport = models.CharField(max_length=255)

    def _str_(self):
        return self.suport    

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=False)
    password = models.CharField(max_length=255)  # Champ de mot de passe mis à jour
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, 
                            
                              choices=[
                                        ('Admin', 'Admin'),
                                        ('SupAdmin', 'SupAdmin'),
                                       ('Utilisateur', 'Utilisateur'),
                                       ('chef', 'chef'),
                                        ('chefservice', 'chefService'),
                                        ('responsableservice', 'responsableService'),
                                        ('vicepresident', 'vicePresident'),
                                        ('responsablePôle', 'responsablePôle'),
                                        ('chefdivision', 'chefDivision'),
                                        ('secretairegeneral', 'secretaireGeneral'),
                                         ('chefcentre', 'chefCentre')
        ])
    
    department = models.CharField(max_length=50, unique=False)
    pole = models.ForeignKey(Pole, on_delete=models.CASCADE, default=None , related_name='pole', null=True, blank=True)
    division =models.CharField(max_length=100, blank=True, null=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None , related_name='users', null=True, blank=True)
    fonction = models.CharField(max_length=100, blank=True, null=True)
    code = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Utilise make_password pour hacher le mot de passe avant de l'enregistrer
        if self.password:
            self.password = make_password(self.password)

        super(User, self).save(*args, **kwargs)

    def str(self):
        return self.username



class CourrierDepart(models.Model):
    sortie = models.DateTimeField(null=True, blank=True)
    destinerA = models.CharField(max_length=100)
    destinerAId = models.ManyToManyField(User, related_name='courriers_recus')
    objet = models.TextField()
    fichier = models.FileField(upload_to='courriers/')  # Où vous stockez les fichiers de courrier
    nombrePiecesJointes = models.IntegerField(default=1)
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)  # Nouveau champ pour l'état de lecture
    read_at = models.DateTimeField(null=True, blank=True)
    is_archived = models.BooleanField(default=False)
    incremented_number = models.IntegerField(default=0, editable=False)
    numero = models.CharField(max_length=50, editable=False, null=True) 
    
    support=models.CharField(max_length=255, null=True)
    etablissment=models.CharField(max_length=255, null=True)
    entrer = models.DateTimeField(null=True)
    Nbentrer = models.IntegerField(null=True)

    def save(self, *args, **kwargs):
        if not self.numero:  # Si le numéro n'est pas encore défini
            current_year = timezone.now().year
            last_courrier = CourrierDepart.objects.filter(incremented_number__isnull=False).order_by('-incremented_number').first()
            if last_courrier:
                self.incremented_number = last_courrier.incremented_number + 1
            else:
                self.incremented_number = 1
            year_suffix = str(current_year)[-2:]  # Les deux derniers chiffres de l'année
            self.numero = f"{self.incremented_number:03}/{year_suffix}"  # Format 001/24
        super(CourrierDepart, self).save(*args, **kwargs)

    def __str__(self):
        return f"Courrier départ {self.numero} pour {self.destinerA}"
    

class ArchivedCourrier(models.Model):
    incremented_number = models.IntegerField(default=0, editable=False)
    numero = models.CharField(max_length=50, editable=False, null=True)
    sortie = models.DateTimeField(null=True, blank=True)
    destinerA = models.CharField(max_length=100)
    destinerAId = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='courrier_Archiver')
    objet = models.TextField()
    fichier = models.FileField(upload_to='courriers/')
    nombrePiecesJointes = models.IntegerField(default=1)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    numeroOrdre = models.CharField(max_length=100) 
    archived_at = models.DateTimeField(null=True, blank=True)
    archived_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='archived_courriers')
    support=models.CharField(max_length=255, null=True)
    etablissment=models.CharField(max_length=255, null=True)
    entrer = models.DateTimeField(null=True)
    Nbentrer = models.IntegerField(null=True)
   
    def __str__(self):
        return f"Archived Courrier {self.incremented_number} pour {self.destinerA}"
    


class Transfer(models.Model):
    incremented_number = models.IntegerField(default=0, editable=False)
    commentaire = models.TextField()
    raison = models.CharField(max_length=255)
    date_envoi = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, related_name='transfers_user', on_delete=models.CASCADE)
    support=models.CharField(max_length=255, null=True)
    etablissment=models.CharField(max_length=255, null=True)
    entrer = models.DateTimeField(null=True)
    Nbentrer = models.IntegerField(null=True)
    objet = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    fichier = models.FileField(upload_to='courriers/')
    nombre_pieces_jointes = models.IntegerField(null=True, blank=True)
    user_service = models.ManyToManyField(User, related_name='courriers_transferer')
    numero = models.CharField(max_length=50, editable=False, null=True)
    courrier_depart = models.ForeignKey(CourrierDepart, on_delete=models.CASCADE, related_name='transfers', null=True)

    def _str_(self):
        return f"Transfer {self.numero} - Courrier {self.incremented_number}"



class Courrier(models.Model):
    sortie = models.DateTimeField(null=True, blank=True)
    objet = models.TextField()
    fichier = models.FileField(upload_to='courriers/')  # Où vous stockez les fichiers de courrier
    nombrePiecesJointes = models.IntegerField(default=1)
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE)
    incremented_number = models.IntegerField(default=0, editable=False)
    numero = models.CharField(max_length=50, editable=False, null=True) 
    support=models.CharField(max_length=255, null=True)
    etablissment=models.CharField(max_length=255, null=True)
    traitePar = models.CharField(max_length=100)
    signePar = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.numero:  # Si le numéro n'est pas encore défini
            current_year = timezone.now().year
            last_courrier = Courrier.objects.filter(incremented_number__isnull=False).order_by('-incremented_number').first()
            if last_courrier:
                self.incremented_number = last_courrier.incremented_number + 1
            else:
                self.incremented_number = 1
            year_suffix = str(current_year)[-2:]  # Les deux derniers chiffres de l'année
            self.numero = f"{self.incremented_number:03}/{year_suffix}"  # Format 001/24
        super(Courrier, self).save(*args, **kwargs)

    def __str__(self):
        return f"Courrier départ {self.numero} pour {self.etablissment}"
    
