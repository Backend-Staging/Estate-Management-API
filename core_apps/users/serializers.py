from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers

User = get_user_model()


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]


class CustomUserSerializer(UserSerializer):
    full_name = serializers.ReadOnlyField(source="get_full_name")
    gender = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    occupation = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    reputation = serializers.SerializerMethodField()

    def get_gender(self, obj):
        p = getattr(obj, "profile", None)
        return p.gender if p else None

    def get_slug(self, obj):
        p = getattr(obj, "profile", None)
        return p.slug if p else None

    def get_role(self, obj):
        p = getattr(obj, "profile", None)
        return p.role if p else None

    def get_occupation(self, obj):
        p = getattr(obj, "profile", None)
        return p.occupation if p else None

    def get_phone_number(self, obj):
        p = getattr(obj, "profile", None)
        return str(p.phone_number) if p and p.phone_number else None

    def get_country(self, obj):
        p = getattr(obj, "profile", None)
        return p.country_of_origin if p else None

    def get_city(self, obj):
        p = getattr(obj, "profile", None)
        return p.city_of_origin if p else None

    def get_avatar(self, obj):
        p = getattr(obj, "profile", None)
        if not p or not p.avatar:
            return None
        try:
            return p.avatar.url
        except (AttributeError, ValueError):
            return None

    def get_reputation(self, obj):
        p = getattr(obj, "profile", None)
        return p.reputation if p else None

    class Meta(UserSerializer.Meta):
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "username",
            "slug",
            "full_name",
            "gender",
            "role",
            "occupation",
            "phone_number",
            "country",
            "city",
            "reputation",
            "avatar",
            "date_joined",
        ]
        read_only_fields = ["id", "email", "date_joined"]
