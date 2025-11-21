import pytest
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework import status

from core_apps.posts.models import Post, Reply
from core_apps.profiles.models import Profile
from core_apps.common.models import ContentView

User = get_user_model()


@pytest.mark.django_db
class TestPostModel:
    def test_post_creation(self, user_with_profile):
        post = Post.objects.create(
            title="Test Post",
            body="Test body content",
            author=user_with_profile,
        )
        assert post.title == "Test Post"
        assert post.author == user_with_profile
        assert post.slug == "test-post"

    def test_post_str(self, user_with_profile):
        post = Post.objects.create(
            title="Test Post",
            body="Test body",
            author=user_with_profile,
        )
        assert str(post) == "Test Post"

    def test_post_slug_auto_generation(self, user_with_profile):
        post = Post.objects.create(
            title="Another Test Post",
            body="Body",
            author=user_with_profile,
        )
        assert post.slug == "another-test-post"

    def test_post_get_popular_tags(self, user_with_profile):
        post1 = Post.objects.create(
            title="Post 1",
            body="Body 1",
            author=user_with_profile,
        )
        post1.tags.add("django", "python")
        post2 = Post.objects.create(
            title="Post 2",
            body="Body 2",
            author=user_with_profile,
        )
        post2.tags.add("django")
        popular_tags = Post.get_popular_tags(limit=5)
        assert len(popular_tags) > 0

    def test_post_save_tenant_allowed(self, user_with_profile):
        post = Post(
            title="Tenant Post",
            body="Body",
            author=user_with_profile,
        )
        post.save()
        assert Post.objects.filter(title="Tenant Post").exists()

    def test_post_save_staff_allowed(self, staff_user):
        post = Post(
            title="Staff Post",
            body="Body",
            author=staff_user,
        )
        post.save()
        assert Post.objects.filter(title="Staff Post").exists()

    def test_post_save_technician_not_allowed(self, technician_user):
        post = Post(
            title="Tech Post",
            body="Body",
            author=technician_user,
        )
        with pytest.raises(ValueError, match="Only tenants"):
            post.save()


@pytest.mark.django_db
class TestReplyModel:
    def test_reply_creation(self, user_with_profile):
        post = Post.objects.create(
            title="Test Post",
            body="Body",
            author=user_with_profile,
        )
        reply = Reply.objects.create(
            post=post,
            author=user_with_profile,
            body="Reply content",
        )
        assert reply.post == post
        assert reply.author == user_with_profile
        assert reply.body == "Reply content"

    def test_reply_str(self, user_with_profile):
        post = Post.objects.create(
            title="Test Post",
            body="Body",
            author=user_with_profile,
        )
        reply = Reply.objects.create(
            post=post,
            author=user_with_profile,
            body="Reply",
        )
        assert "Reply by" in str(reply)
        assert "Test Post" in str(reply)


@pytest.mark.django_db
class TestPostViews:
    def test_post_list_view(self, api_client, user_with_profile):
        Post.objects.create(
            title="Public Post",
            body="Body",
            author=user_with_profile,
        )
        response = api_client.get("/api/v1/posts/")
        assert response.status_code == status.HTTP_200_OK
        assert "posts" in response.data

    def test_post_detail_view(self, api_client, user_with_profile):
        post = Post.objects.create(
            title="Detail Post",
            body="Body",
            author=user_with_profile,
        )
        response = api_client.get(f"/api/v1/posts/{post.slug}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Detail Post"

    def test_post_create_view(self, authenticated_client, user_with_profile):
        data = {
            "title": "New Post",
            "body": "New body",
            "tags": ["django", "python"],
        }
        response = authenticated_client.post("/api/v1/posts/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Post.objects.filter(title="New Post").exists()

    def test_post_update_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Update Post",
            body="Old body",
            author=user_with_profile,
        )
        data = {
            "title": "Updated Post",
            "body": "New body",
            "tags": ["updated"],
        }
        response = authenticated_client.patch(f"/api/v1/posts/{post.slug}/update/", data)
        assert response.status_code == status.HTTP_200_OK
        post.refresh_from_db()
        assert post.title == "Updated Post"

    def test_post_update_view_unauthorized(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        post = Post.objects.create(
            title="Other Post",
            body="Body",
            author=other_user,
        )
        data = {"title": "Hacked Post"}
        response = authenticated_client.patch(f"/api/v1/posts/{post.slug}/update/", data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_bookmark_post_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Bookmark Post",
            body="Body",
            author=user_with_profile,
        )
        response = authenticated_client.patch(f"/api/v1/posts/{post.slug}/bookmark/")
        assert response.status_code == status.HTTP_200_OK
        assert user_with_profile in post.bookmarked_by.all()

    def test_unbookmark_post_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Unbookmark Post",
            body="Body",
            author=user_with_profile,
        )
        post.bookmarked_by.add(user_with_profile)
        response = authenticated_client.patch(f"/api/v1/posts/{post.slug}/unbookmark/")
        assert response.status_code == status.HTTP_200_OK
        assert user_with_profile not in post.bookmarked_by.all()

    def test_bookmarked_posts_list_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Bookmarked Post",
            body="Body",
            author=user_with_profile,
        )
        post.bookmarked_by.add(user_with_profile)
        response = authenticated_client.get("/api/v1/posts/bookmarked/posts/")
        assert response.status_code == status.HTTP_200_OK
        assert "bookmarked_posts" in response.data

    def test_reply_create_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Reply Post",
            body="Body",
            author=user_with_profile,
        )
        data = {"body": "Reply body"}
        response = authenticated_client.post(f"/api/v1/posts/{post.id}/replies/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Reply.objects.filter(post=post).exists()

    def test_reply_list_view(self, api_client, user_with_profile):
        post = Post.objects.create(
            title="Replies Post",
            body="Body",
            author=user_with_profile,
        )
        Reply.objects.create(
            post=post,
            author=user_with_profile,
            body="Reply 1",
        )
        response = api_client.get(f"/api/v1/posts/{post.id}/replies/")
        assert response.status_code == status.HTTP_200_OK
        assert "replies" in response.data

    def test_upvote_post_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Upvote Post",
            body="Body",
            author=user_with_profile,
        )
        response = authenticated_client.patch(f"/api/v1/posts/{post.id}/upvote/")
        assert response.status_code == status.HTTP_200_OK
        post.refresh_from_db()
        assert post.upvotes == 1

    def test_downvote_post_view(self, authenticated_client, user_with_profile):
        post = Post.objects.create(
            title="Downvote Post",
            body="Body",
            author=user_with_profile,
        )
        response = authenticated_client.patch(f"/api/v1/posts/{post.id}/downvote/")
        assert response.status_code == status.HTTP_200_OK

    def test_popular_tags_list_view(self, api_client, user_with_profile):
        post = Post.objects.create(
            title="Tag Post",
            body="Body",
            author=user_with_profile,
        )
        post.tags.add("django")
        response = api_client.get("/api/v1/posts/popular-tags/")
        assert response.status_code == status.HTTP_200_OK
        assert "popular_tags" in response.data

    def test_top_posts_list_view(self, api_client, user_with_profile):
        Post.objects.create(
            title="Top Post",
            body="Body",
            author=user_with_profile,
            upvotes=10,
        )
        response = api_client.get("/api/v1/posts/top-posts/")
        assert response.status_code == status.HTTP_200_OK
        assert "top_posts" in response.data

    def test_posts_by_tag_list_view(self, api_client, user_with_profile):
        post = Post.objects.create(
            title="Tagged Post",
            body="Body",
            author=user_with_profile,
        )
        post.tags.add("django")
        response = api_client.get("/api/v1/posts/tags/django/")
        assert response.status_code == status.HTTP_200_OK
        assert "posts_by_tag" in response.data


@pytest.mark.django_db
class TestPostSerializers:
    def test_post_serializer(self, user_with_profile):
        from core_apps.posts.serializers import PostSerializer
        post = Post.objects.create(
            title="Serializer Post",
            body="Body",
            author=user_with_profile,
        )
        serializer = PostSerializer(post, context={"request": type("Request", (), {"user": user_with_profile})()})
        data = serializer.data
        assert data["title"] == "Serializer Post"
        assert "author_username" in data
        assert "is_bookmarked" in data

    def test_reply_serializer(self, user_with_profile):
        from core_apps.posts.serializers import ReplySerializer
        post = Post.objects.create(
            title="Post",
            body="Body",
            author=user_with_profile,
        )
        reply = Reply.objects.create(
            post=post,
            author=user_with_profile,
            body="Reply",
        )
        serializer = ReplySerializer(reply)
        data = serializer.data
        assert data["body"] == "Reply"
        assert "author_username" in data

