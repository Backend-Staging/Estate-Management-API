import pytest
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db import IntegrityError

from core_apps.common.models import TimeStampedModel, ContentView
from core_apps.posts.models import Post
from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.mark.django_db
class TestTimeStampedModel:
    def test_timestamped_model_has_pkid(self, user_with_profile):
        profile = user_with_profile.profile
        assert hasattr(profile, "pkid")
        assert profile.pkid is not None

    def test_timestamped_model_has_id(self, user_with_profile):
        profile = user_with_profile.profile
        assert hasattr(profile, "id")
        assert profile.id is not None

    def test_timestamped_model_has_created_at(self, user_with_profile):
        profile = user_with_profile.profile
        assert hasattr(profile, "created_at")
        assert profile.created_at is not None

    def test_timestamped_model_has_updated_at(self, user_with_profile):
        profile = user_with_profile.profile
        assert hasattr(profile, "updated_at")
        assert profile.updated_at is not None

    def test_timestamped_model_ordering(self, db):
        user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=user1,
            occupation=Profile.Occupation.TENANT,
        )
        user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=user2,
            occupation=Profile.Occupation.TENANT,
        )
        profiles = list(Profile.objects.all())
        assert len(profiles) == 2


@pytest.mark.django_db
class TestContentView:
    def test_content_view_creation(self, user_with_profile):
        post = Post.objects.create(
            title="View Post",
            body="Body",
            author=user_with_profile,
        )
        content_type = ContentType.objects.get_for_model(post)
        view = ContentView.objects.create(
            content_type=content_type,
            object_id=post.pkid,
            user=user_with_profile,
            viewer_ip="127.0.0.1",
        )
        assert view.content_object == post
        assert view.user == user_with_profile
        assert view.viewer_ip == "127.0.0.1"

    def test_content_view_str(self, user_with_profile):
        post = Post.objects.create(
            title="Str Post",
            body="Body",
            author=user_with_profile,
        )
        content_type = ContentType.objects.get_for_model(post)
        view = ContentView.objects.create(
            content_type=content_type,
            object_id=post.pkid,
            user=user_with_profile,
            viewer_ip="127.0.0.1",
        )
        assert "viewed by" in str(view).lower()

    def test_content_view_anonymous(self, user_with_profile):
        post = Post.objects.create(
            title="Anonymous Post",
            body="Body",
            author=user_with_profile,
        )
        content_type = ContentType.objects.get_for_model(post)
        view = ContentView.objects.create(
            content_type=content_type,
            object_id=post.pkid,
            viewer_ip="127.0.0.1",
        )
        assert view.user is None
        assert "Anonymous" in str(view)

    def test_content_view_unique_together(self, user_with_profile):
        post = Post.objects.create(
            title="Unique Post",
            body="Body",
            author=user_with_profile,
        )
        content_type = ContentType.objects.get_for_model(post)
        ContentView.objects.create(
            content_type=content_type,
            object_id=post.pkid,
            user=user_with_profile,
            viewer_ip="127.0.0.1",
        )
        with pytest.raises(IntegrityError):
            ContentView.objects.create(
                content_type=content_type,
                object_id=post.pkid,
                user=user_with_profile,
                viewer_ip="127.0.0.1",
            )

    def test_content_view_record_view(self, user_with_profile):
        post = Post.objects.create(
            title="Record Post",
            body="Body",
            author=user_with_profile,
        )
        view, created = ContentView.record_view(post, user_with_profile, "127.0.0.1")
        assert created
        assert view.content_object == post

    def test_content_view_record_view_existing(self, user_with_profile):
        post = Post.objects.create(
            title="Existing Post",
            body="Body",
            author=user_with_profile,
        )
        ContentView.record_view(post, user_with_profile, "127.0.0.1")
        view, created = ContentView.record_view(post, user_with_profile, "127.0.0.1")
        assert not created
        assert view.content_object == post

    def test_content_view_record_view_integrity_error_handled(self, user_with_profile):
        post = Post.objects.create(
            title="Integrity Post",
            body="Body",
            author=user_with_profile,
        )
        content_type = ContentType.objects.get_for_model(post)
        ContentView.objects.create(
            content_type=content_type,
            object_id=post.pkid,
            user=user_with_profile,
            viewer_ip="127.0.0.1",
        )
        # Should not raise exception
        ContentView.record_view(post, user_with_profile, "127.0.0.1")
