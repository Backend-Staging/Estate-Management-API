from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from core_apps.profiles.models import Profile

User = get_user_model()


class RepairStaffCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=60)
    first_name = serializers.CharField(max_length=60)
    last_name = serializers.CharField(max_length=60)
    password = serializers.CharField(write_only=True, min_length=8)
    occupation = serializers.ChoiceField(choices=Profile.Occupation.choices)
    assigned_building = serializers.CharField(max_length=50)

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    @transaction.atomic
    def create(self, validated_data: dict) -> User:
        agent: User = self.context["request"].user
        occupation = validated_data.pop("occupation")
        assigned_building = validated_data.pop("assigned_building")
        password = validated_data.pop("password")
        user = User.objects.create_user(
            password=password,
            **validated_data,
        )
        profile = Profile.objects.get(user=user)
        profile.role = Profile.Role.REPAIR
        profile.occupation = occupation
        profile.managed_by_agent = agent
        profile.assigned_building = assigned_building
        profile.save(
            update_fields=[
                "role",
                "occupation",
                "managed_by_agent",
                "assigned_building",
                "updated_at",
            ]
        )
        return user
