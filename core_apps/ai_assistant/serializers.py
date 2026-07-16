from rest_framework import serializers
from .models import AITriageRequest

class AITriageRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AITriageRequest
        fields = "__all__"

        read_only_fields = ["created_at", 
                            "updated_at", 
                            "raw_response", 
                            "created_by",
                            "category",
                            "sub_category",
                            "urgency",
                            "department",
                            "emergency",
                            "tenant_summary",
                            "staff_recommendation"]