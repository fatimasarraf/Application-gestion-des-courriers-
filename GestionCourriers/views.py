
from rest_framework.views import APIView
from .models import User
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from .serializers import UserLoginSerializer
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import TruncWeek
from django.db.models.expressions import RawSQL
import json
from .models import User, CourrierDepart, ArchivedCourrier, TransferReason, Transfer, Service, Departement, Suport, Courrier, Pole, Division
from .serializers import CourrierSerializer, CourrierArchiveSerializer, TransferReasonSerializer, TransferSerializer, CourrierDepartSerializer, CourrierTransfererSerializer, UserSerializer, ServiceSerializer, userCSerializer, DepartementSerializer, SuportsSerializer, CourrierenvoyeSerializer, PoleSerializer, DivisionSerializer
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.views import View
from django.db.models import F
from rest_framework import generics
from django.db import transaction
from django.db import IntegrityError
from rest_framework import viewsets
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.functions import TruncDay
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.views.decorators.http import require_http_methods


class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise ValidationError("Utilisateur non trouvé")

            if not email.endswith('@ucd.ac.ma'):
                raise ValidationError("L'adresse email doit se terminer par @ucd.ac.ma")

            if not check_password(password, user.password):
                raise ValidationError("Identifiants invalides")

            # Authentification réussie
            user_id = user.user_id
            username = user.username
            role = user.role
            fonction = user.fonction
            

            return Response({
                'message': 'Connexion réussie',
                'user_id': user_id,
                'username': username,
                'fonction': fonction,
                'role': role,
                
            }, status=status.HTTP_200_OK)

        # Si les données de sérialisation ne sont pas valides, retournez les erreurs
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class NextIncrementedNumberView(APIView):
    def get(self, request):
        last_courrier = CourrierDepart.objects.all().order_by('incremented_number').last()
        if last_courrier:
            incremented_number = last_courrier.incremented_number + 1
        else:
            incremented_number = 1
        return Response({'incremented_number': incremented_number})

class CourrierIncrementedNumberView(APIView):
    def get(self, request):
        last_courrier = Courrier.objects.all().order_by('incremented_number').last()
        if last_courrier:
            incremented_number = last_courrier.incremented_number + 1
        else:
            incremented_number = 1
        return Response({'incremented_number': incremented_number})
# View to handle form submission
""" @method_decorator(csrf_exempt, name='dispatch')
class EnvoyerCourrierView(APIView):
    def post(self, request):
        serializer = CourrierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) """



class EnvoyerCourrierView(APIView):
    def post(self, request):
        try:
            with transaction.atomic():
                # Récupérer le courrier à transférer

              
                
                
                incremented_number =request.data.get('incremented_number')  # Utilisez timezone.now() pour obtenir la datetime actuelle avec le fuseau horaire
                sortie = request.data.get('sortie')
                
                objet = request.data.get('objet')
                # fichier = request.data.get('fichier')
                nombrePiecesJointes = request.data.get('nombrePiecesJointes')
                etablissment = request.data.get('etablissment')
                support = request.data.get('support')
                entrer = request.data.get('entrer')
                Nbentrer = request.data.get('Nbentrer')
                # destinataires = request.data.get('destinataires', [])
                fichier = request.FILES.get('fichier')
                data = request.POST
                destinataires = json.loads(data.get('destinataires', '[]'))
                user_id = request.data.get('utilisateur')
                user = get_object_or_404(User, user_id=user_id)

                # Assurez-vous que destinataires est une liste
                if not isinstance(destinataires, list):
                    raise ValueError("destinataires doit être une liste d'identifiants d'utilisateurs")

                destinerA_list = []
                destinerA_ids = []
                for destinataire_id in destinataires:
                    user_service = get_object_or_404(User, user_id=destinataire_id)
                    destinerA_list.append(user_service.username)
                    destinerA_ids.append(user_service.user_id)
                    # Créer un courrier pour chaque destinataire
                    transfere_courrier = CourrierDepart.objects.create(
                        # incremented_number=courrier.incremented_number,
                        incremented_number=incremented_number,
                        sortie=sortie,
                        objet=objet,
                       fichier=fichier,
                       destinerA=user_service.username,
                       nombrePiecesJointes=nombrePiecesJointes,
                       Nbentrer=Nbentrer,
                       etablissment= etablissment,
                       support=support,
                       entrer=entrer,
                       utilisateur=user  # Utilisateur qui transfère le courrier
                    )
                    # Vérifier que transfere_courrier a bien été créé
                    if transfere_courrier:
                       print(f"transfere_courrier créé avec succès: {transfere_courrier}")
                       print(f"transfere_courrier créé avec succès: {user_service}")
                       transfere_courrier.destinerAId.add(user_service)
                       
                    else:
                        raise ValueError(f"Erreur lors de la création du courrier pour l'utilisateur ID {destinataire_id}")

                print(f"Courriers transférés créés avec succès pour les destinataires: {', '.join(destinerA_list)}")

                # Répondre avec un message JSON de succès
                return Response({'message': 'Courriers transférés avec succès.', 'destinataires': destinerA_ids}, status=status.HTTP_200_OK)

        except Exception as e:
            # En cas d'erreur, répondre avec un message d'erreur
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    
@method_decorator(csrf_exempt, name='dispatch')
class EnvoyerView(APIView):
    def post(self, request):
        serializer = CourrierenvoyeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

# View to get all users
class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        user_data = [{"id": user.user_id, "username": user.username, "department": user.department, "role": user.role,"code": user.code} for user in users]
        return Response(user_data) 

     


class CourrierDepartListView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Log user_id to console
        print(f"User ID: {user_id}")

        # Pagination parameters
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 10)

        # Query courriers for the specified user_id
        courriers = CourrierDepart.objects.filter(utilisateur_id=user_id)

        # Initialize pagination
        paginator = PageNumberPagination()
        paginator.page_size = page_size

        # Paginate queryset
        paginated_courriers = paginator.paginate_queryset(courriers, request)

        # Serialize paginated data
        serializer = CourrierSerializer(paginated_courriers, many=True)

        # Return paginated response
        return paginator.get_paginated_response(serializer.data)
    

class CourrierListView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Log user_id to console
        print(f"User ID: {user_id}")

        # Pagination parameters
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 10)

        # Query courriers for the specified user_id
        courriers = Courrier.objects.filter(utilisateur_id=user_id)

        # Initialize pagination
        paginator = PageNumberPagination()
        paginator.page_size = page_size

        # Paginate queryset
        paginated_courriers = paginator.paginate_queryset(courriers, request)

        # Serialize paginated data
        serializer = CourrierenvoyeSerializer(paginated_courriers, many=True)

        # Return paginated response
        return paginator.get_paginated_response(serializer.data)    
    
class CourrierDepartDetailView(APIView):
    def get(self, request, pk):
        print(f"Fetching details for courrier with ID: {pk}")  # Imprimer l'ID du courrier dans la console
        try:
            courrier = CourrierDepart.objects.get(pk=pk)
        except CourrierDepart.DoesNotExist:
            print(f"Courrier with ID {pk} not found")  # Imprimer un message d'erreur si le courrier n'est pas trouvé
            raise NotFound("Courrier non trouvé")
        
        serializer = CourrierSerializer(courrier)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
class CourrierDetailView(APIView):
    def get(self, request, pk):
        print(f"Fetching details for courrier with ID: {pk}")  # Imprimer l'ID du courrier dans la console
        try:
            courrier = Courrier.objects.get(pk=pk)
        except Courrier.DoesNotExist:
            print(f"Courrier with ID {pk} not found")  # Imprimer un message d'erreur si le courrier n'est pas trouvé
            raise NotFound("Courrier non trouvé")
        
        serializer = CourrierenvoyeSerializer(courrier)
        return Response(serializer.data, status=status.HTTP_200_OK)     


class CourriersRecusView(APIView):
    def get(self, request, user_id):
        try:
            print(f"Request received for user_id: {user_id}")  # Debugging statement

            courriers = CourrierDepart.objects.filter(destinerAId=user_id)
            print(f"Courriers fetched: {courriers}")  # Debugging statement

            serializer = CourrierSerializer(courriers, many=True)
            print(f"Serialized data: {serializer.data}")  # Debugging statement

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error occurred: {str(e)}")  # Debugging statement
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        



    

class UpdateCourrierDepartView(APIView):
    def patch(self, request, id, format=None):
        try:
            courrier = CourrierDepart.objects.get(id=id)
        except CourrierDepart.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND) 
              
        data = request.data
        is_read = data.get('is_read', True)
        read_at = data.get('read_at', timezone.now())
        print("Value of read_at before saving:", read_at)
        courrier.is_read = is_read
        courrier.read_at = read_at
        courrier.save()

        serializer = CourrierSerializer(courrier)
        return Response(serializer.data, status=status.HTTP_200_OK) 

class UpdateTransferView(APIView):
    def patch(self, request, id, format=None):
        print("Received ID from frontend:", id)
        try:
            courrier = Transfer.objects.get(courrier_depart=id)
        except Transfer.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
             
        data = request.data
        is_read = data.get('is_read', True)
        read_at = data.get('read_at', timezone.now())
        print("Value of read_at before saving:", read_at)
        courrier.is_read = is_read
        courrier.read_at = read_at
        courrier.save()

        serializer = CourrierTransfererSerializer(courrier)
        return Response(serializer.data, status=status.HTTP_200_OK)          


    

class CourrierRecusDetailView(APIView):
    def get(self, request, pk):
        print(f"Fetching details for courrier with ID: {pk}")  # Imprimer l'ID du courrier dans la console
        try:
            courrier = CourrierDepart.objects.get(pk=pk)
        except CourrierDepart.DoesNotExist:
            print(f"Courrier with ID {pk} not found")  # Imprimer un message d'erreur si le courrier n'est pas trouvé
            raise NotFound("Courrier non trouvé")
        
        serializer = CourrierSerializer(courrier)
        return Response(serializer.data, status=status.HTTP_200_OK)  


class ArchiveCourrierView(APIView):
    def post(self, request, id):
        try:
            # Retrieve the courrier to be archived
            courrier = get_object_or_404(CourrierDepart, id=id)

            # Check if the courrier is already archived
            if courrier.is_archived:
                return Response({'error': 'Le courrier est déjà archivé.'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve the order number and click time from POST data
            numero_ordre = request.data.get('numeroOrdre')
            archived_at = request.data.get('click_time')
            user_id = request.data.get('user_id')  # Retrieve the user ID from POST data
            user = get_object_or_404(User, user_id=user_id)
            # Print statements for debugging
            print("Numero d'ordre récupéré :", numero_ordre)
            print("Temps d'archivage récupéré :", archived_at)
            print("ID utilisateur récupéré :", user_id)

            # Create an instance of ArchivedCourrier to archive the courrier
            archived_courrier = ArchivedCourrier.objects.create(
                incremented_number=courrier.incremented_number,
                numero=courrier.numero,
                sortie=courrier.sortie,
                support=courrier.support,
                etablissment=courrier.etablissment,
                entrer=courrier.entrer,
                Nbentrer=courrier.Nbentrer,
                destinerA=courrier.destinerA,
                # destinerAId=courrier.destinerAId,  # This should already be a User instance
                objet=courrier.objet,
                fichier=courrier.fichier,
                nombrePiecesJointes=courrier.nombrePiecesJointes,
                is_read=courrier.is_read,
                read_at=courrier.read_at,
                numeroOrdre=numero_ordre,
                archived_at=archived_at,
                archived_by=user  # Assign the user ID who is archiving the courrier
            )

            # Print information about the archived courrier
            print("Informations du courrier archivé :")
            print("Numéro incrémenté :", archived_courrier.incremented_number)
            print("Date de sortie :", archived_courrier.sortie)
            print("Destiné à :", archived_courrier.destinerA)
            print("ID destiné à :", archived_courrier.destinerAId)
            print("Objet :", archived_courrier.objet)
            print("Fichier :", archived_courrier.fichier)
            print("Nombre de pièces jointes :", archived_courrier.nombrePiecesJointes)
            print("Est lu :", archived_courrier.is_read)
            print("Date de lecture :", archived_courrier.read_at)
            print("Numéro d'ordre :", archived_courrier.numeroOrdre)
            print("Date d'archivage :", archived_courrier.archived_at)
            print("Archivé par l'utilisateur ID :", user)

            # Mark the original courrier as archived
            courrier.is_archived = True
            courrier.save()

            # Respond with a success JSON message
            return Response({'message': 'Courrier archivé avec succès.'}, status=status.HTTP_200_OK)

        except Exception as e:
            # In case of error, respond with an error message
            print("Erreur :", str(e))  # Print the error for debugging
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CourriersArchiverDetails(APIView):

    def get(self, request, pk):
        courrier = get_object_or_404(ArchivedCourrier, pk=pk)
        serializer = CourrierArchiveSerializer(courrier)
        return Response(serializer.data)     
    


class CourriersArchivesList(APIView):
    def get(self, request, user_id):
        print(f"Fetching archived courriers for user_id: {user_id}, User: {request.user}")
        
        courriers_archives = ArchivedCourrier.objects.filter(archived_by=user_id).order_by('-sortie')
        serializer = CourrierArchiveSerializer(courriers_archives, many=True)
        return Response(serializer.data)    



""" class DepartmentServicesAndUsersByUser(View):
    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        
        if user.role == 'chef':
            # Si l'utilisateur connecté a le rôle de 'chef', il peut envoyer des courriers aux utilisateurs qui ont le rôle de 'chefservice'
            destinataires = User.objects.filter(role='chefservice').values('user_id', 'username', service_name=F('service__name')).exclude(user_id=user_id)
        elif user.role == 'chefservice':
            # Si l'utilisateur connecté a le rôle de 'chefservice', il peut envoyer des courriers aux utilisateurs du même service
            destinataires = User.objects.filter(service=user.service, role='Utilisateur').values('user_id', 'username', service_name=F('service__name')).exclude(user_id=user_id)
        else:
            # Si l'utilisateur n'a pas le rôle approprié, il n'a pas de destinataires valides
            destinataires = User.objects.none()
        
        destinataire_data = list(destinataires)
        
        return JsonResponse(destinataire_data, safe=False) """


class DepartmentServicesAndUsersByUser(View):
    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        
        if user.role == 'Admin':
            # Si l'utilisateur connecté a le rôle 'Admin', il peut voir les utilisateurs avec ces rôles spécifiques
            destinataires = User.objects.filter(role__in=['chef', 'responsableservice', 'vicepresident', 'responsablePôle', 'secretairegeneral']).values('user_id', 'username','role','fonction', service_name=F('service__name')).exclude(user_id=user_id)
        elif user.role == 'chef':
            # Si l'utilisateur connecté a le rôle 'chef', il peut voir les utilisateurs avec ces rôles spécifiques
            destinataires = User.objects.filter(role__in=['responsableservice', 'vicepresident', 'responsablePôle', 'secretairegeneral', 'chefdivision', 'chefservice']).values('user_id', 'username','role','fonction', service_name=F('service__name')).exclude(user_id=user_id)
        elif user.role == 'chefdivision':
            # Si l'utilisateur connecté a le rôle 'chefdivision', il peut voir les utilisateurs avec le rôle 'chefservice'
            destinataires = User.objects.filter(division=user.division,role='chefservice').values('user_id', 'username','role','fonction', service_name=F('service__name')).exclude(user_id=user_id)
        elif user.role =='secretairegeneral':
            # Si l'utilisateur connecté a le rôle 'chefdivision', il peut voir les utilisateurs avec le rôle 'chefservice'
            destinataires = User.objects.filter(pole=user.pole,role__in=['chefdivision','chefservice']).values('user_id', 'username','role','fonction', service_name=F('service__name')).exclude(user_id=user_id) 
        elif user.role in ['vicepresident', 'responsablePôle']:
            # Si l'utilisateur connecté a le rôle 'chefdivision', il peut voir les utilisateurs avec le rôle 'chefservice'
            destinataires = User.objects.filter(pole=user.pole,role__in=['chefcentre','chefdivision','chefservice']).values('user_id', 'username','role','fonction', service_name=F('service__name')).exclude(user_id=user_id)
        elif user.role == 'chefservice':
            # Si l'utilisateur connecté a le rôle 'chefservice', il peut voir les utilisateurs avec le rôle 'Utilisateur' du même service
            destinataires = User.objects.filter(service=user.service, role='Utilisateur').values('user_id', 'username','role','fonction', service_name=F('service__name')).exclude(user_id=user_id)
        else:
            # Si l'utilisateur n'a pas de rôle approprié, il n'a pas de destinataires valides
            destinataires = User.objects.none()
        
        destinataire_data = list(destinataires)
        
        return JsonResponse(destinataire_data, safe=False)

class TransferReasonListAPIView(APIView):
    def get(self, request):
        reasons = TransferReason.objects.all()
        serializer = TransferReasonSerializer(reasons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EtablissementListAPIView(APIView):
    def get(self, request):
        reasons = Departement.objects.all()
        serializer = DepartementSerializer(reasons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)   

class DivisionListAPIView(APIView):
    def get(self, request):
        reasons = Division.objects.all()
        serializer = DivisionSerializer(reasons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

class PoleListAPIView(APIView):
    def get(self, request):
        reasons = Pole.objects.all()
        serializer = PoleSerializer(reasons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)          
    

class CreateCourrierDepartAPIView(APIView):
    def post(self, request, id):
        try:
            with transaction.atomic():
                # Récupérer le courrier à transférer
                courrier = get_object_or_404(CourrierDepart, id=id)
                
                dateEnvoi =request.data.get('dateEnvoi')  # Utilisez timezone.now() pour obtenir la datetime actuelle avec le fuseau horaire
                user_id = request.data.get('user_id')
                destinataires = request.data.get('destinataires', [])
                user = get_object_or_404(User, user_id=user_id)

                # Assurez-vous que destinataires est une liste
                if not isinstance(destinataires, list):
                    raise ValueError("destinataires doit être une liste d'identifiants d'utilisateurs")

                destinerA_list = []
                destinerA_ids = []
                for destinataire_id in destinataires:
                    user_service = get_object_or_404(User, user_id=destinataire_id)
                    destinerA_list.append(user_service.username)
                    destinerA_ids.append(user_service.user_id)
                    # Créer un courrier pour chaque destinataire
                    transfere_courrier = CourrierDepart.objects.create(
                        # incremented_number=courrier.incremented_number,
                        sortie=dateEnvoi,
                        numero=courrier.numero,
                        support=courrier.support,
                       etablissment=courrier.etablissment,
                       entrer=courrier.entrer,
                       Nbentrer=courrier.Nbentrer,
                        destinerA=user_service.username,
                        objet=courrier.objet,
                        fichier=courrier.fichier,
                        nombrePiecesJointes=courrier.nombrePiecesJointes,
                        # is_read=courrier.is_read,
                        # read_at=courrier.read_at,
                        utilisateur=user  # Utilisateur qui transfère le courrier
                    )
                    # Vérifier que transfere_courrier a bien été créé
                    if transfere_courrier:
                       print(f"transfere_courrier créé avec succès: {transfere_courrier}")
                       print(f"transfere_courrier créé avec succès: {user_service}")
                       transfere_courrier.destinerAId.add(user_service)
                       
                    else:
                        raise ValueError(f"Erreur lors de la création du courrier pour l'utilisateur ID {destinataire_id}")

                print(f"Courriers transférés créés avec succès pour les destinataires: {', '.join(destinerA_list)}")

                # Répondre avec un message JSON de succès
                return Response({'message': 'Courriers transférés avec succès.', 'destinataires': destinerA_ids}, status=status.HTTP_200_OK)

        except Exception as e:
            # En cas d'erreur, répondre avec un message d'erreur
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CreateTransferAPIView(APIView):
    def post(self, request, id):
        try:
            with transaction.atomic():
                # Récupérer le courrier à transférer
                courrier = get_object_or_404(CourrierDepart, id=id)
                
                commentaire = request.data.get('commentaire')
                destinataires = request.data.get('destinataires')
                date_envoi = request.data.get('date_envoi')
                raison = request.data.get('raison')
                user_id = request.data.get('user_id')
                user = get_object_or_404(User, user_id=user_id)

                # Assurez-vous que destinataires est une liste
                if not isinstance(destinataires, list):
                    raise ValueError("destinataires doit être une liste d'identifiants d'utilisateurs")

                
                destinerA_ids = []
                for destinataire_id in destinataires:
                    user_service = get_object_or_404(User, user_id=destinataire_id)
                    
                    destinerA_ids.append(user_service.user_id)
                    # id = get_object_or_404(CourrierDepart, id=id)
                    transfere_courrier = Transfer.objects.create(
                        # incremented_number=courrier.incremented_number,
                       incremented_number=courrier.incremented_number,
                       commentaire=commentaire,
                       numero=courrier.numero,
                       raison=raison,
                       date_envoi=date_envoi,
                       user=user,
                       support=courrier.support,
                       etablissment=courrier.etablissment,
                       entrer=courrier.entrer,
                       Nbentrer=courrier.Nbentrer,
                       objet=courrier.objet,
                       fichier=courrier.fichier,
                       nombre_pieces_jointes=courrier.nombrePiecesJointes,
                    #    courrier_depart=id,
            )
                    # Vérifier que transfere_courrier a bien été créé
                    if transfere_courrier:
                       print(f"transfere_courrier créé avec succès: {transfere_courrier}")
                       print(f"transfere_courrier créé avec succès: {user_service}")
                       transfere_courrier.user_service.add(user_service)
                       
                    else:
                        raise ValueError(f"Erreur lors de la création du courrier pour l'utilisateur ID {destinataire_id}")

                

                # Répondre avec un message JSON de succès
                return Response({'message': 'Courriers transférés avec succès.', 'destinataires': destinerA_ids}, status=status.HTTP_200_OK)

        except Exception as e:
            # En cas d'erreur, répondre avec un message d'erreur
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CourriersTransferesList(APIView):
 
    def get(self, request, user_id):
        courriers = Transfer.objects.filter(user=user_id).order_by('-date_envoi')
        serializer = CourrierTransfererSerializer(courriers, many=True)
        return Response(serializer.data)

    def post(self, request, user_id):
        # Vous pouvez implémenter une méthode POST si nécessaire pour d'autres fonctionnalités
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

class CourriersTransfereDetails(APIView):

    def get(self, request, pk):
        courrier = get_object_or_404(Transfer, pk=pk)
        serializer = CourrierTransfererSerializer(courrier)
        data = serializer.data
        print(data)  # Ajoutez cette ligne pour imprimer les informations de data
        return Response(data)  

""" class CourrierTransfererDetailView(generics.RetrieveAPIView):
    queryset = CourrierTransferer.objects.all()
    serializer_class = CourrierTransfererSerializer    """ 



class CourrierUpdateAPIView(APIView):
    def patch(self, request, id, format=None):
        try:
            courrier = CourrierDepart.objects.get(pk=id)
        except CourrierDepart.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        is_read = data.get('is_read', True)
        read_at = data.get('read_at', timezone.now())
        print("Value of read_at before saving:", read_at)
        courrier.is_read = is_read
        courrier.read_at = read_at
        courrier.save()

        serializer = CourrierSerializer(courrier)
        return Response(serializer.data, status=status.HTTP_200_OK) 


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

     

class ServiceListView(APIView):
    def get(self, request):
        service = Service.objects.all()
        department_list = [{'name': dept.name,'service_id':dept.service_id} for dept in service]
        return Response(department_list, status=status.HTTP_200_OK)  
    
class PoleListView(APIView):
    def get(self, request):
        pole = Pole.objects.all()
        pole_list = [{'name': dept.name,'pole_id':dept.pole_id} for dept in pole]
        return Response(pole_list, status=status.HTTP_200_OK) 
    
 

class DivisionListView(APIView):
    def get(self, request):
        division = Division.objects.all()
        division_list = [{'name': dept.name,'division_id':dept.division_id} for dept in division]
        return Response(division_list, status=status.HTTP_200_OK) 


""" class GetDivisionsByPoleView(View):
    def get(self, request, pole_id):
        divisions = Division.objects.filter(pole=pole_id)
        divisions_data = list(divisions.values('division_id', 'name'))
        return JsonResponse(divisions_data, safe=False)  """      
    
""" class GetServicesByDivisionView(View):
    def get(self, request, division_id):
        services = Service.objects.filter(division=division_id)
        services_data = list(services.values('service_id', 'name'))
        return JsonResponse(services_data, safe=False) """
    
class UserLists(View):
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)    
    
class ServiceViewSet(generics.CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class DepartementViewSet(generics.CreateAPIView):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)        
        

class AllService(View):
    def get(self, request, *args, **kwargs):
        service = Service.objects.all()
        serializer = ServiceSerializer(service, many=True)
        return JsonResponse(serializer.data, safe=False) 

class AllDepartement(View):
    def get(self, request, *args, **kwargs):
        service = Departement.objects.all()
        serializer = DepartementSerializer(service, many=True)
        return JsonResponse(serializer.data, safe=False)              
    






class ServiceDetail(APIView):
    def get_object(self, service_id):
        try:
            return Service.objects.get(pk=service_id)
        except Service.DoesNotExist:
            return None

    def get(self, request, service_id):
        service = self.get_object(service_id)
        if service is None:
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, service_id):
        service = self.get_object(service_id)
        if service is None:
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
        print("Data received from frontend:", request.data)
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, service_id):
        service = self.get_object(service_id)
        if service is None:
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class DepartementDetail(APIView):
    def get_object(self, departement_id):
        try:
            return Departement.objects.get(pk=departement_id)
        except Departement.DoesNotExist:
            return None

    def get(self, request, departement_id):
        departement = self.get_object(departement_id)
        if departement is None:
            return Response({'error': 'Departement not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = DepartementSerializer(departement)
        return Response(serializer.data)

    def put(self, request, departement_id):
        departement = self.get_object(departement_id)
        if departement is None:
            return Response({'error': 'Departement not found'}, status=status.HTTP_404_NOT_FOUND)
        print("Data received from frontend:", request.data)
        serializer = DepartementSerializer(departement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, departement_id):
        departement = self.get_object(departement_id)
        if departement is None:
            return Response({'error': 'departement not found'}, status=status.HTTP_404_NOT_FOUND)
        departement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  


    
class UserDetailDeleteUpdate(APIView):
    def get_object(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def get(self, request, user_id):
        user = self.get_object(user_id)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, user_id):
        user = self.get_object(user_id)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        user = self.get_object(user_id)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    
    



class UsersWithRoleInService(APIView):
    def get(self, request, service_name):
        try:
            users = User.objects.filter(role='chefservice', service__name=service_name)
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CurrentUserDataView(APIView):

    def get(self, request, user_id):
        try:
            user = User.objects.get(user_id=user_id)
            serializer = userCSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, user_id):
        # Vous pouvez implémenter une méthode POST si nécessaire pour d'autres fonctionnalités
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED) 

class UserTransfersView(APIView):
    

    def get(self, request, user_id):
        courriers = Transfer.objects.filter(user_service=user_id).values('day').annotate(count=Count('id'))
        return Response(courriers)        
    

""" class CourriersTransferesParUtilisateurView(View):
    def get(self, request, user_id):
        try:
            user = User.objects.get(user_id=user_id)  # Retrieve a single user instance
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        print(f"Fetching archived courriers for user_id: {user_id}")

        courriers_transferer_by_user = (
            Transfer.objects.filter(user_service=user)
            .annotate(day=TruncDay('date_envoi'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        def convert_to_date_string(data):
            for item in data:
                item['day'] = item['day'].strftime('%Y-%m-%d')
            return data 
        
        data = {
            'courriers_transferer_by_user': convert_to_date_string(list(courriers_transferer_by_user)),
        }

        return JsonResponse(data, safe=False) """


class CourriersTransferesParUtilisateurView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(user_id=user_id)  # Correct field name here
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        courriers_transferer_by_user = (
            Transfer.objects.filter(user_service=user)
            .annotate(day=TruncDay('date_envoi'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        def convert_to_date_string(data):
            for item in data:
                item['day'] = item['day'].strftime('%Y-%m-%d')
            return data

        data = {
            'courriers_transferer_by_user': convert_to_date_string(list(courriers_transferer_by_user)),
        }

        return JsonResponse(data, safe=False)
    

class CourriersRecusParEtablissementView(APIView):
    def get(self, request, user_id, etablissement_nom):
        try:
            user = User.objects.get(user_id=user_id)  # Correct field name here
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


        courriers_recus_par_etablissment = (
            CourrierDepart.objects.filter(destinerAId=user, etablissment=etablissement_nom)
            .values('etablissment')  # Récupérer le nom du service à travers User -> Service
            .annotate(count=Count('id'))
            .order_by('etablissment')
        )



        

        data = {
            'courriers_recus_par_etablissment': list(courriers_recus_par_etablissment),
        }

        return JsonResponse(data, safe=False)
    



class CourriersArrivesParEtablissementView(APIView):
    def get(self, request, user_id, etablissement_arrives_nom):
        try:
            user = User.objects.get(user_id=user_id)  # Correct field name here
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


        courriers_arrives_par_etablissment = (
            CourrierDepart.objects.filter(utilisateur=user, etablissment=etablissement_arrives_nom)
            .values('etablissment')  # Récupérer le nom du service à travers User -> Service
            .annotate(count=Count('id'))
            .order_by('etablissment')
        )



        

        data = {
            'courriers_arrives_par_etablissment': list(courriers_arrives_par_etablissment),
        }

        return JsonResponse(data, safe=False)   


          
        

class UserStatisticsView(APIView):
    
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)

        courriers_depart_count = CourrierDepart.objects.filter(utilisateur=user).count()
        courriers_count = Courrier.objects.filter(utilisateur=user).count()
        archived_courriers_count = ArchivedCourrier.objects.filter(archived_by=user).count()
        transfers_count = Transfer.objects.filter(user=user).count()
        courriers_recus_count= CourrierDepart.objects.filter(destinerAId=user).count()
        courriers_non_lus_recus = CourrierDepart.objects.filter(destinerAId=user, is_read=False).count()
        courriers_lus_recus = CourrierDepart.objects.filter(destinerAId=user, is_read=True).count()
        
        

        archived_courriers_by_day = (
                ArchivedCourrier.objects.filter(archived_by=user)
                .annotate(day=TruncDay('archived_at'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )
        courriers_recus_by_day = (
                CourrierDepart.objects.filter(destinerAId=user)
                .annotate(day=TruncDay('sortie'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )
        courriers_envoyer_by_day = (
                CourrierDepart.objects.filter(utilisateur=user)
                .annotate(day=TruncDay('sortie'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )
        
        courriers_envoyer_by_week = (
             CourrierDepart.objects.filter(utilisateur=user)
            .annotate(week=TruncWeek('sortie'))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
        )

        courriers_by_week = (
            Courrier.objects.filter(utilisateur=user)
            .annotate(week=RawSQL(
                "DATE_TRUNC('week', sortie) + INTERVAL '5 days' * ((EXTRACT(DOW FROM sortie) - 1) / 5)::int", 
                ()
            ))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
        )
        
        courriers_by_day = (
                Courrier.objects.filter(utilisateur=user)
                .annotate(day=TruncDay('sortie'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )
        courriers_transferer_by_day = (
                Transfer.objects.filter(user=user)
                .annotate(day=TruncDay('date_envoi'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )
        

        courriers_transferer_par_service = (
            Transfer.objects.filter(user=user)
            .values('user_service__service__name')  # Récupérer le nom du service à travers User -> Service
            .annotate(count=Count('id'))
            .order_by('user_service__service__name')
        )
        courriers_arrives_par_etablissment = (
            CourrierDepart.objects.filter(utilisateur=user)
            .values('etablissment')  # Récupérer le nom du service à travers User -> Service
            .annotate(count=Count('id'))
            .order_by('etablissment')
        )
        courriers_recus_par_etablissment = (
            CourrierDepart.objects.filter(destinerAId=user)
            .values('etablissment')  # Récupérer le nom du service à travers User -> Service
            .annotate(count=Count('id'))
            .order_by('etablissment')
        )

        responsableservice_users = User.objects.filter(role='responsableservice')

        courriers_transferer_par_pole = (
            Transfer.objects.exclude(user_service__in=responsableservice_users)
            .values('user_service__pole')  # Récupérer le nom du service à travers User -> Service
            .annotate(count=Count('id'))
            .order_by('user_service__pole')
        )

        chefs_de_division = User.objects.filter(role='chefdivision')

# Récupérer les courriers transférés par ces utilisateurs, groupés par division
        courriers_transferer_par_division = (
    Transfer.objects.filter(user_service__in=chefs_de_division)
    .values('user_service__division')  # Récupérer la division associée à l'utilisateur
    .annotate(count=Count('id'))
    .order_by('user_service__division')
    )

    


        courriers_envoyer_by_month = (
            CourrierDepart.objects.filter(utilisateur=user)
            .annotate(month=TruncMonth('sortie'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        courriers_by_month = (
            Courrier.objects.filter(utilisateur=user)
            .annotate(month=TruncMonth('sortie'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        archived_courriers_by_month = (
            ArchivedCourrier.objects.filter(archived_by=user)
            .annotate(month=TruncMonth('archived_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        courriers_archived_by_week = (
            ArchivedCourrier.objects.filter(archived_by=user)
            .annotate(week=RawSQL(
                "DATE_TRUNC('week', sortie) + INTERVAL '5 days' * ((EXTRACT(DOW FROM sortie) - 1) / 5)::int", 
                ()
            ))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
        )

        
        courriers_transferer_by_month = (
            Transfer.objects.filter(user=user)
            .annotate(month=TruncMonth('date_envoi'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        courriers_transferer_by_week = (
            Transfer.objects.filter(user=user)
            .annotate(week=TruncWeek('date_envoi'))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
   
        )

        courriers_recus_by_week = (
            CourrierDepart.objects.filter(destinerAId=user)
            .annotate(week=TruncWeek('sortie'))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
   
        )

        
        courriers_recus_by_month = (
            CourrierDepart.objects.filter(destinerAId=user)
            .annotate(month=TruncMonth('sortie'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        
        
        

        def convert_to_date_string(data):
            for item in data:
                item['day'] = item['day'].strftime('%Y-%m-%d')
            return data 

        def convert_to_month_string(data):
            for item in data:
                item['month'] = item['month'].strftime('%Y-%m')
            return data 

        def convert_to_week_string(data):
            for item in data:
                item['week'] = item['week'].strftime('%Y-%m-%d')  # Assuming week start is the first day of the week
            return data   

        data = {
            'courriers_depart_count': courriers_depart_count,
            'courriers_count': courriers_count,
            'archived_courriers_count': archived_courriers_count,
            'transfers_count': transfers_count,
            'courriers_recus_count': courriers_recus_count,
            'courriers_non_lus': courriers_non_lus_recus,
            'courriers_lus': courriers_lus_recus ,
             'archived_courriers_by_day': convert_to_date_string(list(archived_courriers_by_day)),
            'courriers_recus_by_day': convert_to_date_string(list(courriers_recus_by_day)),
            'courriers_envoyer_by_day': convert_to_date_string(list(courriers_envoyer_by_day)),
            'courriers_by_day': convert_to_date_string(list(courriers_by_day)),
            'courriers_envoyer_by_week': convert_to_week_string(list(courriers_envoyer_by_week)),
            'courriers_by_week': convert_to_week_string(list(courriers_by_week)),
            'courriers_archived_by_week': convert_to_week_string(list(courriers_archived_by_week)),
            
            'courriers_transferer_by_week': convert_to_week_string(list(courriers_transferer_by_week)),
            'courriers_recus_by_week': convert_to_week_string(list(courriers_recus_by_week)),

            'courriers_by_month': convert_to_month_string(list(courriers_by_month)),
            'courriers_transferer_by_day': convert_to_date_string(list(courriers_transferer_by_day)),
            'courriers_envoyer_by_month': convert_to_month_string(list(courriers_envoyer_by_month)),
            'archived_courriers_by_month': convert_to_month_string(list(archived_courriers_by_month)),
            'courriers_transferer_by_month': convert_to_month_string(list(courriers_transferer_by_month)),
            'courriers_recus_by_month': convert_to_month_string(list(courriers_recus_by_month)),
            'courriers_transferer_par_service': list(courriers_transferer_par_service),
            'courriers_arrives_par_etablissment': list(courriers_arrives_par_etablissment),
            'courriers_recus_par_etablissment': list(courriers_recus_par_etablissment),
            
            'courriers_transferer_par_division': list(courriers_transferer_par_division),
            'courriers_transferer_par_pole': list(courriers_transferer_par_pole),
           
            
           
        }

        return Response(data)  


     


class SuiverCourrierListView(APIView):
    def get(self, request, user_id):
        print(f"Fetching archived courriers for user_id: {user_id}, User: {request.user}")
        
        courriers= CourrierDepart.objects.filter(utilisateur=user_id).order_by('-sortie')
        serializer = CourrierSerializer(courriers, many=True)
        return Response(serializer.data)  
    

class EstablishmentTypesView(APIView):
    def get(self, request):
        types = Departement.objects.values_list('etablissement_type', flat=True).distinct()
        return Response(types)
    

class RolesListView(View):
    def get(self, request, *args, **kwargs):
        # Récupérer les choix du champ `role` du modèle User
        roles = User._meta.get_field('role').choices
        # Convertir les choix en une liste de dictionnaires
        roles_list = [{'value': value, 'display': display} for value, display in roles]
        return JsonResponse(roles_list, safe=False)    

class DepartmentsByTypeView(APIView):
    def get(self, request, etablissement_type):
        departments = Departement.objects.filter(etablissement_type=etablissement_type)
        serializer = DepartementSerializer(departments, many=True)
        return Response(serializer.data)
    

class SuportsListAPIView(APIView):
    def get(self, request):
        suport = Suport.objects.all()
        serializer = SuportsSerializer(suport, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)  



class DepartementTypesView(APIView):
    def get(self, request):
        types = [choice[0] for choice in Departement.ETABLISSEMENT_CHOICES]
        return Response(types, status=status.HTTP_200_OK)  


class SearchCourriers(generics.ListAPIView):
    def get_queryset(self):
        objet = self.request.GET.get('objet', '')
        numero_entree = self.request.GET.get('numero_entree', '')
        date = self.request.GET.get('date', '')
        user_id = self.request.GET.get('user_id')
        courrier_type = self.kwargs['courrier_type']

        queryset = None
        
        if courrier_type == 'courriers-depart':
            queryset = CourrierDepart.objects.filter(utilisateur=user_id)
        elif courrier_type == 'courriers-archives':
            queryset = ArchivedCourrier.objects.filter(archived_by=user_id)
        elif courrier_type == 'courriers-en-cours':
            queryset = Courrier.objects.filter(utilisateur=user_id)
        
        # Apply filters
        if objet:
            queryset = queryset.filter(objet__icontains=objet)
        if numero_entree:
            queryset = queryset.filter(Nbentrer__icontains=numero_entree)
        if date:
            queryset = queryset.filter(sortie__date=date)

        print(queryset)  # Log the queryset to see what is being filtered

        return queryset

    def get_serializer_class(self):
        courrier_type = self.kwargs['courrier_type']
        if courrier_type == 'courriers-depart':
            return CourrierDepartSerializer
        elif courrier_type == 'courriers-archives':
            return CourrierArchiveSerializer
        elif courrier_type == 'courriers-en-cours':
            return CourrierenvoyeSerializer
        


""" class SearchrecustransfereCourriers(generics.ListAPIView):
    def get_queryset(self):
        objet = self.request.GET.get('objet', '')
        numero_entree = self.request.GET.get('numero_entree', '')
        date = self.request.GET.get('date', '')
        user_id = self.request.GET.get('user_id')
        courrier_type = self.kwargs.get('courrier_type', '')

        print(f"Request Parameters: objet={objet}, numero_entree={numero_entree}, date={date}, user_id={user_id}, courrier_type={courrier_type}")

        # Initialize queryset
        queryset = None
        
        # Determine the queryset based on courrier_type
        if courrier_type == 'courriers-recus':
            queryset = CourrierDepart.objects.filter(destinerAId=user_id)
        elif courrier_type == 'courriers-transferer':
            queryset = Transfer.objects.filter(user=user_id)
        else:
            # Return an empty queryset or handle invalid type

            
            return CourrierDepart.objects.none()
        print(f"Invalid courrier_type: {courrier_type}")

        # Apply filters if queryset is not None
        print(f"Initial Queryset: {queryset.query}")
        if queryset is not None:
            if objet:
                queryset = queryset.filter(objet__icontains=objet)
            if numero_entree:
                queryset = queryset.filter(Nbentrer__icontains=numero_entree)
            if date:
                queryset = queryset.filter(sortie__icontains=date)

            print(queryset)  # Log the queryset to see what is being filtered

        return queryset

    def get_serializer_class(self):
        courrier_type = self.kwargs.get('courrier_type', '')
        if courrier_type == 'courriers-recus':
            return CourrierDepartSerializer
        elif courrier_type == 'courriers-transferer':
            return TransferSerializer
        else:
            # Handle invalid courrier_type
            return None
 """

class SearchrecustransfereCourriers(generics.ListAPIView):
    def get_queryset(self):
        objet = self.request.GET.get('objet', '')
        numero_entree = self.request.GET.get('numero_entree', '')
        date = self.request.GET.get('date', '')
        user_id = self.request.GET.get('user_id')
        courrier_type = self.kwargs.get('courrier_type', '')

        print(f"Request Parameters: objet={objet}, numero_entree={numero_entree}, date={date}, user_id={user_id}, courrier_type={courrier_type}")

        # Initialize queryset
        queryset = None
        
        # Determine the queryset based on courrier_type
        if courrier_type == 'courriers-recus':
            queryset = CourrierDepart.objects.filter(destinerAId=user_id)
        elif courrier_type == 'courriers-transferer':
            queryset = Transfer.objects.filter(user=user_id)
        else:
            print(f"Invalid courrier_type: {courrier_type}")
            return CourrierDepart.objects.none()

        print(f"Initial Queryset: {queryset.query}")
        if queryset is not None:
            if objet:
                queryset = queryset.filter(objet__icontains=objet)
            if numero_entree:
                queryset = queryset.filter(Nbentrer__icontains=numero_entree)
            if date:
                # Apply the date filter based on courrier_type
                if courrier_type == 'courriers-recus':
                    queryset = queryset.filter(sortie__icontains=date)
                elif courrier_type == 'courriers-transferer':
                    queryset = queryset.filter(date_envoi__icontains=date)

            print(f"Filtered Queryset: {queryset.query}")

        return queryset

    def get_serializer_class(self):
        courrier_type = self.kwargs.get('courrier_type', '')
        if courrier_type == 'courriers-recus':
            return CourrierDepartSerializer
        elif courrier_type == 'courriers-transferer':
            return TransferSerializer
        else:
            return None
