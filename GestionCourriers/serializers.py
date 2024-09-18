from rest_framework import serializers
from .models import User, CourrierDepart, ArchivedCourrier, TransferReason, Transfer, Service , Departement, Suport, Courrier, Division, Pole
from django.contrib.auth.hashers import check_password


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        # Debugging prints or logs
        print(f"Received email: {email}")
        
        user = User.objects.filter(email=email).first()
        
        if user:
            print(f"User found in database: {user.email}")
            
            if check_password(password, user.password):
                print("Password verification: Success")
                
                if not email.endswith('@ucd.ac.ma'):
                    print("Email domain check: Failed")
                    raise serializers.ValidationError("L'adresse email doit se terminer par @ucd.ac.ma")
                
                print("Email domain check: Success")
                # Add user id to validated data
                data['user_id'] =user.user_id
            else:
                print("Password verification: Failed")
                raise serializers.ValidationError("Identifiants invalides")
        else:
            print("User not found in database")
        
        return data

    def create(self, validated_data):
        return validated_data
    

class CourrierSerializer(serializers.ModelSerializer):
    utilisateur_username = serializers.ReadOnlyField(source='utilisateur.username')
    class Meta:
        model = CourrierDepart
        fields = '__all__'    

    def get_fichier_url(self, obj):
        request = self.context.get('request')
        if obj.fichier:
            return request.build_absolute_uri(obj.fichier.url)
        return None    
    
class CourrierenvoyeSerializer(serializers.ModelSerializer):
    utilisateur_username = serializers.ReadOnlyField(source='utilisateur.username')
    class Meta:
        model = Courrier
        fields = '__all__'    

    def get_fichier_url(self, obj):
        request = self.context.get('request')
        if obj.fichier:
            return request.build_absolute_uri(obj.fichier.url)
        return None     



class CourrierArchiveSerializer(serializers.ModelSerializer):
    utilisateur_username = serializers.ReadOnlyField(source='archived_by.username')
    
    class Meta:
        model = ArchivedCourrier
        fields = '__all__'     


class TransferReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferReason
        fields = '__all__'  

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__' 

class PoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pole
        fields = '__all__'          

class CourrierDepartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourrierDepart
        fields = '__all__'

class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = '__all__'                    


""" class CourrierTransfererSerializer(serializers.ModelSerializer):
    utilisateur_usernames = serializers.SerializerMethodField()
    # user_username = serializers.ReadOnlyField(source='user.username')
    user_username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Transfer
        fields = '__all__'       

    def get_user_service_usernames(self, obj):
        return [user.username for user in obj.user_service.all()]   """ 
""" 
class SerializerCourriersDepart(serializers.ModelSerializer):
    class Meta:
        model = CourrierDepart
        fields = ['is_read', 'read_at']
   
class CourrierTransfererSerializer(serializers.ModelSerializer):
    utilisateur_usernames = serializers.SerializerMethodField()
    courrier_depart = SerializerCourriersDepart(source='id', read_only=True)

    
    class Meta:
        model = Transfer
        fields = [
            'id', 'incremented_number', 'date_envoi', 'utilisateur_usernames', 
            'commentaire', 'raison', 'objet', 'nombre_pieces_jointes', 
            'fichier', 'courrier_depart'
        ]

    def get_utilisateur_usernames(self, obj):
        return [user.username for user in obj.user_service.all()] """

class CourrierTransfererSerializer(serializers.ModelSerializer):
    utilisateur_usernames = serializers.SerializerMethodField()
    
    class Meta:
        model = Transfer
        fields = '__all__' 
    def get_utilisateur_usernames(self, obj):
        return [user.username for user in obj.user_service.all()]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 

    def create(self, validated_data):
        user = User(**validated_data)
         # Hash the password
        user.save()
        return user
    
class ServiceSerializer(serializers.ModelSerializer):
    chief_name = serializers.ReadOnlyField(source='chief.username')
    class Meta:
        model = Service
        fields = '__all__'   

    def create(self, validated_data):
        service = Service(**validated_data)
         # Hash the password
        service.save()
        return service        
    
    def update(self, instance, validated_data):
        # Update the instance with validated data
        instance.name = validated_data.get('name', instance.name)
        instance.chief = validated_data.get('chief', instance.chief)
        instance.save()
        return instance 
    
class DepartementSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Departement
        fields = '__all__'   

    def create(self, validated_data):
        departement = Departement(**validated_data)
         # Hash the password
        departement.save()
        return departement        
    
    def update(self, instance, validated_data):
        # Update the instance with validated data
        instance.nom = validated_data.get('nom', instance.nom)
        instance.etablissement_type = validated_data.get('etablissement_type', instance.etablissement_type)
        instance.save()
        return instance     
    

class userCSerializer(serializers.ModelSerializer):
    
    utilisateur_service = serializers.ReadOnlyField(source='service.name')
    utilisateur_pole = serializers.ReadOnlyField(source='pole.name')

    class Meta:
        model = User
        fields = '__all__'     



   
class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'     


class SuportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suport
        fields = '__all__'  
    







    