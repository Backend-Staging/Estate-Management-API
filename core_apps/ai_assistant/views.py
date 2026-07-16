from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView    
from core_apps.issues.models import Issue
from .models import AITriageRequest
from .serializers import AITriageRequestSerializer
from .services.triage_service import MaintenanceTriageService

class MaintenanceTriageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, issue_id):
        try:
            issue = Issue.objects.select_related(
                "apartment",
                "reported_by",
                "assigned_to",
            ).get(id=issue_id)
        except Issue.DoesNotExist:
            return Response({"detail": "Issue not found."}, status=status.HTTP_404_NOT_FOUND)

        triage_service = MaintenanceTriageService()
        triage_result = triage_service.analyze(issue)

        triage_request = AITriageRequest.objects.create(
            issue=issue,
            category=triage_result["category"],
            sub_category="",  # Placeholder for future sub-category extraction
            urgency=triage_result["urgency"],
            department=triage_result["department"],
            emergency=triage_result["emergency"],
            tenant_summary=triage_result["tenant_summary"],
            staff_recommendation=triage_result["staff_recommendation"],
            raw_response=triage_result,
            created_by=request.user,
        )

        serializer = AITriageRequestSerializer(triage_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        