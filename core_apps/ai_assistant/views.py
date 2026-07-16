from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core_apps.common.permissions import user_is_agent, user_is_repair
from core_apps.issues.models import Issue
from core_apps.issues.permissions import user_can_view_issue

from .models import AIWorkOrderInsight, AITriageRequest, PropertyKnowledgeArticle
from .serializers import (
    AITriageRequestSerializer,
    KnowledgeAnswerSerializer,
    KnowledgeQuerySerializer,
    OperationsAnalyticsSerializer,
    PropertyKnowledgeArticleSerializer,
    TenantChatResponseSerializer,
    TenantChatSerializer,
    WorkOrderInsightSerializer,
)
from .services.analytics_service import OperationsAnalyticsService
from .services.knowledge_service import KnowledgeAssistantService
from .services.tenant_chat_service import TenantCommunicationService
from .services.triage_service import MaintenanceTriageService
from .services.work_order_service import WorkOrderAssistantService


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
            return Response(
                {"detail": "Issue not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if not user_can_view_issue(request.user, issue):
            return Response(
                {"detail": "You do not have permission to triage this issue."},
                status=status.HTTP_403_FORBIDDEN,
            )

        triage_service = MaintenanceTriageService()
        triage_result = triage_service.analyze(issue)

        triage_request = AITriageRequest.objects.create(
            issue=issue,
            category=triage_result["category"],
            sub_category=triage_result.get("sub_category", ""),
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


class KnowledgeQueryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = KnowledgeQuerySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        building = ""
        profile = getattr(request.user, "profile", None)
        apartment = getattr(profile, "apartment", None) if profile else None
        if apartment:
            building = apartment.building

        service = KnowledgeAssistantService()
        result = service.answer(serializer.validated_data["question"], building=building)
        return Response(KnowledgeAnswerSerializer(result).data)


class KnowledgeArticleListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        articles = PropertyKnowledgeArticle.objects.filter(is_active=True)
        return Response(PropertyKnowledgeArticleSerializer(articles, many=True).data)


class WorkOrderAssistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, issue_id):
        if not (user_is_agent(request.user) or user_is_repair(request.user)):
            return Response(
                {"detail": "Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            issue = Issue.objects.select_related(
                "apartment", "reported_by", "assigned_to"
            ).get(id=issue_id)
        except Issue.DoesNotExist:
            return Response(
                {"detail": "Issue not found."}, status=status.HTTP_404_NOT_FOUND
            )

        service = WorkOrderAssistantService()
        result = service.analyze(issue)

        insight = AIWorkOrderInsight.objects.create(
            issue=issue,
            work_order_summary=result["work_order_summary"],
            suggested_tenant_response=result["suggested_tenant_response"],
            escalation_recommendation=result["escalation_recommendation"],
            duplicate_issue_ids=result.get("duplicate_issues", []),
            raw_response=result,
            created_by=request.user,
        )

        data = WorkOrderInsightSerializer(insight).data
        data["duplicate_issues"] = result.get("duplicate_issues", [])
        data["should_escalate"] = result.get("should_escalate", False)
        data["provider"] = result.get("provider", "rules")
        return Response(data, status=status.HTTP_201_CREATED)


class OperationsAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not (
            user_is_agent(request.user)
            or user_is_repair(request.user)
            or request.user.is_staff
        ):
            return Response(
                {"detail": "Staff access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        service = OperationsAnalyticsService()
        metrics = service.get_dashboard_metrics(user=request.user)
        return Response(OperationsAnalyticsSerializer(metrics).data)


class TenantChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TenantChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = TenantCommunicationService()
        result = service.respond(request.user, serializer.validated_data["message"])
        return Response(TenantChatResponseSerializer(result).data)
